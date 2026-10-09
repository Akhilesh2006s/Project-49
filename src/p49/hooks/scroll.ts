import { RefObject, useEffect, useRef, useState } from 'react';

/**
 * One rAF-batched scroll loop for the whole site. Components subscribe only
 * while they are near the viewport, so off-screen sequences cost nothing.
 */
type Sub = () => void;
const subs = new Set<Sub>();
let queued = false;
const run = () => { queued = false; subs.forEach(s => s()); };
const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(run); } };
let bound = false;
function bind() {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
}
export function subscribe(fn: Sub) { bind(); subs.add(fn); schedule(); return () => { subs.delete(fn); }; }

/** Returns [ref, progress 0..1] of a tall section scrolling past a pinned viewport. */
export function useStageProgress<T extends HTMLElement>(enabled = true): [RefObject<T>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el || !enabled) return;
    let unsub: (() => void) | null = null, last = -1;
    const compute = () => {
      const r = el.getBoundingClientRect(), vh = window.innerHeight;
      const total = Math.max(1, r.height - vh);
      const v = Math.min(1, Math.max(0, -r.top / total));
      if (Math.abs(v - last) > 0.0004) { last = v; setP(v); }
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !unsub) unsub = subscribe(compute);
      else if (!e.isIntersecting && unsub) { compute(); unsub(); unsub = null; }
    }, { rootMargin: '50% 0px 50% 0px' });
    io.observe(el);
    return () => { io.disconnect(); unsub?.(); };
  }, [enabled]);
  return [ref, p];
}

/** True once (or while, if `live`) the element is in view. */
export function useInView<T extends HTMLElement>(options: { live?: boolean; margin?: string; threshold?: number } = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, set] = useState(false);
  const { live = false, margin = '0px', threshold = 0.2 } = options;
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { set(true); if (!live) io.disconnect(); } else if (live) set(false);
    }, { rootMargin: margin, threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [live, margin, threshold]);
  return [ref, inView];
}

/** Direction-aware page scroll state for the navigation. */
export function useScrollDirection() {
  const [state, setState] = useState({ y: 0, down: false, progress: 0 });
  useEffect(() => {
    let lastY = window.scrollY;
    return subscribe(() => {
      const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      const down = Math.abs(y - lastY) < 4 ? undefined : y > lastY;
      lastY = y;
      setState(s => ({ y, down: down ?? s.down, progress: max > 0 ? y / max : 0 }));
    });
  }, []);
  return state;
}
