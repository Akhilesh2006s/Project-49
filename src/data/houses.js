/**
 * The forty-nine. Seven ideas, seven houses under each: 7 × 7 = 49.
 *
 * Every house is generated here with a default status. To change one,
 * add an override keyed by its number (01–49): a status, a name, a plot,
 * a family, anything — it is merged over the generated row.
 *
 *   OVERRIDES = { 3: { status: 'Under construction', name: 'The Gradient House' } }
 *
 * Statuses used on the site: 'In design' · 'Under construction' · 'Built'.
 * Anything else is shown exactly as written.
 */
import chapters from './chapters';

export const STATUSES = ['In design', 'Under construction', 'Built'];

const OVERRIDES = {
  1: { status: 'Under construction' },
};

const PER_IDEA = 7;

export const HOUSES = chapters.flatMap((idea, row) =>
  Array.from({ length: PER_IDEA }, (_, col) => {
    const number = row * PER_IDEA + col + 1;
    return {
      number,
      label: String(number).padStart(2, '0'),
      idea: idea.id,
      ideaIndex: row,
      ordinal: col + 1,
      status: 'In design',
      ...(OVERRIDES[number] || {}),
    };
  })
);

export const COUNTS = HOUSES.reduce((acc, h) => {
  acc[h.status] = (acc[h.status] || 0) + 1;
  return acc;
}, {});

export default HOUSES;
