import { useAudioZone } from '../audio/useAudioZone';
import Stage from '../components/Stage';
import { BRAND } from '../config/brand';
import { band, seg } from '../utils/math';

/** Part 32. The one place AYRA × ANXA take the stage, with their responsibilities kept distinct. */
export default function BrandClosure() {
  return (
    <Stage id="ayra-anxa" label="AYRA × ANXA" length={4.5} stills={[0.12, 0.4, 0.62, 0.8, 1]} className="brand">
      {(p, mode, seen) => {
        const live = mode === 'live';
        useAudioZone(live ? p > 0.02 && p < 0.99 : seen, { bed: null, layers: { drone: 0.18 } });
        const o = (a: number, b: number, c: number, d: number) => (live ? band(p, a, b, c, d) : p >= b && p <= c ? 1 : 0);
        return (
          <div className="brand-frame">
            <div className="brand-p49" style={{ opacity: o(0, 0.05, 0.2, 0.25) }}>
              <h2>{BRAND.projectName}</h2><p className="label">{BRAND.projectDescriptor}</p>
            </div>
            <div className="brand-pair" style={{ opacity: o(0.27, 0.34, 0.5, 0.55) }}>
              <div><h3>{BRAND.designBrand}</h3><p className="label">{BRAND.designRole}</p></div>
              <i className="brand-sep" aria-hidden="true" style={{ transform: `scaleY(${live ? seg(p, 0.3, 0.4) : 1})` }} />
              <div><h3>{BRAND.executionBrand}</h3><p className="label">{BRAND.executionRole}</p></div>
            </div>
            <h2 className="monument-sm brand-line" style={{ opacity: o(0.55, 0.6, 0.68, 0.72) }}>From human experience<br /><em>to architectural thought.</em></h2>
            <h2 className="monument-sm brand-line" style={{ opacity: o(0.72, 0.77, 0.85, 0.88) }}>From architectural thought<br /><em>to built reality.</em></h2>
            <div className="brand-final" style={{ opacity: o(0.89, 0.94, 1.01, 1.02) }}>
              <p className="brand-final-name">{BRAND.projectName}</p>
              <p className="label">{BRAND.projectDescriptor}</p>
              <p className="label">{BRAND.lockup}</p>
              <p className="brand-final-pair">{BRAND.designBrand} <i>×</i> {BRAND.executionBrand}</p>
              <p className="label">{BRAND.designBrand} — {BRAND.designRole} &nbsp;·&nbsp; {BRAND.executionBrand} — {BRAND.executionRole}</p>
              <p className="label">{BRAND.location}</p>
            </div>
          </div>
        );
      }}
    </Stage>
  );
}
