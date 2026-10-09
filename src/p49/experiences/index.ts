import { ComponentType, lazy } from 'react';
import type { DialogueId } from '../data/dialogues';

/** Deep experiences load only when opened. */
export const EXPERIENCES: Record<DialogueId, ComponentType> = {
  LIGHT: lazy(() => import('./LightExperience')),
  AIR: lazy(() => import('./AirExperience')),
  EARTH: lazy(() => import('./EarthExperience')),
  SILENCE: lazy(() => import('./SilenceExperience')),
  ROOTS: lazy(() => import('./RootsExperience')),
  ART: lazy(() => import('./ArtExperience')),
  FUTURE: lazy(() => import('./FutureExperience')),
};
