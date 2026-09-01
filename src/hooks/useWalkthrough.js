import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives the walkthrough from scroll position.
 *
 * Deliberately does NOT put per-frame values in React state: at 60fps that
 * would re-render every space on every scroll tick. React renders the
 * structure once; this hook writes opacity/transform straight to the nodes
 * through refs. Only `active` is state, and it changes ~14 times in total.
 */

export const TAIL = 0.9;       // extra travel past the last space, for the closing card
export const CROSSFADE = 0.4;  // share of a segment spent dissolving between spaces

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollTop = () =>
  window.scrollY ||
  (document.scrollingElement ? document.scrollingElement.scrollTop : 0) ||
  0;

const maxScroll = () =>
  Math.max(
    document.documentElement.scrollHeight,
    document.body ? document.body.scrollHeight : 0
  ) - window.innerHeight;

export function useWalkthrough(count) {
  const span = count - 1 + TAIL;

  const frameRefs = useRef([]);
  const imageRefs = useRef([]);
  const capRefs = useRef([]);
  const overtureRef = useRef(null);
  const outroRef = useRef(null);
  const scrollerRef = useRef(null);

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const reduced = prefersReduced();
    let raf = 0;
    let queued = false;

    const layout = () => {
      const h = window.innerHeight;
      // A hidden tab or a thumbnail capture can report zero height. Keep the
      // last good geometry rather than collapsing the page to nothing.
      if (h <= 0) return;
      if (scrollerRef.current) {
        scrollerRef.current.style.height = (count + TAIL) * h + 'px';
      }
    };

    const render = () => {
      const max = maxScroll();
      // Progress is read as a fraction of the scrollable range, not as
      // pixels-per-segment, so it can never overrun `span` when the viewport
      // is momentarily measured at zero.
      const p = max > 0 ? clamp(scrollTop() / max, 0, 1) * span : 0;
      const titleOp = clamp(1 - p / 0.5, 0, 1);

      let idx = 0;
      let best = -1;

      for (let i = 0; i < count; i++) {
        const frame = frameRefs.current[i];
        if (!frame) continue;
        const image = imageRefs.current[i];
        const cap = capRefs.current[i];

        const t = p - i;
        // the final space holds instead of fading out under the closing card
        const tOp = i === count - 1 ? Math.min(t, 0) : t;
        const a = Math.abs(tOp);
        const op = clamp((1 - a) / CROSSFADE, 0, 1);

        if (op <= 0.002) {
          if (frame.style.display !== 'none') frame.style.display = 'none';
          if (cap) cap.style.opacity = '0';
          continue;
        }
        if (frame.style.display === 'none') frame.style.display = '';
        frame.style.opacity = String(op);

        if (image && !reduced) {
          const tc = clamp(t, -1, 1.4);
          // Continuous forward dolly. Scale never drops below 1, so a scaled
          // frame can never expose an edge.
          const scale = 1.06 + (tc + 1) * 0.13;
          image.style.transform = `translate3d(0, ${-tc * 1.8}%, 0) scale(${scale})`;
        }

        if (cap) {
          // captions ride a tighter window than the image, and never share the
          // screen with the opening title
          cap.style.opacity = String(clamp((0.72 - a) / 0.26, 0, 1) * (1 - titleOp));
          cap.style.transform = `translateY(${clamp(tOp, -1, 1) * 14}px)`;
        }

        if (op > best) {
          best = op;
          idx = i;
        }
      }

      if (overtureRef.current) {
        overtureRef.current.style.opacity = String(titleOp);
        overtureRef.current.style.transform = `scale(${1 + (1 - titleOp) * 0.06})`;
      }
      if (outroRef.current) {
        outroRef.current.style.opacity = String(
          clamp((p - (count - 1) - 0.1) / 0.45, 0, 1)
        );
      }

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(() => {
        queued = false;
        render();
      });
    };
    const onResize = () => {
      layout();
      render();
    };

    layout();
    render();

    window.addEventListener('scroll', onScroll, { passive: true });
    // If anything ever makes <body> the scroll container, element scroll
    // events do not bubble to window — listen on document too.
    document.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [count, span]);

  const scrollToSpace = useCallback(
    (i) => {
      window.scrollTo({
        top: (i / span) * maxScroll(),
        behavior: prefersReduced() ? 'auto' : 'smooth',
      });
    },
    [span]
  );

  return {
    frameRefs,
    imageRefs,
    capRefs,
    overtureRef,
    outroRef,
    scrollerRef,
    active,
    scrollToSpace,
  };
}

export default useWalkthrough;
