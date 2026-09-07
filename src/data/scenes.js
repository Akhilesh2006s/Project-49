/**
 * One scene = one light study + one statement, set as two short
 * clauses. Two lines balance under the concept title; a single long
 * sentence wraps ragged and fights it.
 *
 * `idea` groups them into the run that opens from that name on the menu;
 * order within an idea is the order you scroll.
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
  {
    id: 'garden',
    idea: 'EARTH',
    eyebrow: 'Garden',
    line: ['A tree grows', 'inside the house.'],
    video: '/scenes/07-garden.mp4',
    poster: '/scenes/07-garden.jpg',
  },
  {
    id: 'stone',
    idea: 'EARTH',
    eyebrow: 'Stone',
    line: ['Built into the rock,', 'not on it.'],
    video: '/scenes/08-stone.mp4',
    poster: '/scenes/08-stone.jpg',
  },
  {
    id: 'courtyard',
    idea: 'EARTH',
    eyebrow: 'Rammed earth',
    line: ['Walls made', 'of the ground.'],
    video: '/scenes/09-courtyard.mp4',
    poster: '/scenes/09-courtyard.jpg',
  },
  {
    id: 'silence',
    idea: 'SILENCE',
    eyebrow: 'Silence',
    line: ['Leave the city', 'at the door.'],
    video: '/scenes/10-silence.mp4',
    poster: '/scenes/10-silence.jpg',
  },
  {
    id: 'gallery',
    idea: 'ART',
    eyebrow: 'Gallery',
    line: ['Live inside', 'the collection.'],
    video: '/scenes/11-gallery.mp4',
    poster: '/scenes/11-gallery.jpg',
  },
  {
    id: 'mural',
    idea: 'ART',
    eyebrow: 'Mural',
    line: ['Walls that', 'speak.'],
    video: '/scenes/12-mural.mp4',
    poster: '/scenes/12-mural.jpg',
  },
  {
    id: 'sculpture',
    idea: 'ART',
    eyebrow: 'Sculpture',
    line: ['Art is not hung.', 'It is lived with.'],
    video: '/scenes/13-sculpture.mp4',
    poster: '/scenes/13-sculpture.jpg',
  },
];

export default SCENES;
