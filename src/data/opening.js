/**
 * The opening is one composition, not a sequence of cards: the wordmark, the
 * line, and all seven names together on the dark wall.
 *
 * Scrolling slides it left — the page travels right — into the chapter card.
 * From there the chapters run vertically.
 */

export const IDEAS = ['LIGHT', 'AIR', 'ART', 'ROOTS', 'EARTH', 'SILENCE', 'FUTURE'];

/**
 * Drawn logotypes for the concept titles.
 *
 * The reference mark is bespoke — its R has a swash leg and its A a hairline
 * that drops below the baseline. No free webfont carries those: measured
 * across Cormorant, Cormorant Garamond and EB Garamond, none has a swash or
 * stylistic alternate at all, and Bodoni Moda's weight axis bottoms out at
 * 400, so 400 is already its thinnest.
 *
 * Drop an SVG in here per idea and it replaces the live text; anything absent
 * falls back to the typeface. Export at any size — it scales.
 *
 *   LIGHT: '/marks/light.svg',
 */
export const MARKS = {};

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
