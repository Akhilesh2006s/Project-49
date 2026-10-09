import { useAudioZone } from '../audio/useAudioZone';
import CityField from '../components/CityField';
import Stage from '../components/Stage';
import { DIALOGUES } from '../data/dialogues';
import { band, seg } from '../utils/math';

/** Part 17. From one experience to seven, to forty-nine, to one city. */
export default function Project49Reveal() {
  return (
    <Stage id="project-49" label="PROJECT 49: 49 homes, 7 human experiences, 1 city" length={6} stills={[0.4, 0.55, 0.66, 0.84, 1]} className="reveal">
      {(p, mode, seen) => {
        const live = mode === 'live';
        useAudioZone(live ? p > 0.02 && p < 0.98 : seen, { bed: null, layers: { drone: 0.35, city: 0.05 } });
        const o = (a: number, b: number, c: number, d: number) => (live ? band(p, a, b, c, d) : p >= b && p <= c ? 1 : 0);
        return (
          <>
            <CityField stage={live ? p : Math.min(p + 0.2, 1)} label="Forty-nine points gathering into an abstract field of Hyderabad" />
            <div className="reveal-type">
              <p className="label reveal-from" style={{ opacity: o(0, 0.02, 0.1, 0.14) }}>From experience</p>
              <h2 className="monument" style={{ opacity: o(0.3, 0.36, 0.44, 0.48) }}>49 homes.</h2>
              <h2 className="monument" style={{ opacity: o(0.46, 0.51, 0.58, 0.62) }}>7 human experiences.</h2>
              <h2 className="monument" style={{ opacity: o(0.6, 0.65, 0.7, 0.73) }}>1 city.</h2>
              <div className="reveal-philosophy" style={{ opacity: o(0.73, 0.77, 0.9, 0.93) }}>
                <p className="narrative">The philosophy repeats.</p>
                <h2 className="monument" style={{ opacity: live ? seg(p, 0.8, 0.85) : 1 }}>The architecture<br /><em>never does.</em></h2>
              </div>
              <ul className="reveal-words" style={{ opacity: o(0.92, 0.96, 1.01, 1.02) }}>
                {DIALOGUES.map((d, i) => <li key={d.id} style={{ transitionDelay: `${i * 60}ms` }}><span className="label">{d.index}</span>{d.id}</li>)}
              </ul>
            </div>
          </>
        );
      }}
    </Stage>
  );
}
