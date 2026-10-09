import { DialogueId } from './dialogues';

/**
 * THE HUMAN INDEX — an exploratory architectural questionnaire.
 * It is not a psychological or neurological assessment. Edit questions here.
 *
 * Scoring is deliberately transparent: every option adds points to one or more
 * of seven dimensions. The result page shows the raw totals.
 */
export type Dimension = 'CALM' | 'NATURE' | 'LIGHT' | 'SOCIAL' | 'MEMORY' | 'NOVELTY' | 'ADAPTABILITY';
export const DIMENSIONS: Dimension[] = ['CALM', 'NATURE', 'LIGHT', 'SOCIAL', 'MEMORY', 'NOVELTY', 'ADAPTABILITY'];

/** How each dimension leans toward the seven dialogues. */
export const AFFINITY: Record<Dimension, Partial<Record<DialogueId, number>>> = {
  CALM: { SILENCE: 1, AIR: 0.2 },
  NATURE: { EARTH: 1, AIR: 0.5 },
  LIGHT: { LIGHT: 1, ART: 0.2 },
  SOCIAL: { AIR: 0.5, ROOTS: 0.5, FUTURE: 0.2 },
  MEMORY: { ROOTS: 1, EARTH: 0.2 },
  NOVELTY: { ART: 1, FUTURE: 0.3 },
  ADAPTABILITY: { FUTURE: 1, AIR: 0.2 },
};

export interface Option { label: string; scene: string; score: Partial<Record<Dimension, number>> }
export interface Question { id: string; prompt: string; options: Option[] }

/** `scene` is a visual key rendered by HumanIndex (a poster image or a drawn study). */
export const QUESTIONS: Question[] = [
  { id: 'more', prompt: 'What should your home give you more of?', options: [
    { label: 'Energy', scene: 'img:/scenes/02-day.jpg', score: { LIGHT: 2, NOVELTY: 1 } },
    { label: 'Calm', scene: 'img:/scenes/10-silence.jpg', score: { CALM: 3 } },
    { label: 'Connection', scene: 'img:/scenes/09-courtyard.jpg', score: { SOCIAL: 3 } },
    { label: 'Solitude', scene: 'draw:alcove', score: { CALM: 2, MEMORY: 1 } },
    { label: 'Wonder', scene: 'img:/scenes/13-sculpture.jpg', score: { NOVELTY: 3 } },
  ] },
  { id: 'affects', prompt: 'Which affects you more?', options: [
    { label: 'Noise', scene: 'draw:noise', score: { CALM: 2 } },
    { label: 'Visual clutter', scene: 'draw:clutter', score: { CALM: 1, NOVELTY: -1, ADAPTABILITY: 1 } },
  ] },
  { id: 'wake', prompt: 'Where would you rather wake up?', options: [
    { label: 'Facing the sunrise', scene: 'img:/scenes/01-gradient.jpg', score: { LIGHT: 3 } },
    { label: 'Beside a garden', scene: 'img:/scenes/07-garden.jpg', score: { NATURE: 3 } },
    { label: 'In a dim, quiet room', scene: 'img:/scenes/03-shadow.jpg', score: { CALM: 3 } },
  ] },
  { id: 'evening', prompt: 'An ordinary evening at home. What happens?', options: [
    { label: 'Everyone gathers', scene: 'draw:gather', score: { SOCIAL: 3 } },
    { label: 'Each finds their own corner', scene: 'draw:corners', score: { CALM: 2, ADAPTABILITY: 1 } },
    { label: 'Outside, under the sky', scene: 'img:/scenes/04-wind.jpg', score: { NATURE: 2, SOCIAL: 1 } },
  ] },
  { id: 'childhood', prompt: 'Which memory of a childhood home stays with you?', options: [
    { label: 'Cool stone underfoot', scene: 'img:/scenes/18-root-material.jpg', score: { MEMORY: 3 } },
    { label: 'A courtyard full of people', scene: 'img:/scenes/17-root-entrance.jpg', score: { MEMORY: 2, SOCIAL: 1 } },
    { label: 'I would rather start fresh', scene: 'img:/scenes/15-smart-glass.jpg', score: { NOVELTY: 2, ADAPTABILITY: 1 } },
  ] },
  { id: 'surprise', prompt: 'After ten years in a house, should it still surprise you?', options: [
    { label: 'Yes, often', scene: 'img:/scenes/12-mural.jpg', score: { NOVELTY: 3 } },
    { label: 'Once or twice, precisely', scene: 'img:/scenes/11-gallery.jpg', score: { NOVELTY: 1, CALM: 1 } },
    { label: 'No. It should settle', scene: 'draw:settle', score: { CALM: 2, MEMORY: 1 } },
  ] },
  { id: 'weather', prompt: 'A heavy monsoon afternoon. Where are you?', options: [
    { label: 'At an open verandah', scene: 'draw:verandah', score: { NATURE: 3 } },
    { label: 'Inside, watching through glass', scene: 'draw:glass', score: { CALM: 1, LIGHT: 1 } },
    { label: 'Deep inside, hearing it', scene: 'draw:deep', score: { CALM: 2, MEMORY: 1 } },
  ] },
  { id: 'change', prompt: 'In fifteen years, your family will probably be…', options: [
    { label: 'Larger', scene: 'draw:larger', score: { ADAPTABILITY: 2, SOCIAL: 1 } },
    { label: 'Smaller', scene: 'draw:smaller', score: { ADAPTABILITY: 2, CALM: 1 } },
    { label: 'Much the same', scene: 'draw:same', score: { MEMORY: 2 } },
  ] },
  { id: 'light', prompt: 'Which light do you notice first?', options: [
    { label: 'Hard morning sun', scene: 'img:/scenes/02-day.jpg', score: { LIGHT: 3 } },
    { label: 'Soft reflected light', scene: 'img:/scenes/01-gradient.jpg', score: { LIGHT: 1, CALM: 2 } },
    { label: 'Light falling on an object', scene: 'img:/scenes/13-sculpture.jpg', score: { NOVELTY: 2, LIGHT: 1 } },
  ] },
  { id: 'technology', prompt: 'Technology in your home should be…', options: [
    { label: 'Invisible until needed', scene: 'img:/scenes/16-ceiling-tv.jpg', score: { ADAPTABILITY: 2, CALM: 1 } },
    { label: 'Minimal', scene: 'draw:minimal', score: { CALM: 1, MEMORY: 1, NATURE: 1 } },
    { label: 'Ready for what comes next', scene: 'img:/scenes/14-grown.jpg', score: { ADAPTABILITY: 3 } },
  ] },
  { id: 'threshold', prompt: 'Arriving home, you would rather…', options: [
    { label: 'Pass through a quiet threshold', scene: 'img:/scenes/17-root-entrance.jpg', score: { CALM: 2, MEMORY: 1 } },
    { label: 'See straight into a garden', scene: 'img:/scenes/08-stone.jpg', score: { NATURE: 3 } },
    { label: 'Be met by something unexpected', scene: 'img:/scenes/12-mural.jpg', score: { NOVELTY: 3 } },
  ] },
];

export type Scores = Record<Dimension, number>;

export function score(answers: Record<string, number>): Scores {
  const s = Object.fromEntries(DIMENSIONS.map(d => [d, 0])) as Scores;
  for (const q of QUESTIONS) {
    const o = q.options[answers[q.id]];
    if (!o) continue;
    for (const [dim, pts] of Object.entries(o.score) as [Dimension, number][]) s[dim] += pts;
  }
  for (const d of DIMENSIONS) s[d] = Math.max(0, s[d]);
  return s;
}

export function dialogueRanking(s: Scores): { id: DialogueId; value: number }[] {
  const out: Partial<Record<DialogueId, number>> = {};
  for (const dim of DIMENSIONS) for (const [id, w] of Object.entries(AFFINITY[dim]) as [DialogueId, number][]) out[id] = (out[id] ?? 0) + s[dim] * w;
  return (Object.entries(out) as [DialogueId, number][]).map(([id, value]) => ({ id, value })).sort((a, b) => b.value - a.value);
}
