import ArtMedia from '../components/ArtMedia';
import Stage from '../components/Stage';
import { dialogue } from '../data/dialogues';
import { band, ease, seg } from '../utils/math';

/** EARTH. A leaf, a landscape, a mature tree. Then the house is drawn around the tree, which stays. */
const draw = (t: number, len = 1000) => ({ strokeDasharray: len, strokeDashoffset: len * (1 - ease(t)) });

export default function EarthExperience() {
  const d = dialogue('EARTH');
  return (
    <Stage label="A house drawn around an existing tree" length={5.5} stills={[0.2, 1]} className="x-earth">
      {(p, mode) => {
        const live = mode === 'live';
        const zoom = live ? 1 + (1 - ease(seg(p, 0, 0.3))) * 3 : 1;
        const s = (a: number, b: number) => (live ? seg(p, a, b) : p > 0.5 ? 1 : 0);
        return (
          <div className="earth-room">
            <div className="earth-macro" style={{ transform: `scale(${zoom})`, opacity: live ? 1 - seg(p, 0.34, 0.44) : p < 0.5 ? 1 : 0 }}>
              <ArtMedia media={d.hero} decorative />
            </div>
            <svg viewBox="0 0 900 600" className="earth-drawing" aria-label="A tree stands first; foundation, walls and roof are drawn around it" role="img">
              <g stroke="#F1ECE2" fill="none" strokeWidth="1.4" style={{ opacity: s(0.38, 0.46) }}>
                <path d="M450 560 C445 470 455 410 450 330 C430 300 390 280 350 250 M450 360 C480 320 520 300 560 270 M450 420 C420 400 400 390 380 380" />
                <path d="M300 250 C260 160 360 80 450 90 C560 70 650 150 610 250 C660 300 560 340 450 320 C350 340 250 310 300 250Z" strokeWidth="1" />
                <path d="M380 560 C420 580 480 580 520 560" stroke="#898278" />
              </g>
              <g stroke="#B99A61" strokeWidth="1.6" fill="none">
                <path d="M120 560 H360 M540 560 H780" style={draw(s(0.5, 0.6), 700)} />
                <path d="M140 560 V300 M760 560 V300 M360 560 V420 M540 560 V420" style={draw(s(0.6, 0.72), 900)} />
                <path d="M100 300 H330 M570 300 H800" style={draw(s(0.72, 0.84), 700)} />
              </g>
              <g className="label-svg" fill="#898278" style={{ opacity: s(0.5, 0.6) }}>
                <text x="120" y="590">FOUNDATION STEPS AROUND THE ROOTS</text>
                <text x="600" y="290" style={{ opacity: s(0.72, 0.84) }}>ROOF OPENS FOR THE CANOPY</text>
              </g>
            </svg>
            <h2 className="monument-sm earth-rule" style={{ opacity: live ? band(p, 0.86, 0.9, 1.01, 1.02) : p > 0.5 ? 1 : 0 }}>
              <span>Nature first.</span><span><em>Architecture second.</em></span>
            </h2>
            <p className="label earth-step" style={{ opacity: live ? band(p, 0.36, 0.42, 0.84, 0.88) : 0 }}>
              {p < 0.5 ? 'The tree exists first' : p < 0.6 ? 'Foundation' : p < 0.72 ? 'Walls' : 'Roof'}
            </p>
          </div>
        );
      }}
    </Stage>
  );
}
