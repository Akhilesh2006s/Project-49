import Stage from '../components/Stage';
import { band, seg } from '../utils/math';

/** Part 27. The order of design is reversed. The human moves to the front. */
const CONVENTIONAL = ['Requirements', 'Plan', 'Elevation', 'Materials', 'Interior'];
const P49 = ['Human', 'Experience', 'Environment', 'Architecture', 'Material', 'Detail'];
const INVESTIGATE = ['Rhythm', 'Stimulation', 'Privacy', 'Light', 'Sound', 'Nature', 'Memory', 'Ritual', 'Movement', 'Change'];

export default function HumanBrief() {
  return (
    <Stage id="human-brief" label="The human brief" length={3.6} stills={[0.3, 1]} className="brief">
      {(p, mode) => {
        const live = mode === 'live';
        const flip = live ? seg(p, 0.35, 0.6) : p > 0.5 ? 1 : 0;
        return (
          <div className="brief-grid">
            <div className="brief-head">
              <p className="label">P49 / Human Index · The brief</p>
              <p className="narrative">Before asking how many rooms a family needs, we try to understand how that family lives.</p>
              <ul className="brief-investigate label">{INVESTIGATE.map((w, i) => <li key={w} style={{ opacity: live ? seg(p, 0.02 + i * 0.025, 0.08 + i * 0.025) : 1 }}>{w}</li>)}</ul>
            </div>
            <div className="brief-sequences">
              <ol className="brief-seq brief-conventional" style={{ opacity: 1 - flip * 0.75 }} aria-label="Conventional sequence">
                <li className="label">Conventional</li>
                {CONVENTIONAL.map(w => <li key={w}>{w}</li>)}
              </ol>
              <ol className="brief-seq brief-p49" style={{ opacity: live ? band(p, 0.4, 0.6, 1.01, 1.02) : flip }} aria-label="PROJECT 49 sequence">
                <li className="label">PROJECT 49</li>
                {P49.map((w, i) => <li key={w} className={i === 0 ? 'is-human' : ''} style={{ transform: `translateX(${(1 - flip) * 30}px)` }}>{i > 0 && <span aria-hidden="true">→ </span>}{w}</li>)}
              </ol>
            </div>
          </div>
        );
      }}
    </Stage>
  );
}
