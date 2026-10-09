import { useAudioZone } from '../audio/useAudioZone';
import Stage from '../components/Stage';
import { band, ease, seg } from '../utils/math';

/**
 * Part 16. A sculptural human, drawn as contour lines, not anatomy. The
 * environment arrives around it one stimulus at a time: light, air, nature,
 * material, sound, boundary. No brains, no neurons.
 */
const PROFILE: [number, number][] = [[96, 0], [112, 22], [138, 33], [164, 30], [186, 18], [206, 16], [230, 70], [252, 92], [300, 82], [360, 64], [400, 58], [440, 70], [480, 66], [540, 50], [600, 38], [640, 30], [650, 0]];
function profile(y: number) {
  for (let k = 1; k < PROFILE.length; k++) {
    const [y0, w0] = PROFILE[k - 1], [y1, w1] = PROFILE[k];
    if (y <= y1) { const t = (y - y0) / (y1 - y0); return w0 + (w1 - w0) * (0.5 - Math.cos(Math.PI * t) / 2); }
  }
  return 0;
}

function Figure({ p }: { p: number }) {
  const k = (a: number, b: number) => ease(seg(p, a, b));
  const light = k(0.04, 0.16), air = k(0.1, 0.22), nature = k(0.16, 0.28), material = k(0.2, 0.32), sound = k(0.24, 0.36), boundary = k(0.28, 0.42);
  const rings = Array.from({ length: 27 }, (_, i) => i);
  return (
    <svg className="neuro-figure" viewBox="0 0 600 700" aria-hidden="true">
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F1ECE2" stopOpacity=".55" /><stop offset="1" stopColor="#F1ECE2" stopOpacity="0" /></linearGradient>
      </defs>
      {/* boundary: walls that close to a room, then open */}
      <g stroke="#898278" strokeWidth="1" fill="none" opacity={boundary}>
        <path d={`M${60 + (1 - boundary) * -80} 70 V640`} /><path d={`M${540 + (1 - boundary) * 80} 70 V640`} />
        <path d="M60 70 H250 M350 70 H540" />
      </g>
      {/* light: a blade from the opening in the roof */}
      <polygon points={`250,70 350,70 ${420 + light * 60},560 ${300 + light * 20},560`} fill="url(#beam)" opacity={light * 0.8} />
      {/* air: lines passing through */}
      <g stroke="#F1ECE2" strokeWidth=".8" fill="none" opacity={air * 0.5}>
        {[180, 240, 300].map((y, i) => <path key={y} d={`M0 ${y} C150 ${y - 20 + i * 8}, 300 ${y + 30}, 600 ${y - 10}`} strokeDasharray="4 10" style={{ strokeDashoffset: -p * 900 }} />)}
      </g>
      {/* nature: leaf shadow falling across the floor */}
      <g fill="#151411" stroke="#898278" strokeWidth=".6" opacity={nature}>
        <path d="M430 600 q40 -60 110 -50 q-30 70 -110 50z" /><path d="M470 590 l50 -30" />
        <path d="M90 612 q30 -40 80 -34 q-24 48 -80 34z" />
      </g>
      {/* material: a floor of stone blocks */}
      <g stroke="#898278" strokeWidth=".7" fill="none" opacity={material}>
        <path d="M40 640 H560" />{[100, 180, 260, 340, 420, 500].map(x => <path key={x} d={`M${x} 640 v24`} />)}<path d="M40 664 H560" />
      </g>
      {/* sound: rings around the head that settle */}
      <g stroke="#B99A61" strokeWidth=".8" fill="none">
        {[1, 2, 3].map(i => <circle key={i} cx="300" cy="210" r={60 + i * 34 * sound} opacity={sound * (0.5 - i * 0.12)} />)}
      </g>
      {/* the human: contour rings following a standing figure's profile */}
      <g stroke="#F1ECE2" fill="none" strokeWidth=".9">
        {rings.map(i => {
          const y = 96 + i * 21;
          const w = profile(y);
          return w > 0 ? <ellipse key={i} cx="300" cy={y} rx={w} ry={2 + w * 0.08} opacity={0.3 + 0.55 * Math.min(1, w / 60)} /> : null;
        })}
      </g>
    </svg>
  );
}

export default function NeuroArchitecture() {
  return (
    <Stage id="neuroarchitecture" label="NeuroArchitecture" length={5} stills={[0.3, 0.6, 0.95]} className="neuro">
      {(p, mode, seen) => {
        const live = mode === 'live';
        useAudioZone(live ? p > 0.02 && p < 0.98 : seen, { bed: 'breeze', level: 0.08, layers: { drone: 0.2 } });
        const o = (a: number, b: number, c: number, d: number) => (live ? band(p, a, b, c, d) : p >= b && p <= c ? 1 : 0);
        return (
          <div className="neuro-grid">
            <Figure p={live ? p : 1} />
            <div className="neuro-copy">
              <div className="neuro-phase" style={{ opacity: o(0.02, 0.1, 0.4, 0.46) }}>
                <p className="label">01 · The foundation</p>
                <h2 className="monument-sm">NeuroArchitecture</h2>
                <p className="narrative">An exploration of how built environments interact with human perception, cognition, emotion and behaviour.</p>
                <ul className="neuro-stimuli label" aria-label="Stimuli">
                  {['Light', 'Air', 'Nature', 'Material', 'Sound', 'Spatial boundary'].map((s, i) => <li key={s} style={{ opacity: live ? seg(p, 0.04 + i * 0.05, 0.12 + i * 0.05) : 1 }}>{s}</li>)}
                </ul>
              </div>
              <h2 className="neuro-phase monument-sm" style={{ opacity: o(0.48, 0.55, 0.68, 0.73) }}>We don&rsquo;t begin<br />with what a house<br />should look like.</h2>
              <h2 className="neuro-phase monument-sm" style={{ opacity: o(0.75, 0.82, 1.01, 1.02) }}>We begin with<br />what a human<br /><em>should experience.</em></h2>
            </div>
          </div>
        );
      }}
    </Stage>
  );
}
