/**
 * The opening is one composition, not a sequence of cards: the wordmark, the
 * line, and all seven names together on the dark wall.
 *
 * Scrolling slides it left — the page travels right — into the chapter card.
 * From there the chapters run vertically.
 */

export const IDEAS = ['LIGHT', 'AIR', 'ART', 'ROOTS', 'EARTH', 'SILENCE', 'FUTURE'];

export const HERO = {
  lg: '/opening/hero.jpg',
  sm: '/opening/hero-1280.jpg',
  // 'light' or 'dark' — describes the HERO, and the opening inverts to suit:
  // ink on paper with no shade pools for a light one, ivory over shade for a
  // dark one. Set this when you swap the image; nothing else needs touching.
  tone: 'dark',
};

export const BEATS = [
  { id: 'opening', kind: 'opening' },
  { id: 'chapter', kind: 'chapter' },
];

export default BEATS;
