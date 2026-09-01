/**
 * One scene = one light study + one line.
 *
 * Order is the order you scroll. The sequence runs colour -> direction ->
 * shadow, which is why 02 sits between the other two: it is the bridge from
 * the prismatic study to the monochrome one.
 *
 * Each clip is a baked ping-pong (plays forward, then backward), so it loops
 * without a visible jump. The source clips did not loop on their own.
 */
export const SCENES = [
  {
    id: 'gradient',
    eyebrow: 'Gradient',
    line: 'Light paints your walls.',
    video: '/scenes/01-gradient.mp4',
    poster: '/scenes/01-gradient.jpg',
  },
  {
    id: 'day',
    eyebrow: 'Hour',
    line: 'The day moves through your rooms.',
    video: '/scenes/02-day.mp4',
    poster: '/scenes/02-day.jpg',
  },
  {
    id: 'shadow',
    eyebrow: 'Shadow',
    line: 'Let the shadows speak.',
    video: '/scenes/03-shadow.mp4',
    poster: '/scenes/03-shadow.jpg',
  },
];

export default SCENES;
