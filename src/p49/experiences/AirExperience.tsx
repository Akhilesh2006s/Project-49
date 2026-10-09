import { useCallback, useEffect, useState } from 'react';
import { audio } from '../audio/AudioEngine';
import Particles from '../components/Particles';
import Stage from '../components/Stage';
import { band, seg } from '../utils/math';

/**
 * AIR. The drawing is a live section: air enters low on the windward side,
 * crosses the courtyard, rises and leaves through the high vent. Close the
 * openings and it stops; a machine starts. Open them and the wind returns.
 */
const LABELS = [
  { at: 0.12, x: 12, y: 70, text: 'Cross ventilation' },
  { at: 0.26, x: 72, y: 20, text: 'Stack effect' },
  { at: 0.4, x: 44, y: 54, text: 'Thermal buffer · courtyard' },
  { at: 0.54, x: 22, y: 26, text: 'Shade' },
  { at: 0.66, x: 82, y: 62, text: 'Microclimate' },
];

export default function AirExperience() {
  const [open, setOpen] = useState(true);
  const path = useCallback((x: number, y: number): [number, number] => {
    // enter low-left, lift through the courtyard (x .45–.6), exit high-right
    const lift = x > 0.42 && x < 0.66 ? -0.9 : x > 0.66 ? -0.25 : 0.05;
    const target = x < 0.42 ? 0.72 : 0.22;
    return [1, lift * 0.6 + (target - y) * 0.8];
  }, []);

  useEffect(() => {
    if (open) { audio.layer('hum', 0, 1.5); void audio.bedTo('breeze', 0.3, 1.2); }
    else { void audio.bedTo(null, 0, 0.6); audio.layer('hum', 0.9, 2.5); }
  }, [open]);
  useEffect(() => () => { audio.layer('hum', 0); }, []);

  return (
    <Stage label="Air moving through a house" length={4.5} stills={[1]} className="x-air">
      {(p, mode) => {
        const live = mode === 'live';
        return (
          <div className={'air-room' + (open ? '' : ' is-closed')}>
            <Particles flow={open ? 1 : 0} path={path} className="air-particles" />
            <svg viewBox="0 0 1000 560" className="air-section" aria-hidden="true">
              <g stroke="#F1ECE2" strokeWidth="1.3" fill="none">
                <path d="M40 500 H960" />
                <path d="M100 500 V200 L420 140 V500 M660 500 V140 L900 200 V500" />
                <path d="M100 200 L60 215 M900 200 L940 215" />
                <path d="M660 140 V90 H760 V140" />
              </g>
              <g stroke="#B99A61" strokeWidth="3">
                <path d={open ? 'M100 430 V470' : 'M100 400 V500'} />
                <path d={open ? 'M760 95 H720' : 'M660 95 H760'} />
              </g>
              <g className="air-curtain" stroke="#898278" strokeWidth="1" fill="none">
                {[0, 1, 2, 3].map(i => <path key={i} d={`M${130 + i * 10} 210 Q${140 + i * 10 + (open ? 26 : 2)} 330 ${130 + i * 10 + (open ? 34 : 0)} 470`} />)}
              </g>
              <g fill="#151411" stroke="#898278"><path d="M470 500 q20 -120 40 -180 q20 60 40 180z" /></g>
              <text x="470" y="530" className="label-svg" fill="#898278">COURTYARD</text>
            </svg>
            {LABELS.map(l => (
              <span key={l.text} className="label air-label" style={{ left: `${l.x}%`, top: `${l.y}%`, opacity: live ? band(p, l.at, l.at + 0.05, 0.9, 0.98) : 1 }}>{l.text}</span>
            ))}
            <div className="air-control" style={{ opacity: live ? seg(p, 0.05, 0.12) : 1 }}>
              <button className="line-button" aria-pressed={!open} onClick={() => setOpen(o => !o)}>
                {open ? 'Close the openings' : 'Open them again'}
              </button>
              <p className="narrative air-status" aria-live="polite">{open ? 'The building breathes.' : 'Air stops. A machine takes over.'}</p>
            </div>
          </div>
        );
      }}
    </Stage>
  );
}
