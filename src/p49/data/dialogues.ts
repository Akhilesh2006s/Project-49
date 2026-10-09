/**
 * The seven architectural dialogues. Every portal preview, experience, Human
 * Index result and collection row is driven from this one list.
 *
 * Media: `primary` paths are the final production assets listed in
 * /creative/asset-manifest.md. Until they exist, `fallback` points at the
 * studies already in /public/scenes, so nothing renders empty.
 */
export type DialogueId = 'LIGHT' | 'AIR' | 'EARTH' | 'SILENCE' | 'ROOTS' | 'ART' | 'FUTURE';

export interface MediaRef { primary: string; fallback: string; poster: string; posterFallback: string; alt: string }

export interface Dialogue {
  id: DialogueId;
  index: string;
  word: string;
  question: string[];
  final: string[];
  preface?: string;
  coda?: string[];
  concepts: string[];
  vocabulary: string[];
  sense: string;
  bed: string | null;
  hero: MediaRef;
  studies: MediaRef[];
}

/** Flip to true once the production files from the asset manifest are in /public/media. */
export const PRODUCTION_MEDIA = false;

const m = (slug: string, file: string, alt: string): MediaRef => {
  const study = { video: `/scenes/${file}-clean.mp4`, poster: `/scenes/${file}.jpg` };
  return PRODUCTION_MEDIA
    ? { primary: `/media/${slug}/${file}.mp4`, fallback: study.video, poster: `/media/${slug}/${file}.webp`, posterFallback: study.poster, alt }
    : { primary: study.video, fallback: study.video, poster: study.poster, posterFallback: study.poster, alt };
};

export const DIALOGUES: Dialogue[] = [
  {
    id: 'LIGHT', index: '01', word: 'Light', sense: 'illumination',
    question: ['How should a home', 'allow us to', 'experience time?'],
    final: ['What if sunlight', 'became one of the', 'materials used to', 'build your house?'],
    concepts: ['Circadian awareness', 'Daylight', 'Visual comfort', 'Temporal change', 'Glare', 'Contrast', 'Seasonal perception'],
    vocabulary: ['Orientation', 'Courtyard', 'Skylight', 'Clerestory', 'Deep reveal', 'Jaali', 'Reflected daylight', 'Shadow wall'],
    bed: 'morning-birds',
    hero: m('light', '02-day', 'Daylight moving through slatted openings across a plaster wall'),
    studies: [m('light', '01-gradient', 'A gradient of light across a wall'), m('light', '03-shadow', 'Shadow moving across a room')],
  },
  {
    id: 'AIR', index: '02', word: 'Air', sense: 'movement of fabric and air',
    question: ['Can you feel', 'a building breathe?'],
    preface: 'Luxury isn’t necessarily controlling nature.',
    final: ['Sometimes it is', 'designing intelligently', 'enough to let nature', 'participate.'],
    concepts: ['Cross ventilation', 'Stack effect', 'Thermal comfort', 'Shade', 'Pressure', 'Thermal buffer', 'Microclimate'],
    vocabulary: ['Courtyard', 'Wind tower', 'Deep verandah', 'Operable screen', 'High vent', 'Shaded forecourt'],
    bed: 'breeze',
    hero: m('air', '04-wind', 'A curtain moving in a breeze'),
    studies: [m('air', '05-breath', 'Air moving through a room'), m('air', '06-trace', 'Traces of wind in an interior')],
  },
  {
    id: 'EARTH', index: '03', word: 'Earth', sense: 'vegetation and ground',
    question: ['What happens', 'when nature is', 'encountered rather', 'than observed?'],
    final: ['How many times', 'during an ordinary day', 'should your home', 'remind you that', 'you are part of nature?'],
    concepts: ['Biophilia', 'Existing trees', 'Native planting', 'Rain', 'Water', 'Natural materials', 'Biodiversity', 'Seasonality'],
    vocabulary: ['Nature first', 'Architecture second'],
    bed: 'earth-garden-morning',
    hero: m('earth', '07-garden', 'A tree growing inside a house'),
    studies: [m('earth', '08-stone', 'A house built into natural rock'), m('earth', '09-courtyard', 'Rammed-earth walls around a planted courtyard')],
  },
  {
    id: 'SILENCE', index: '04', word: 'Silence', sense: 'acoustic collapse',
    question: ['What if luxury', 'meant asking less', 'of your brain?'],
    preface: 'Perhaps the rarest thing a home in a growing city can give you…',
    final: ['is nothing.'],
    coda: ['Nothing demanding attention.', 'Nothing interrupting thought.', 'Nothing asking to be noticed.'],
    concepts: ['Acoustic separation', 'Visual calm', 'Concealed services', 'Absorbent storage', 'Soft reflections', 'Clear circulation'],
    vocabulary: ['Thermal mass', 'Buffer court', 'Recessed storage', 'Matte surfaces'],
    bed: null,
    hero: m('silence', '10-silence', 'A still interior at dusk above the city'),
    studies: [],
  },
  {
    id: 'ROOTS', index: '05', word: 'Roots', sense: 'material and memory',
    question: ['What part of', 'your childhood', 'deserves to survive', 'inside your future?'],
    final: ['Old intelligence.', 'New architecture.'],
    concepts: ['Memory', 'Ritual', 'Culture', 'Belonging', 'Craft', 'Regional climate', 'Family history'],
    vocabulary: ['Threshold', 'Courtyard', 'Carved stone', 'Timber', 'Otla', 'Chowk'],
    bed: 'roots-courtyard-birds',
    hero: m('roots', '17-root-entrance', 'A carved stone entrance in evening light'),
    studies: [m('roots', '18-root-material', 'Hand-worked local stone')],
  },
  {
    id: 'ART', index: '06', word: 'Art', sense: 'sculptural geometry',
    question: ['Can a house', 'continue surprising you', 'after ten years?'],
    preface: 'Don’t make everything interesting.',
    final: ['Decide exactly', 'where wonder', 'should happen.'],
    concepts: ['Curiosity', 'Novelty', 'Discovery', 'Perspective', 'Controlled surprise'],
    vocabulary: ['Compression', 'Release', 'Framed view', 'Sculptural stair', 'Light on art'],
    bed: 'art-room-tone',
    hero: m('art', '13-sculpture', 'A sculpture in a top-lit room'),
    studies: [m('art', '11-gallery', 'Gallery walls in a home'), m('art', '12-mural', 'A mural built into a wall')],
  },
  {
    id: 'FUTURE', index: '07', word: 'Future', sense: 'spatial transformation',
    question: ['Can a house change', 'because its humans do?'],
    preface: 'The smartest home isn’t the one with the most technology.',
    final: ['It’s the one', 'that requires', 'the least thought', 'to live well.'],
    concepts: ['Flexibility', 'Adaptability', 'Ageing in place', 'Energy intelligence', 'Water intelligence', 'Future service routes', 'Environmental responsiveness'],
    vocabulary: ['Loose-fit plan', 'Service spine', 'Convertible room', 'Level threshold'],
    bed: 'future-refrigerator-hum',
    hero: m('future', '15-smart-glass', 'Glass that turns private while the view remains'),
    studies: [m('future', '14-grown', 'A kitchen that grows food'), m('future', '16-ceiling-tv', 'A screen that appears only when invited')],
  },
];

export const dialogue = (id: DialogueId) => DIALOGUES.find(d => d.id === id)!;
export const DIALOGUE_IDS = DIALOGUES.map(d => d.id);
