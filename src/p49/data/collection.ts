import { DIALOGUE_IDS, DialogueId } from './dialogues';

/**
 * THE 49. Edit real statuses here and nowhere else.
 *
 * Until `STATUSES_PUBLISHED` is true the site shows every position as neutral
 * and says statuses are not yet published. Nothing is ever shown as
 * commissioned, in design, in construction or completed unless entered below.
 */
export type HomeStatus = 'AVAILABLE' | 'COMMISSIONED' | 'IN DESIGN' | 'IN CONSTRUCTION' | 'COMPLETED';

export const STATUSES_PUBLISHED = false;

/** e.g. 'LIGHT 01': { status: 'IN DESIGN', area: 'Jubilee Hills' } */
export const REAL_STATUS: Partial<Record<string, { status: HomeStatus; area?: string }>> = {};

export interface Home { id: string; dialogue: DialogueId; ordinal: number; status: HomeStatus | null; area?: string }

export const HOMES: Home[] = DIALOGUE_IDS.flatMap(d =>
  Array.from({ length: 7 }, (_, i) => {
    const id = `${d} ${String(i + 1).padStart(2, '0')}`;
    const real = REAL_STATUS[id];
    return { id, dialogue: d, ordinal: i + 1, status: STATUSES_PUBLISHED ? real?.status ?? 'AVAILABLE' : real?.status ?? null, area: real?.area };
  }),
);

const TAKEN: HomeStatus[] = ['COMMISSIONED', 'IN DESIGN', 'IN CONSTRUCTION', 'COMPLETED'];
export const isClosed = (d: DialogueId) => HOMES.filter(h => h.dialogue === d).every(h => h.status && TAKEN.includes(h.status));
export const STATUS_ORDER: HomeStatus[] = ['AVAILABLE', 'COMMISSIONED', 'IN DESIGN', 'IN CONSTRUCTION', 'COMPLETED'];
