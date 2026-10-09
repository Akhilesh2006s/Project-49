import { useAudioZone } from '../audio/useAudioZone';
import Stage from '../components/Stage';
import { band } from '../utils/math';

/** Part 30. */
const ERAS = [['Luxury 1.0', 'Ownership'], ['Luxury 2.0', 'Brands'], ['Luxury 3.0', 'Customisation']];
const UNDERSTANDING = ['climate.', 'place.', 'culture.', 'the family.', 'the human mind.'];

export default function LuxuryReframed() {
  return (
    <Stage id="luxury" label="Luxury reframed" length={5.5} stills={[0.05, 0.15, 0.25, 0.4, 0.52, 0.65, 0.8, 0.95]} className="luxury">
      {(p, mode, seen) => {
        const live = mode === 'live';
        const o = (a: number, b: number, c: number, d: number) => (live ? band(p, a, b, c, d) : p >= b && p <= c ? 1 : 0);
        useAudioZone(live ? p > 0.3 && p < 0.42 : false, { bed: null, duck: 0.05 });
        useAudioZone(live ? p >= 0.42 && p < 0.98 : seen, { bed: null, layers: { drone: 0.3 } });
        return (
          <div className="luxury-frame">
            {ERAS.map(([k, v], i) => (
              <div key={k} className="luxury-era" style={{ opacity: o(i * 0.1, i * 0.1 + 0.02, i * 0.1 + 0.08, i * 0.1 + 0.1) }}>
                <h2 className="monument">{k}</h2><p className="label">{v}</p>
              </div>
            ))}
            <h2 className="monument luxury-next" style={{ opacity: o(0.32, 0.36, 0.42, 0.44) }}>What comes next?</h2>
            <h2 className="monument luxury-answer" style={{ opacity: o(0.45, 0.48, 0.56, 0.59) }}><em>Understanding.</em></h2>
            <ul className="luxury-list narrative" style={{ opacity: o(0.59, 0.61, 0.7, 0.72) }}>
              {UNDERSTANDING.map(u => <li key={u}>Understanding {u}</li>)}
            </ul>
            <p className="luxury-x" style={{ opacity: o(0.72, 0.75, 0.84, 0.86) }}>
              <span>NeuroArchitecture</span><i>×</i><span>Climate</span><i>×</i><span>Culture</span><i>×</i><span>Craft</span>
            </p>
            <h2 className="monument-sm luxury-stance" style={{ opacity: o(0.86, 0.9, 1.01, 1.02) }}>
              We are not introducing another style of luxury to Hyderabad.<br /><em>We are questioning what luxury should mean in the first place.</em>
            </h2>
          </div>
        );
      }}
    </Stage>
  );
}
