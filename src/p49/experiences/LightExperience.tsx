import { PointerEvent, useState } from 'react';
import LightField from '../components/LightField';
import Stage from '../components/Stage';
import { band, lerp, seg } from '../utils/math';

/**
 * LIGHT. The architecture never moves; the sun does. Scroll is the day.
 * The section drawing is geometrically honest: light through the clerestory,
 * the courtyard and the jaali lands where the sun angle says it should.
 */
const TIMES = [
  { at: 0.12, label: '06:12', note: 'Low eastern light reaches deep into the plan.' },
  { at: 0.38, label: '09:43', note: 'The jaali breaks the sun into pattern; glare is filtered, not blocked.' },
  { at: 0.62, label: '13:06', note: 'Overhead sun is held back by the deep reveal. The courtyard carries the light.' },
  { at: 0.88, label: '17:51', note: 'Warm western light arrives on the shadow wall. The day becomes visible.' },
];

function Section({ sun }: { sun: number }) {
  // sun 0 = morning (east, left), 1 = evening (west, right)
  const ang = lerp(18, 162, sun) * (Math.PI / 180);
  const dx = Math.cos(ang), dy = Math.sin(ang);
  const floorY = 420, roofY = 120;
  const land = (x: number, y: number) => x - (dx / dy) * (floorY - y); // where a ray from (x,y) meets the floor
  const cl = [320, 380], ct = [520, 640];
  const patch = (a: number, b: number, y: number) => `${a},${y} ${b},${y} ${land(b, y)},${floorY} ${land(a, y)},${floorY}`;
  const warm = `hsl(${lerp(38, 28, Math.abs(sun - 0.5) * 2)} 70% ${lerp(78, 70, Math.abs(sun - 0.5) * 2)}%)`;
  return (
    <svg viewBox="0 0 800 480" className="light-section" role="img" aria-label="Section of a house showing where daylight lands through a clerestory, courtyard and jaali screen as the sun moves">
      <g fill={warm} opacity={0.18 + 0.2 * Math.sin(sun * Math.PI)}>
        <polygon points={patch(cl[0], cl[1], roofY)} />
        <polygon points={patch(ct[0], ct[1], roofY - 30)} />
      </g>
      <g fill={warm} opacity={0.12 + 0.22 * (1 - sun)}>
        {Array.from({ length: 7 }, (_, i) => { const y = 250 + i * 20; return <polygon key={i} points={`80,${y} 80,${y + 9} ${80 + 180 * (1 - sun) + 40},${floorY} ${80 + 180 * (1 - sun) + 30},${floorY}`} />; })}
      </g>
      <g stroke="#F1ECE2" strokeWidth="1.2" fill="none">
        <path d={`M40 ${floorY} H760`} />
        <path d={`M80 ${floorY} V${roofY} H${cl[0]} M${cl[1]} ${roofY} H470 V${roofY - 30} H${ct[0]} M${ct[1]} ${roofY - 30} H720 V${floorY}`} />
        <path d={`M${cl[0]} ${roofY} V${roofY - 40} H${cl[1]} V${roofY}`} strokeDasharray="3 4" />
        <path d="M470 90 V420" strokeWidth="2" />
      </g>
      <g stroke="#898278" strokeWidth=".8">{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M72 ${250 + i * 20} h16`} />)}</g>
      <g className="label-svg" fill="#898278">
        <text x={cl[0]} y={roofY - 50}>CLERESTORY</text><text x={ct[0]} y={roofY - 42}>COURTYARD</text>
        <text x="20" y="240">JAALI</text><text x="480" y="300">SHADOW WALL</text><text x="200" y="444">DEEP REVEAL · ORIENTATION</text>
      </g>
      <circle cx={400 + Math.cos(ang) * -330} cy={roofY - 10 - Math.sin(ang) * 80} r="9" fill="#B99A61" />
    </svg>
  );
}

export default function LightExperience() {
  const [torch, setTorch] = useState({ x: 50, y: 50 });
  return (
    <Stage label="The day moving through one house" length={5.5} stills={[0.12, 0.38, 0.62, 0.88]} className="x-light">
      {(p, mode) => {
        const sun = mode === 'still' ? p : seg(p, 0.08, 0.95);
        const dark = mode === 'live' ? 1 - seg(p, 0, 0.1) : 0;
        const current = TIMES.reduce((a, t) => (Math.abs(t.at - sun) < Math.abs(a.at - sun) ? t : a), TIMES[0]);
        return (
          <div className="light-room" onPointerMove={(e: PointerEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); setTorch({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}>
            <LightField sun={sun} className="light-bg" />
            <div className="light-dark" style={{ opacity: dark, ['--tx' as string]: `${torch.x}%`, ['--ty' as string]: `${torch.y}%` }} aria-hidden="true" />
            <Section sun={sun} />
            <ol className="light-times" aria-label="Times of day">
              {TIMES.map(t => <li key={t.label} className={current === t ? 'is-now' : ''}><span className="label">{t.label}</span></li>)}
            </ol>
            <p className="narrative light-note" aria-live="polite" style={{ opacity: mode === 'live' ? band(p, 0.08, 0.14, 0.97, 1.01) : 1 }}>{current.note}</p>
            {mode === 'live' && p < 0.1 && <p className="label light-hint">Move — your cursor is the only light</p>}
          </div>
        );
      }}
    </Stage>
  );
}
