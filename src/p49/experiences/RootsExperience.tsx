import { useEffect, useRef } from 'react';
import { audio } from '../audio/AudioEngine';
import ArtMedia from '../components/ArtMedia';
import Stage from '../components/Stage';
import { dialogue } from '../data/dialogues';
import { band, ease, lerp, seg } from '../utils/math';

/**
 * ROOTS. A traditional courtyard plan (chowk, otla, rooms around a court) is
 * redrawn, line by line, into a contemporary plan. What survives is the
 * intelligence: threshold, court, shade, the order of arrival. Not the ornament.
 */
type Seg = [number, number, number, number];
const TRADITIONAL: Seg[] = [
  [100, 100, 700, 100], [700, 100, 700, 600], [700, 600, 100, 600], [100, 600, 100, 100],
  [280, 260, 520, 260], [520, 260, 520, 440], [520, 440, 280, 440], [280, 440, 280, 260],
  [100, 260, 280, 260], [520, 260, 700, 260], [100, 440, 280, 440], [520, 440, 700, 440],
  [340, 600, 460, 600], [360, 600, 360, 660], [440, 600, 440, 660],
];
const CONTEMPORARY: Seg[] = [
  [60, 140, 560, 140], [560, 140, 560, 620], [560, 620, 60, 620], [60, 620, 60, 140],
  [300, 280, 760, 280], [760, 280, 760, 520], [760, 520, 300, 520], [300, 520, 300, 280],
  [60, 280, 300, 280], [560, 140, 800, 140], [60, 520, 300, 520], [560, 620, 800, 620],
  [200, 620, 340, 620], [220, 620, 220, 690], [320, 620, 320, 690],
];
const KEEP = [
  { at: 0.3, text: 'Threshold: the order of arrival is kept' },
  { at: 0.45, text: 'Courtyard: opened to the garden, still the centre' },
  { at: 0.6, text: 'Shade: the otla becomes a deep verandah' },
  { at: 0.75, text: 'Craft: local stone, worked by hand' },
];

export default function RootsExperience() {
  const d = dialogue('ROOTS');
  const knocked = useRef(false);
  useEffect(() => () => { knocked.current = false; }, []);
  return (
    <Stage label="A traditional courtyard plan redrawn as contemporary architecture" length={5} stills={[0.1, 1]} className="x-roots">
      {(p, mode) => {
        const live = mode === 'live';
        const t = live ? ease(seg(p, 0.2, 0.85)) : p;
        if (live && p > 0.18 && !knocked.current) { knocked.current = true; void audio.once('roots-wooden-door', 0.35); }
        return (
          <div className="roots-stage">
            <div className="roots-memory" style={{ ['--reveal' as string]: `${(live ? seg(p, 0.05, 0.9) : p) * 100}%` }}>
              <ArtMedia media={d.hero} decorative className="roots-now" />
              <ArtMedia media={d.studies[0]} decorative video={false} className="roots-then" />
            </div>
            <svg viewBox="0 0 860 720" className="roots-plan" role="img" aria-label="Plan lines moving from a traditional courtyard house to a contemporary plan">
              <g stroke="#F1ECE2" strokeWidth="1.4">
                {TRADITIONAL.map((a, i) => {
                  const b = CONTEMPORARY[i];
                  return <line key={i} x1={lerp(a[0], b[0], t)} y1={lerp(a[1], b[1], t)} x2={lerp(a[2], b[2], t)} y2={lerp(a[3], b[3], t)} />;
                })}
              </g>
              <g className="label-svg" fill="#898278">
                <text x={lerp(360, 480, t)} y={lerp(355, 405, t)}>{t < 0.5 ? 'CHOWK' : 'COURT'}</text>
                <text x={lerp(350, 210, t)} y={lerp(700, 712, t)}>THRESHOLD</text>
                <text x="40" y="40">{t < 0.5 ? 'TRADITIONAL · INWARD, SHADED, ORDERED' : 'CONTEMPORARY · THE SAME INTELLIGENCE, REDRAWN'}</text>
              </g>
            </svg>
            <ul className="roots-keep">
              {KEEP.map(k => <li key={k.text} style={{ opacity: live ? band(p, k.at, k.at + 0.05, 0.94, 1.01) : 1 }}>{k.text}</li>)}
            </ul>
          </div>
        );
      }}
    </Stage>
  );
}
