export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progress of `p` through the window [a, b], clamped 0..1. */
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
/** Fades in across [a, b] and out across [c, d]. */
export const band = (p: number, a: number, b: number, c: number, d: number) => Math.min(seg(p, a, b), 1 - seg(p, c, d));
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
}
