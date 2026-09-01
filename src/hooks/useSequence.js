import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Drives the whole page from scroll position: a horizontal opening, then the
 * vertical run of light chapters.
 *
 * `p` is one continuous timeline.
 *   p 0 .. OPEN_SPAN   the opening rail slides left, one beat per unit
 *   p OPEN_SPAN ..     the chapters cross-dissolve, one scene per unit
 *
 * Inside a chapter the rhythm is deliberate: you arrive on a sharp, moving
 * clip, the line fades up and the background blurs and darkens behind it, and
 * as you scroll on the line clears and the blur releases — so the crossfade
 * between two clips always happens while both are sharp and untexted.
 *
 * Nothing per-frame goes through React state; at 60fps that would re-render
 * every scene on every tick. Only `active` and `phase` are state, and they
 * change a handful of times in total.
 */

export const OPEN_SPAN = 2;     // two panels, at p = 0 and 1; handoff at 2
export const TAIL = 0.6;        // travel past the last chapter before the end
export const CROSSFADE = 0.6;   // share of a segment spent dissolving
// How much scrolling one step costs, as a multiple of a viewport. This is the
// dial for pace: it stretches the whole timeline without touching any of the
// curves, so blends get longer while the holds keep their proportions.
export const PACE = 1.9;
export const SCENE_BLUR = 7;    // px behind a chapter line
export const OPEN_BLUR = 0;     // the opening stays sharp; the hero is dark enough already

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

export function useSequence(sceneCount, beatCount, openingTint = 0.34) {
  const span = OPEN_SPAN + (sceneCount - 1) + TAIL;

  const heroRef = useRef(null);
  const railRef = useRef(null);
  const beatRefs = useRef([]);
  const layerRefs = useRef([]);
  const videoRefs = useRef([]);
  const lineRefs = useRef([]);
  const veilRef = useRef(null);
  const veilDarkRef = useRef(null);
  const cueRef = useRef(null);
  const ticksRef = useRef(null);
  const scrollerRef = useRef(null);

  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState('opening');
  const activeRef = useRef(0);
  const phaseRef = useRef('opening');

  useEffect(() => {
    const reduced = prefersReduced();
    const playing = new Array(sceneCount).fill(false);
    let raf = 0;
    let queued = false;
    let lastBlur = -1;

    const layout = () => {
      const h = window.innerHeight;
      // A hidden tab or a thumbnail capture reports zero height; keep the last
      // good geometry rather than collapsing the page.
      if (h <= 0) return;
      if (scrollerRef.current) {
        scrollerRef.current.style.height = (span + 1) * h * PACE + 'px';
      }
    };

    const render = () => {
      const max = maxScroll();
      // Progress is a fraction of the scrollable range, never pixels per
      // segment — so it cannot overrun when the viewport measures zero.
      const p = max > 0 ? clamp(scrollTop() / max, 0, 1) * span : 0;

      /* ---------- opening ---------- */
      const op = clamp(p, 0, OPEN_SPAN);
      // The hero hands over to the first clip on exactly the curve the clips
      // use between themselves, so the two cross-dissolve and their opacities
      // sum to 1 the whole way. Holding the hero opaque past this point hides
      // the clip underneath it and makes the handover read as a cut.
      const heroOp = clamp((OPEN_SPAN - p) / CROSSFADE, 0, 1);
      let openingText = 0;

      if (railRef.current) {
        // Negative: content shifts left so you advance rightward through it —
        // the next panel arrives from the right, the current one exits left.
        railRef.current.style.transform = `translate3d(${-op * 100}vw, 0, 0)`;
      }
      if (heroRef.current) {
        heroRef.current.style.opacity = String(heroOp);
        // The hero pans slower than the rail — that difference is the depth.
        //
        // The pan MUST stay inside the scale. A scale of s leaves (s-1)/2 of
        // overflow on each side, so panning by d needs s >= 1 + 2d —
        // anything less slides the image off the edge and shows the black
        // behind it. Here d = 0.03*op and s = 1.06 + 0.06*op, which keeps
        // headroom at 0.03 + 0.03*op — always ahead of the pan, and barely
        // cropped at rest so the opening keeps its framing.
        const pan = op * 3; // leftward, with the rail
        const scale = 1.06 + op * 0.06;
        heroRef.current.style.transform = reduced
          ? 'none'
          : `translate3d(${-pan}vw, 0, 0) scale(${scale})`;
      }

      for (let b = 0; b < beatCount; b++) {
        const el = beatRefs.current[b];
        if (!el) continue;
        const d = op - b;
        const o = clamp((1 - Math.abs(d)) / 0.45, 0, 1) * heroOp;
        el.style.opacity = String(o);
        if (o > openingText) openingText = o;
      }

      /* ---------- chapters ---------- */
      const sp = p - OPEN_SPAN;
      let idx = 0;
      let best = -1;
      let sceneText = 0;

      for (let i = 0; i < sceneCount; i++) {
        const layer = layerRefs.current[i];
        if (!layer) continue;
        const video = videoRefs.current[i];
        const line = lineRefs.current[i];

        const t = sp - i;
        const tOp = i === sceneCount - 1 ? Math.min(t, 0) : t;
        const a = Math.abs(tOp);
        const o = clamp((1 - a) / CROSSFADE, 0, 1);

        if (o <= 0.002) {
          if (layer.style.display !== 'none') layer.style.display = 'none';
          if (line) line.style.opacity = '0';
          if (video && playing[i]) {
            video.pause();
            playing[i] = false;
          }
          continue;
        }
        if (layer.style.display === 'none') layer.style.display = '';
        layer.style.opacity = String(o);

        // Only the clips actually on screen are decoding. Mark as playing only
        // once play() resolves — a rejected autoplay must be retried, not
        // silently swallowed.
        if (video && !playing[i]) {
          video.muted = true;
          const r = video.play();
          if (r && r.then) {
            playing[i] = true;
            r.catch(() => {
              playing[i] = false;
            });
          } else {
            playing[i] = true;
          }
        }

        if (video && !reduced) {
          const tc = clamp(t, -1, 1.2);
          // The chapters move DOWN the page: each clip rises as you pass it.
          // Scale stays ahead of the shift so no edge is ever exposed —
          // 1.08 gives 4% headroom a side against a 3.5% travel.
          const scale = 1.08 + (tc + 1) * 0.04;
          video.style.transform = `translate3d(0, ${-tc * 3.5}%, 0) scale(${scale})`;
        }

        if (line) {
          // A chapter line never shares the screen with an opening beat — the
          // handoff overlaps by design, so this hands the centre over cleanly.
          const lo = clamp((0.62 - a) / 0.3, 0, 1) * (1 - openingText);
          line.style.opacity = String(lo);
          line.style.transform = `translateY(${clamp(tOp, -1, 1) * -10}px)`;
          if (lo > sceneText) sceneText = lo;
        }

        if (o > best) {
          best = o;
          idx = i;
        }
      }

      /* ---------- veils ---------- */
      // Blur only while words are up, and gentler over the opening so the hero
      // keeps its edge during the reveal.
      const blurTarget = Math.max(sceneText * SCENE_BLUR, openingText * OPEN_BLUR);
      if (veilRef.current) {
        const blur = Math.round(blurTarget * 2) / 2;
        if (blur !== lastBlur) {
          lastBlur = blur;
          veilRef.current.style.backdropFilter = `blur(${blur}px)`;
          veilRef.current.style.webkitBackdropFilter = `blur(${blur}px)`;
        }
      }
      if (veilDarkRef.current) {
        const strength = Math.max(sceneText, openingText * openingTint);
        veilDarkRef.current.style.opacity = (0.16 + 0.84 * strength).toFixed(3);
      }

      if (cueRef.current) {
        cueRef.current.style.opacity = String(clamp(1 - p / 0.4, 0, 1));
      }
      if (ticksRef.current) {
        ticksRef.current.style.opacity = String(clamp((p - OPEN_SPAN + 0.7) / 0.6, 0, 1));
      }

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      const ph = p < OPEN_SPAN - 0.5 ? 'opening' : 'chapters';
      if (ph !== phaseRef.current) {
        phaseRef.current = ph;
        setPhase(ph);
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
    // A backgrounded tab starves requestAnimationFrame, so a scroll that lands
    // while hidden leaves `queued` stuck true and every later scroll is
    // dropped. Clear the latch and catch up whenever we become visible again.
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      cancelAnimationFrame(raf);
      queued = false;
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
    document.addEventListener('visibilitychange', onVisibility);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      ro.disconnect();
    };
  }, [sceneCount, beatCount, openingTint, span]);

  const scrollToScene = useCallback(
    (i) => {
      window.scrollTo({
        top: ((OPEN_SPAN + i) / span) * maxScroll(),
        behavior: prefersReduced() ? 'auto' : 'smooth',
      });
    },
    [span]
  );

  return {
    heroRef,
    railRef,
    beatRefs,
    layerRefs,
    videoRefs,
    lineRefs,
    veilRef,
    veilDarkRef,
    cueRef,
    ticksRef,
    scrollerRef,
    active,
    phase,
    scrollToScene,
  };
}

export default useSequence;
