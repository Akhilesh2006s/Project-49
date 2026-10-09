import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { KEYS, store } from '../utils/storage';

/**
 * PerformanceManager + reduced motion.
 * high      full shaders, particles, richer transitions
 * standard  lighter shaders and fewer particles
 * mobile    art-directed portrait experience, minimal WebGL
 * reduced   no camera movement: stills and fades (prefers-reduced-motion or user choice)
 */
export type Tier = 'high' | 'standard' | 'mobile';
interface Motion { tier: Tier; reduced: boolean; setReduced: (v: boolean | null) => void; webgl: boolean }

const Ctx = createContext<Motion>({ tier: 'standard', reduced: false, setReduced: () => {}, webgl: false });

function detectWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

function detectTier(): Tier {
  const w = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (w < 760 || (coarse && w < 1024)) return 'mobile';
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = nav.hardwareConcurrency ?? 4, mem = nav.deviceMemory ?? 4;
  if (nav.connection?.saveData) return 'standard';
  return cores >= 8 && mem >= 8 ? 'high' : 'standard';
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<Tier>(() => detectTier());
  const [system, setSystem] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [override, setOverride] = useState<boolean | null>(() => {
    const v = store.get(KEYS.motion); return v === 'reduced' ? true : v === 'full' ? false : null;
  });
  const webgl = useMemo(detectWebGL, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => setSystem(mq.matches);
    let t = 0;
    const onResize = () => { clearTimeout(t); t = window.setTimeout(() => setTier(detectTier()), 200); };
    mq.addEventListener('change', onMq); window.addEventListener('resize', onResize);
    return () => { mq.removeEventListener('change', onMq); window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, []);

  const reduced = override ?? system;
  useEffect(() => { document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'; document.documentElement.dataset.tier = tier; }, [reduced, tier]);

  const value = useMemo<Motion>(() => ({
    tier, reduced, webgl,
    setReduced: v => { setOverride(v); if (v === null) store.del(KEYS.motion); else store.set(KEYS.motion, v ? 'reduced' : 'full'); },
  }), [tier, reduced, webgl]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useMotion = () => useContext(Ctx);
