/**
 * One scene = one light study + one statement, set as two short
 * clauses. Two lines balance under the concept title; a single long
 * sentence wraps ragged and fights it.
 *
 * Order is the order you scroll. `idea` groups them; when the idea changes a
 * CARD announces the new one (see below).
 *
 * Each clip is a baked ping-pong (plays forward, then backward), so it loops
 * without a visible jump. The source clips did not loop on their own.
 */
export const SCENES = [
  {
    id: 'gradient',
    idea: 'LIGHT',
    eyebrow: 'Gradient',
    line: ['Light paints', 'your walls.'],
    video: '/scenes/01-gradient.mp4',
    poster: '/scenes/01-gradient.jpg',
  },
  {
    id: 'day',
    idea: 'LIGHT',
    eyebrow: 'Hour',
    line: ['Through the day,', 'the house changes.'],
    video: '/scenes/02-day.mp4',
    poster: '/scenes/02-day.jpg',
  },
  {
    id: 'shadow',
    idea: 'LIGHT',
    eyebrow: 'Shadow',
    line: ['Let the shadows', 'speak.'],
    video: '/scenes/03-shadow.mp4',
    poster: '/scenes/03-shadow.jpg',
  },
  {
    id: 'wind',
    idea: 'AIR',
    eyebrow: 'Wind',
    line: ['The air is', 'never still.'],
    video: '/scenes/04-wind.mp4',
    poster: '/scenes/04-wind.jpg',
  },
  {
    id: 'breath',
    idea: 'AIR',
    eyebrow: 'Breath',
    line: ['Let the house', 'breathe.'],
    video: '/scenes/05-breath.mp4',
    poster: '/scenes/05-breath.jpg',
  },
  {
    id: 'trace',
    idea: 'AIR',
    eyebrow: 'Trace',
    line: ['Nothing to see.', 'Everything to feel.'],
    video: '/scenes/06-trace.mp4',
    poster: '/scenes/06-trace.jpg',
  },
];

/**
 * Cards announce a new idea mid-run.
 *
 * `at` is a position in scene-space, and it sits on a HALF unit deliberately:
 * that is the midpoint of a crossfade, where two clips are dissolving and no
 * chapter line is up. The break lands in the gap the sequence already has,
 * so no extra scroll has to be invented for it.
 *
 * Idea 01 has no card here — the horizontal opening already delivers it.
 */
export default SCENES;
