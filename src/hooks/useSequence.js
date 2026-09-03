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
export const PACE = 1.5;
// How hard `p` is pulled toward the scroll position each frame. Scroll
// events are coarse and arrive in bursts; easing toward the target rather
// than snapping to it is what makes the sequence feel like film, not steps.
export const SMOOTH = 0.11;
// How far apart the characters of a line arrive. Higher is a longer,
// more theatrical cascade; 0 makes the whole line land at once.
export const SCENE_BLUR = 2.5;  // px behind a statement. The architecture
                                // is the hero — the darkening carries the
                                // contrast, so this stays barely there.
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

export function useSequence(
  sceneCount,
  beatCount,
  cards = [],
  ideaRanges = [],
  openingTint = 0.34
) {
  const span = OPEN_SPAN + (sceneCount - 1) + TAIL;

  const heroRef = useRef(null);
  const railRef = useRef(null);
  const beatRefs = useRef([]);
  const layerRefs = useRef([]);
  const videoRefs = useRef([]);
  const lineRefs = useRef([]);
  const cardRefs = useRef([]);
  const ideaRefs = useRef([]);
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
    let running = false;
    let current = 0;
    let target = 0;
    let lastBlur = -1;
    const lastTrack = [];

    const layout = () => {
      const h = window.innerHeight;
      // A hidden tab or a thumbnail capture reports zero height; keep the last
      // good geometry rather than collapsing the page.
      if (h <= 0) return;
      if (scrollerRef.current) {
        scrollerRef.current.style.height = (span + 1) * h * PACE + 'px';
      }
    };

    const render = (p) => {

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

      const sp = p - OPEN_SPAN;

      /* ---------- idea cards ---------- */
      // Placed on half units, so they land in the gap between two chapters.
      let cardText = 0;
      for (let k = 0; k < cards.length; k++) {
        const el = cardRefs.current[k];
        if (!el) continue;
        const d = sp - cards[k].at;
        const o = clamp((0.68 - Math.abs(d)) / 0.32, 0, 1);
        el.style.opacity = String(o);
        el.style.transform = "translateY(" + clamp(d, -1, 1) * -10 + "px)";
        if (o > cardText) cardText = o;
      }
      // A card owns the centre while it is up. The gate is doubled on purpose:
      // a plain (1 - cardText) has card and line crossing at 0.5/0.5, and two
      // different texts dissolving through each other in one well reads as
      // ghosting. Doubling hands the centre over through a gap instead.
      const cardGate = clamp(1 - cardText * 2, 0, 1);

      /* ---------- the concept ---------- */
      // Driven by the idea's whole RANGE, so scrolling between two chapters of
      // one idea leaves the title untouched. It arrives on a slow fade, a small
      // rise, and a tracking that settles inward — no splitting, no scaling.
      let ideaText = 0;
      for (let k = 0; k < ideaRanges.length; k++) {
        const el = ideaRefs.current[k];
        if (!el) continue;
        const r = ideaRanges[k];
        const outside = sp < r.from ? r.from - sp : sp > r.to ? sp - r.to : 0;
        const o = clamp((0.5 - outside) / 0.25, 0, 1) * cardGate;
        if (o <= 0.002) {
          if (el.style.display !== "none") el.style.display = "none";
          continue;
        }
        if (el.style.display === "none") el.style.display = "";
        el.style.opacity = String(o);
        if (!reduced) {
          el.style.transform = "translate3d(0," + ((1 - o) * 16).toFixed(1) + "px,0)";
          // letter-spacing is a LAYOUT property, so it is quantised: written
          // only when it actually changes, not on every frame.
          const track = Math.round((0.075 - o * 0.06) * 1000) / 1000;
          if (track !== lastTrack[k]) {
            lastTrack[k] = track;
            el.style.letterSpacing = track + "em";
          }
        }
        if (o > ideaText) ideaText = o;
      }

      /* ---------- chapters ---------- */
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
          if (layer.style.display !== "none") layer.style.display = "none";
          if (line) line.style.opacity = "0";
          if (video && playing[i]) {
            video.pause();
            playing[i] = false;
          }
          continue;
        }
        if (layer.style.display === "none") layer.style.display = "";
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
          video.style.transform =
            "translate3d(0," + -tc * 3.5 + "%,0) scale(" + scale + ")";
        }

        if (line) {
          const gate = (1 - openingText) * cardGate;
          // Zero by a = 0.5, which is the midpoint between two chapters — so
          // adjacent statements are never both visible. Crossfading two
          // different texts in one position is ghosting, not a transition.
          const reveal = clamp((0.5 - a) / 0.22, 0, 1) * gate;
          line.style.opacity = String(reveal);
          if (!reduced) {
            line.style.transform =
              "translate3d(0," + ((1 - reveal) * 12).toFixed(1) + "px,0)";
          }
          if (reveal > sceneText) sceneText = reveal;
        }

        if (o > best) {
          best = o;
          idx = i;
        }
      }
      sceneText = Math.max(sceneText, cardText, ideaText * 0.9);

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

    // Progress is read as a FRACTION of the scrollable range, never as pixels
    // per segment — so it cannot overrun when the viewport measures zero.
    const readTarget = () => {
      const max = maxScroll();
      target = max > 0 ? clamp(scrollTop() / max, 0, 1) * span : 0;
    };

    // `current` chases `target` rather than snapping to it. Scroll events are
    // coarse and bursty; this is what turns them into continuous motion.
    const tick = () => {
      const d = target - current;
      if (Math.abs(d) < 0.0004) {
        current = target;
        running = false;
        render(current);
        return;
      }
      current += d * SMOOTH;
      render(current);
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      readTarget();
      kick();
    };
    const onResize = () => {
      layout();
      readTarget();
      current = target;
      render(current);
    };
    // A backgrounded tab starves requestAnimationFrame, which would leave
    // `running` stuck true and every later scroll ignored. Reset and catch up.
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      cancelAnimationFrame(raf);
      running = false;
      layout();
      readTarget();
      current = target;
      render(current);
    };

    layout();
    readTarget();
    current = target;
    render(current);

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
  }, [sceneCount, beatCount, cards, ideaRanges, openingTint, span]);

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
    cardRefs,
    ideaRefs,
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
