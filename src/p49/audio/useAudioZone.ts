import { useEffect } from 'react';
import { audio, Layer } from './AudioEngine';

export interface Zone { bed?: string | null; level?: number; layers?: Partial<Record<Layer, number>>; duck?: number }

/** While `active`, the section owns the soundscape. The most recently activated zone wins. */
export function useAudioZone(active: boolean, zone: Zone) {
  const key = JSON.stringify(zone);
  useEffect(() => {
    if (!active) return;
    const z: Zone = JSON.parse(key);
    if (z.bed !== undefined) void audio.bedTo(z.bed, z.level ?? 0.35);
    audio.duck(z.duck ?? 1);
    (['city', 'drone', 'hum', 'density'] as Layer[]).forEach(l => audio.layer(l, z.layers?.[l] ?? 0, 1.2));
  }, [active, key]);
}
