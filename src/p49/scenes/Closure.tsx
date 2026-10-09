import { useAudioZone } from '../audio/useAudioZone';
import CityField from '../components/CityField';
import Stage from '../components/Stage';
import { BRAND } from '../config/brand';
import { band, seg } from '../utils/math';

/** Part 31. Hyderabad at night. Forty-nine positions; only real statuses are lit. Curiosity, not pressure. */
export default function Closure({ onIndex }: { onIndex: () => void }) {
  return (
    <Stage id="closure" label="There will only be forty-nine of these" length={4.2} stills={[0.2, 0.55, 1]} className="closure">
      {(p, mode, seen) => {
        const live = mode === 'live';
        useAudioZone(live ? p > 0.02 && p < 0.99 : seen, { bed: 'light-evening-crickets', level: 0.12, layers: { city: 0.12, drone: 0.2 } });
        const o = (a: number, b: number, c: number, d: number) => (live ? band(p, a, b, c, d) : p >= b && p <= c ? 1 : 0);
        return (
          <>
            <CityField stage={1} night isolate={live ? seg(p, 0.5, 0.65) : p > 0.5 ? 1 : 0} label="Hyderabad at night with forty-nine positions" />
            <div className="closure-type">
              <p className="narrative" style={{ opacity: o(0.02, 0.08, 0.26, 0.3) }}>There are millions of homes yet to be built.</p>
              <h2 className="monument" style={{ opacity: o(0.32, 0.38, 0.62, 0.66) }}>There will only be<br /><em>forty-nine of these.</em></h2>
              <div className="closure-lockup" style={{ opacity: o(0.7, 0.8, 1.01, 1.02), pointerEvents: (live ? p > 0.75 : p > 0.9) ? 'auto' : 'none' }}>
                <p className="closure-name">{BRAND.projectName}</p>
                <p className="label">{BRAND.lockup}</p>
                <div className="closure-actions">
                  <a className="line-button" href="#experiences">Explore {BRAND.projectName} <span aria-hidden="true">→</span></a>
                  <button className="line-button quiet" onClick={onIndex}>Discover your Human Index <span aria-hidden="true">→</span></button>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </Stage>
  );
}
