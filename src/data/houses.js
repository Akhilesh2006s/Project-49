/**
 * The forty-nine commissions. Seven ideas, seven commissions under each: 7 × 7 = 49.
 *
 * Every commission is generated here with a default status. Confirmed project
 * information can be added through an override keyed by collection number.
 *
 *   OVERRIDES = { 3: { status: 'Under construction', name: 'The Gradient House' } }
 *
 * Never add a fiftieth record. The collection closes when all 49 records have
 * moved beyond Available or In discussion.
 */
import chapters from './chapters';

export const STATUSES = ['Available', 'In discussion', 'Commissioned', 'In design', 'Under construction', 'Completed'];

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
      commission_id: `${idea.id} ${String(col + 1).padStart(2, '0')}`,
      status: 'Available',
      location: '',
      publicName: '',
      narrative: '',
      designStage: '',
      constructionStage: '',
      completionDate: '',
      images: [],
      films: [],
      drawings: [],
      materials: [],
      provenance: [],
      publications: [],
      ...(OVERRIDES[number] || {}),
    };
  })
);

export const COUNTS = HOUSES.reduce((acc, h) => {
  acc[h.status] = (acc[h.status] || 0) + 1;
  return acc;
}, {});

export const TAKEN = HOUSES.filter(h => ['Commissioned', 'In design', 'Under construction', 'Completed'].includes(h.status)).length;
export const AVAILABLE = HOUSES.length - TAKEN;
export const COLLECTION_STATUS = TAKEN === 49 ? 'CLOSED' : 'OPEN';

if (HOUSES.length !== 49) throw new Error('Project 49 must contain exactly forty-nine commission records.');

export default HOUSES;
