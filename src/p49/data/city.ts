import { rng } from '../utils/math';
import { DIALOGUE_IDS, DialogueId } from './dialogues';

/**
 * An abstract Hyderabad: not a map, a field. Coordinates are normalised 0..1
 * across a frame roughly 40 km wide centred on the old city, west to the right
 * of Gandipet. Enough geography to feel like the city; nothing that reads as a
 * plot location.
 */
export interface Pt { x: number; y: number }

const r = rng(49);
const CORE: Pt = { x: 0.55, y: 0.52 };

/** Urban density: many small points, denser toward the core and the western growth corridor. */
export const URBAN: Pt[] = Array.from({ length: 1400 }, () => {
  const west = r() < 0.35;
  const a = r() * Math.PI * 2;
  const d = Math.pow(r(), west ? 0.9 : 1.6) * (west ? 0.34 : 0.42);
  const cx = west ? 0.36 : CORE.x, cy = west ? 0.48 : CORE.y;
  return { x: cx + Math.cos(a) * d * 1.25, y: cy + Math.sin(a) * d * 0.9 };
}).filter(p => p.x > 0.02 && p.x < 0.98 && p.y > 0.04 && p.y < 0.96);

/** The Musi, west to east, and the two lakes people orient by. */
export const RIVER: Pt[] = [
  { x: 0.18, y: 0.6 }, { x: 0.3, y: 0.58 }, { x: 0.42, y: 0.6 }, { x: 0.52, y: 0.57 },
  { x: 0.6, y: 0.59 }, { x: 0.72, y: 0.56 }, { x: 0.86, y: 0.6 }, { x: 0.97, y: 0.58 },
];
export const LAKES = [{ x: 0.55, y: 0.44, r: 0.022, name: 'Hussain Sagar' }, { x: 0.2, y: 0.62, r: 0.034, name: 'Gandipet' }];

/** Forty-nine positions, grouped by dialogue. Abstract: they do not mark real plots. */
export const POSITIONS: (Pt & { dialogue: DialogueId; ordinal: number })[] = DIALOGUE_IDS.flatMap((d, di) => {
  const angle = (di / 7) * Math.PI * 2 - Math.PI / 2;
  const cx = 0.45 + Math.cos(angle) * 0.2, cy = 0.5 + Math.sin(angle) * 0.24;
  const rr = rng(700 + di);
  return Array.from({ length: 7 }, (_, i) => {
    const a = rr() * Math.PI * 2, dd = 0.02 + rr() * 0.07;
    return { x: cx + Math.cos(a) * dd, y: cy + Math.sin(a) * dd, dialogue: d, ordinal: i + 1 };
  });
});
