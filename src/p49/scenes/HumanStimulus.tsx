import Stage from '../components/Stage';
import { clamp, seg } from '../utils/math';

/** The visitor scrolls through the words, not past a flowchart. */
const WORDS = ['Human', 'Stimulus', 'Space', 'Experience'];

export default function HumanStimulus() {
  return (
    <Stage id="stimulus" label="Human, stimulus, space, experience" length={3.6} stills={[1]} className="stimulus">
      {(p, mode) => {
        if (mode === 'still') return <ol className="stimulus-still">{WORDS.map(w => <li key={w} className="monument">{w}</li>)}</ol>;
        const cam = seg(p, 0, 0.9) * (WORDS.length - 1);
        return (
          <ol className="stimulus-depth" aria-label={WORDS.join(', then ')}>
            {WORDS.map((w, i) => {
              const d = i - cam;               // >0 ahead, <0 passed through
              const z = -d * 900;
              const op = d < -0.35 ? 0 : clamp(1 - Math.abs(d) * 0.55) * (d < 0 ? clamp(1 + d * 2.8) : 1);
              return (
                <li key={w} className="monument" style={{ transform: `translate(-50%,-50%) translateZ(${z}px)`, opacity: op, filter: `blur(${Math.max(0, Math.abs(d) - 0.2) * 3}px)` }}>
                  <span className="label stimulus-index">0{i + 1}</span>{w}
                </li>
              );
            })}
          </ol>
        );
      }}
    </Stage>
  );
}
