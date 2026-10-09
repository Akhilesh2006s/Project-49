import { useEffect, useMemo } from 'react';
import { audio } from '../audio/AudioEngine';
import { useAudioZone } from '../audio/useAudioZone';
import Stage from '../components/Stage';
import { band, rng, seg } from '../utils/math';

/** Part 15. The vocabulary of conventional luxury accumulates until it becomes noise, then everything is withdrawn. */
const TERMS = ['SQUARE FEET', 'MARBLE', 'AUTOMATION', 'BRANDS', 'FINISHES', 'FURNITURE', 'LIGHTING', 'FITTINGS', 'SPECIFICATIONS', 'PRICE'];

export default function SensoryOverload() {
  const words = useMemo(() => {
    const r = rng(15);
    return Array.from({ length: 64 }, (_, i) => ({
      text: TERMS[i % TERMS.length],
      x: 4 + r() * 84, y: 8 + r() * 80,
      size: i < 10 ? 1 : 0.45 + r() * 0.9,
      rot: r() < 0.12 ? 90 : 0,
      at: i / 64,
    }));
  }, []);
  return (
    <Stage id="overload" label="Sensory overload" length={4.4} stills={[0.5, 1]} className="overload">
      {(p, mode, seen) => {
        const live = mode === 'live';
        const fill = seg(p, 0.04, 0.56);
        const gone = seg(p, 0.58, 0.62);
        const busy = live ? fill * (1 - gone) : p < 0.9 ? 1 : 0;
        useDensity(live && p > 0.01 && p < 0.99 ? busy : -1);
        useAudioZone(live ? p > 0.6 && p < 0.99 : seen && p > 0.9, { bed: null, duck: 1, layers: { drone: 0.08 } });
        return (
          <>
            <div className="overload-field" aria-hidden="true" style={{ opacity: live ? 1 - gone : busy }}>
              {words.map((w, i) => (
                <span key={i} style={{
                  left: `${w.x}%`, top: `${w.y}%`, fontSize: `calc(${w.size} * var(--overload-size))`,
                  opacity: live ? (fill > w.at ? (i < 10 ? 0.95 : 0.35 + (i % 5) * 0.1) : 0) : i < 10 ? 0.95 : 0.4,
                  transform: w.rot ? 'rotate(90deg)' : undefined,
                }}>{w.text}</span>
              ))}
            </div>
            <p className="sr-only">Square feet, marble, automation, brands, finishes, furniture, lighting, fittings, specifications, price.</p>
            <h2 className="monument overload-question" style={{ opacity: live ? seg(p, 0.66, 0.8) : p > 0.9 ? 1 : 0 }}>
              <span>But how</span><span>should your home</span><span><em>make you feel?</em></span>
            </h2>
            <div className="overload-meter" aria-hidden="true" style={{ opacity: live ? band(p, 0.05, 0.1, 0.55, 0.6) : 0 }}>
              <i style={{ transform: `scaleX(${fill})` }} />
            </div>
          </>
        );
      }}
    </Stage>
  );
}

/** Cognitive load is audible: density rises with the words, collapses with them. -1 releases the layer. */
function useDensity(level: number) {
  const q = Math.round(level * 20) / 20;
  useEffect(() => {
    if (q < 0) { audio.layer('density', 0, 0.2); return; }
    audio.layer('density', q, 0.3);
    audio.layer('city', q * 0.6, 0.3);
    if (q === 0) { audio.layer('city', 0, 0.08); audio.layer('density', 0, 0.08); }
  }, [q]);
}
