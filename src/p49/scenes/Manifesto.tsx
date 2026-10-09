import { useAudioZone } from '../audio/useAudioZone';
import Stage from '../components/Stage';
import { BRAND } from '../config/brand';
import { band, ease, seg } from '../utils/math';

/** Part 14. The film's final lockup stays; scrolling pulls it apart and reveals what was behind it. */
export default function Manifesto() {
  return (
    <Stage id="philosophy" label="Your home is already changing you" length={3.2} stills={[0.05, 0.62, 1]} className="manifesto">
      {(p, mode, seen) => {
        const zoom = ease(seg(p, 0, 0.38));
        const lift = ease(seg(p, 0.45, 0.85));
        const still = mode === 'still';
        useAudioZone(mode === 'live' ? p > 0.02 && p < 0.98 : seen, { bed: null, layers: { drone: 0.25 } });
        return (
          <>
            <div className="title-lockup manifesto-title" aria-hidden={p > 0.3}
              style={still ? { opacity: p < 0.3 ? 1 : 0, display: p < 0.3 ? undefined : 'none' } : {
                opacity: 1 - seg(p, 0.22, 0.4),
                transform: `scale(${1 + zoom * 5})`,
                letterSpacing: `${0.04 + zoom * 1.1}em`,
              }}>
              <h1>{BRAND.projectName}</h1>
              <p className="label" style={{ opacity: 1 - seg(p, 0.02, 0.12) }}>{BRAND.projectDescriptor}</p>
            </div>
            <h2 className="monument manifesto-lines" aria-label="Your home is already changing you." style={still && p < 0.3 ? { display: 'none' } : undefined}>
              <span style={still ? { display: p > 0.9 ? 'none' : undefined } : { opacity: band(p, 0.2, 0.34, 0.62, 0.82), transform: `translateY(${-lift * 38}vh)` }}>Your home</span>
              <span style={still ? { display: p > 0.9 ? 'none' : undefined } : { opacity: band(p, 0.26, 0.4, 0.62, 0.82), transform: `translateY(${lift * 38}vh)` }}>is already</span>
              <span className="manifesto-last" style={still ? undefined : { opacity: seg(p, 0.32, 0.46), transform: `scale(${1 + lift * 0.18})` }}>changing you.</span>
            </h2>
          </>
        );
      }}
    </Stage>
  );
}
