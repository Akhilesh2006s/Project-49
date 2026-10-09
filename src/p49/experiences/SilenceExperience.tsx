import { useEffect } from 'react';
import { audio } from '../audio/AudioEngine';
import Stage from '../components/Stage';
import { seg } from '../utils/math';

/**
 * SILENCE. A room full of demands. Scrolling removes them one category at a
 * time; the city outside attenuates with them and the page itself slows.
 */
const STEPS = [
  { at: 0.12, text: 'Services disappear' },
  { at: 0.27, text: 'Storage absorbs objects' },
  { at: 0.42, text: 'Reflections soften' },
  { at: 0.57, text: 'Views simplify' },
  { at: 0.72, text: 'Traffic attenuates' },
  { at: 0.86, text: 'Circulation becomes clear' },
];

function Room({ p }: { p: number }) {
  const gone = (i: number) => 1 - seg(p, STEPS[i].at, STEPS[i].at + 0.08);
  return (
    <svg viewBox="0 0 900 560" className="silence-room" aria-hidden="true">
      <g stroke="#F1ECE2" strokeWidth="1.2" fill="none"><path d="M60 500 H840 M60 500 V60 H840 V500" /><rect x="520" y="140" width="260" height="200" /></g>
      <g stroke="#898278" fill="none" style={{ opacity: gone(0) }}>
        <rect x="120" y="80" width="140" height="36" /><path d="M140 116 V160 M180 116 C180 200 300 200 300 300 M240 116 C240 180 400 160 420 260" />
        <rect x="380" y="200" width="100" height="60" /><path d="M430 260 V500" strokeDasharray="2 6" />
      </g>
      <g fill="#151411" stroke="#898278" style={{ opacity: gone(1) }}>
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={90 + (i % 7) * 52} y={380 + Math.floor(i / 7) * 46 + ((i * 37) % 18)} width={22 + ((i * 13) % 24)} height={18 + ((i * 7) % 20)} />)}
      </g>
      <g stroke="#F1ECE2" strokeWidth=".6" style={{ opacity: gone(2) * 0.6 }}>
        {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${540 + i * 40} 150 l40 180`} />)}<path d="M100 470 l600 -20" />
      </g>
      <g stroke="#898278" fill="none" style={{ opacity: gone(3) }}>
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={530 + i * 27} y={200 + ((i * 29) % 90)} width="18" height={140 - ((i * 29) % 90)} />)}
      </g>
      <g stroke="#B99A61" className="silence-traffic" style={{ opacity: gone(4) }}>
        {[0, 1, 2].map(i => <path key={i} d={`M530 ${300 + i * 12} h240`} strokeDasharray="10 14" />)}
      </g>
      <g stroke="#898278" strokeDasharray="3 5" fill="none" style={{ opacity: gone(5) }}>
        <path d="M90 300 C200 240 260 360 380 280 S560 420 700 380" /><path d="M120 200 C260 300 200 420 420 440" />
      </g>
      <path d="M100 480 H500" stroke="#F1ECE2" strokeWidth="1" style={{ opacity: seg(p, 0.9, 1) }} />
    </svg>
  );
}

export default function SilenceExperience() {
  useEffect(() => () => { audio.duck(1, 0.6); audio.layer('city', 0); document.documentElement.style.removeProperty('--slow'); }, []);
  return (
    <Stage label="Removing sensory demand from a room" length={5.5} stills={[0, 1]} className="x-silence">
      {(p, mode) => {
        const q = mode === 'live' ? p : p;
        useSilence(mode === 'live' ? q : -1);
        return (
          <div className="silence-stage">
            <Room p={q} />
            <ol className="silence-steps">
              {STEPS.map(s => <li key={s.text} className={q > s.at + 0.04 ? 'is-done' : ''}><span className="label">{s.text}</span></li>)}
            </ol>
            <p className="narrative silence-note" style={{ opacity: seg(q, 0.9, 1) }}>
              Silence is not simply the absence of sound. It can also mean less unnecessary sensory demand.
            </p>
          </div>
        );
      }}
    </Stage>
  );
}

/** The city fades with the clutter; the whole page slows its transitions. */
function useSilence(p: number) {
  const q = Math.round(p * 20) / 20;
  useEffect(() => {
    if (q < 0) return;
    audio.layer('city', Math.max(0, 0.7 - q), 0.8);
    audio.duck(Math.max(0.03, 1 - q * 0.97), 0.8);
    document.documentElement.style.setProperty('--slow', String(1 + q * 2));
  }, [q]);
}
