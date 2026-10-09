import Stage from '../components/Stage';
import { band, seg } from '../utils/math';

/**
 * FUTURE. One plan, forty years. The walls barely move; the life inside them
 * does. Technology stays nearly invisible: a service spine that was always there.
 */
const YEARS = [
  { y: '2026', family: 2, rooms: ['Living', 'Kitchen', 'Study', 'Guest', 'Bedroom'], note: 'A couple. The loose-fit plan leaves one room undecided.' },
  { y: '2032', family: 4, rooms: ['Living', 'Kitchen', 'Play', 'Children', 'Bedroom'], note: 'Children arrive. The study becomes a playroom without construction.' },
  { y: '2041', family: 4, rooms: ['Living', 'Kitchen', 'Work', 'Teenagers', 'Bedroom'], note: 'Teenagers need privacy; a partition along the service spine divides a room.' },
  { y: '2055', family: 3, rooms: ['Living', 'Kitchen', 'Care', 'Studio', 'Ground bedroom'], note: 'Ageing in place: level thresholds and the ground-floor bedroom were planned in 2026.' },
  { y: '2065', family: 5, rooms: ['Living', 'Kitchen', 'Nursery', 'Studio', 'Bedroom'], note: 'A new generation. Same walls. Energy and water systems upgraded through routes left for them.' },
];

export default function FutureExperience() {
  return (
    <Stage label="The same home across forty years" length={5.5} stills={[0.1, 0.3, 0.5, 0.7, 0.95]} className="x-future">
      {(p) => {
        const idx = Math.min(YEARS.length - 1, Math.floor(seg(p, 0.02, 0.98) * YEARS.length));
        const yr = YEARS[idx];
        const boxes = [[80, 80, 300, 220], [380, 80, 240, 220], [80, 300, 200, 200], [280, 300, 180, 200], [460, 300, 160, 200]];
        return (
          <div className="future-stage">
            <ol className="future-years" aria-label="Years">
              {YEARS.map((y, i) => <li key={y.y} className={i === idx ? 'is-now' : i < idx ? 'is-past' : ''}><span className="label">{y.y}</span></li>)}
            </ol>
            <p className="future-year" aria-live="polite">{yr.y}</p>
            <svg viewBox="0 0 700 580" className="future-plan" role="img" aria-label={`Plan in ${yr.y}: ${yr.rooms.join(', ')}`}>
              <g stroke="#F1ECE2" strokeWidth="1.3" fill="none">
                {boxes.map((b, i) => <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} />)}
              </g>
              <path d="M620 80 V500" stroke="#B99A61" strokeWidth="2" strokeDasharray="6 6" />
              <text x="628" y="96" className="label-svg" fill="#B99A61">SERVICE SPINE</text>
              {idx >= 2 && <path d="M370 300 V500" stroke="#898278" strokeWidth="1.2" />}
              {idx >= 3 && <path d="M80 520 H300 L330 500" stroke="#B99A61" strokeWidth="1.5" fill="none" />}
              {idx >= 3 && <text x="80" y="548" className="label-svg" fill="#898278">LEVEL THRESHOLD</text>}
              <g className="label-svg" fill="#898278">
                {boxes.map((b, i) => <text key={i} x={b[0] + 14} y={b[1] + 26}>{yr.rooms[i].toUpperCase()}</text>)}
              </g>
              <g fill="#B99A61">
                {Array.from({ length: yr.family }, (_, i) => <circle key={i} cx={180 + i * 28} cy={170} r={i < 2 ? 6 : 4} />)}
              </g>
            </svg>
            <p className="narrative future-note" key={yr.y} style={{ opacity: band(p, 0, 0.03, 1, 1.1) }}>{yr.note}</p>
          </div>
        );
      }}
    </Stage>
  );
}
