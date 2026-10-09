/**
 * The 30-second opening film.
 *
 * If /public/film/project49-opening.mp4 exists it is played (with captions
 * from project49-opening.vtt). Until then this timeline composes an
 * art-directed version of the same film from the existing studies, with the
 * voice-over set as typography and sound cues driven by the AudioEngine.
 * Timings match /creative/voiceover-script.md and the VTT file.
 */
export const FILM = {
  src: '/film/project49-opening.mp4',
  poster: '/film/project49-opening-poster.webp',
  captions: '/film/project49-opening.vtt',
  duration: 30,
  skipAfter: 2,
};

export interface Shot { from: number; to: number; clip?: string; poster?: string; treatment?: 'aerial' | 'blade' | 'macro' | 'threshold' | 'reveal' | 'flash' | 'black'; word?: string }
export interface Line { from: number; to: number; text: string; mode: 'caption' | 'word' | 'title' }
export type Cue = { at: number; do: 'city' | 'door' | 'bed' | 'drone' | 'silence' | 'open' | 'swell' | 'restore'; arg?: string };

const s = (n: string) => ({ clip: `/scenes/${n}-clean.mp4`, poster: `/scenes/${n}.jpg` });

export const SHOTS: Shot[] = [
  { from: 0, to: 4, clip: '/city-hyderabad-clean.mp4', poster: '/city-hyderabad.jpg', treatment: 'aerial' },
  { from: 4, to: 5.1, treatment: 'black' },
  { from: 5.1, to: 8, ...s('01-gradient'), treatment: 'blade' },
  { from: 8, to: 9.3, ...s('02-day'), treatment: 'macro', word: 'Light' },
  { from: 9.3, to: 10.6, ...s('04-wind'), treatment: 'macro', word: 'Air' },
  { from: 10.6, to: 11.9, ...s('07-garden'), treatment: 'macro', word: 'Nature' },
  { from: 11.9, to: 13.1, ...s('10-silence'), treatment: 'macro', word: 'Sound' },
  { from: 13.1, to: 14.3, ...s('18-root-material'), treatment: 'macro', word: 'Memory' },
  { from: 14.3, to: 15.5, ...s('08-stone'), treatment: 'macro', word: 'Movement' },
  { from: 15.5, to: 17, ...s('09-courtyard'), treatment: 'macro', word: 'Proportion' },
  { from: 17, to: 22.2, ...s('17-root-entrance'), treatment: 'threshold' },
  { from: 22.2, to: 23, ...s('09-courtyard'), treatment: 'reveal' },
  { from: 23, to: 23.57, ...s('02-day'), treatment: 'flash', word: 'LIGHT' },
  { from: 23.57, to: 24.14, ...s('04-wind'), treatment: 'flash', word: 'AIR' },
  { from: 24.14, to: 24.71, ...s('07-garden'), treatment: 'flash', word: 'EARTH' },
  { from: 24.71, to: 25.28, ...s('10-silence'), treatment: 'flash', word: 'SILENCE' },
  { from: 25.28, to: 25.85, ...s('18-root-material'), treatment: 'flash', word: 'ROOTS' },
  { from: 25.85, to: 26.42, ...s('13-sculpture'), treatment: 'flash', word: 'ART' },
  { from: 26.42, to: 27, ...s('15-smart-glass'), treatment: 'flash', word: 'FUTURE' },
  { from: 27, to: 30, treatment: 'black' },
];

export const LINES: Line[] = [
  { from: 0.4, to: 3.9, text: 'For decades, we have measured luxury by what a home contains.', mode: 'caption' },
  { from: 4.6, to: 6.4, text: 'But your brain doesn’t experience a brand.', mode: 'caption' },
  { from: 6.7, to: 8, text: 'It experiences space.', mode: 'caption' },
  { from: 15.8, to: 17, text: 'Every space is already speaking to us.', mode: 'caption' },
  { from: 17.5, to: 19.2, text: 'The question is…', mode: 'caption' },
  { from: 19.6, to: 22.2, text: '…has anyone designed what it is saying?', mode: 'caption' },
  { from: 23, to: 25, text: 'Seven human experiences.', mode: 'caption' },
  { from: 25, to: 27, text: 'Forty-nine architectural explorations.', mode: 'caption' },
  { from: 27.6, to: 30, text: 'PROJECT 49', mode: 'title' },
  { from: 28.1, to: 29, text: 'Hyderabad…', mode: 'caption' },
  { from: 29, to: 30, text: '…perhaps it’s time we experienced architecture differently.', mode: 'caption' },
];

export const FRAGMENTS = ['STONE', 'BRASS', 'FURNITURE', 'LIGHTING', 'AUTOMATION', 'GLASS', 'CRAFTED SURFACES'];

export const CUES: Cue[] = [
  { at: 0, do: 'city' },
  { at: 4, do: 'door' },
  { at: 5.1, do: 'bed', arg: 'morning-birds' },
  { at: 9.3, do: 'bed', arg: 'breeze' },
  { at: 11.9, do: 'silence' },
  { at: 13.1, do: 'bed', arg: 'roots-courtyard-birds' },
  { at: 17, do: 'drone' },
  { at: 22.2, do: 'open' },
  { at: 24.71, do: 'silence' },
  { at: 25.28, do: 'restore' },
  { at: 27, do: 'silence' },
  { at: 27.6, do: 'swell' },
];
