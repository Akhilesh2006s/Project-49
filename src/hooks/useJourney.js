import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The page is a hub, not one long run.
 *
 *   intro  — PROJECT 49 over the hero
 *   menu   — the seven ideas, risen and enlarged.
 *   collab — one more screen past the seven: who made this, with a tab
 *            for each partner's own experience.
 *   idea   — an idea opened out. Scroll now belongs to its chapters, and
 *            scrolling past the last one closes it back to the menu.
 *
 * Opening and closing is a FLIP: the panel starts scaled and translated onto
 * the exact rect of the name you clicked, then animates to identity — so it
 * grows out of the word rather than appearing over it.
 */

export const PACE = 1.5;
export const SMOOTH = 0.11;
export const CROSSFADE = 0.6;
export const TAIL = 0.55;      // travel past the last chapter before it closes
// A one-film idea has no chapters to travel between, so it is held for a
// while before the tail begins: the film gets its ten seconds of scroll.
export const HOLD_SINGLE = 1.6;
export const INTRO_SPAN = 2;   // intro -> menu -> collaboration

// the order the wordmark's glyphs leave in — scattered, not a wipe
const LETTER_ORDER = [5, 1, 8, 3, 0, 6, 2, 9, 4, 7];

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

export function useJourney(ideas) {
  // ideas: [{ name, scenes: [...] }] — only those with scenes can open
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const letterRefs = useRef([]);   // the wordmark, one span per glyph
  const subRef = useRef(null);
  const crestRef = useRef(null);   // the elephant above the wordmark
  const menuRef = useRef(null);
  const collabRef = useRef(null);
  const menuItemRefs = useRef([]);
  const panelRef = useRef(null);
  const layerRefs = useRef([]);
  const videoRefs = useRef([]);
  const conceptRef = useRef(null);
  const lineRefs = useRef([]);
  const veilRef = useRef(null);
  const veilDarkRef = useRef(null);
  const cueRef = useRef(null);
  const panelCueRef = useRef(null);
  const scrollerRef = useRef(null);

  const [mode, setMode] = useState('intro');
  const [openIdea, setOpenIdea] = useState(null);
  const [active, setActive] = useState(0);

  const modeRef = useRef('intro');
  const openRef = useRef(null);
  const activeRef = useRef(0);
  const menuYRef = useRef(0);
  const closingRef = useRef(false);

  // one live copy the rAF loop can read without re-subscribing
  const stateRef = useRef({ ideas });
  stateRef.current.ideas = ideas;

  const holdFor = (scenes) => (scenes.length === 1 ? HOLD_SINGLE : 0);

  const spanFor = useCallback(() => {
    const i = openRef.current;
    if (i == null) return INTRO_SPAN;
    const scenes = stateRef.current.ideas[i].scenes;
    return scenes.length - 1 + holdFor(scenes) + TAIL;
  }, []);

  const layout = useCallback(() => {
    const h = window.innerHeight;
    if (h <= 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    // A hidden tab reports zero height; keeping the last good geometry means
    // the page never collapses to nothing.
    el.style.height = (spanFor() + 1) * h * PACE + 'px';
  }, [spanFor]);

  useEffect(() => {
    const reduced = prefersReduced();
    let raf = 0;
    let running = false;
    let current = 0;
    let target = 0;
    let lastBlur = -1;
    const playing = [];

    const readTarget = () => {
      const max = maxScroll();
      target = max > 0 ? clamp(scrollTop() / max, 0, 1) * spanFor() : 0;
    };

    const render = (p) => {
      const openAt = openRef.current;

      if (openAt == null) {
        /* ---------- intro -> menu ---------- */
        const t = clamp(p, 0, 1);
        const u = clamp(p - 1, 0, 1);   // menu -> collaboration
        if (introRef.current) {
          if (!reduced) {
            introRef.current.style.transform =
              'translate3d(0,' + (-t * 26).toFixed(1) + 'px,0)';
          }
          // no fade on the wrapper — the letters go one at a time
          introRef.current.style.pointerEvents = 'none';
        }
        if (subRef.current) {
          subRef.current.style.opacity = String(clamp(1 - t / 0.3, 0, 1));
        }
        if (crestRef.current) {
          // leaves with the first letters, lifting slightly
          const g = clamp(t / 0.4, 0, 1);
          crestRef.current.style.opacity = String(1 - g);
          if (!reduced) {
            crestRef.current.style.transform =
              'translate3d(0,' + (-g * 18).toFixed(1) + 'px,0)';
          }
        }
        const letters = letterRefs.current;
        const n = letters.length;
        for (let k = 0; k < n; k++) {
          const el = letters[k];
          if (!el) continue;
          // each glyph leaves on its own cue, in a scattered order, and the
          // word loosens as it goes: the letters drift apart and dissolve
          const start = (LETTER_ORDER[k % LETTER_ORDER.length] / n) * 0.34;
          const gone = clamp((t - start) / 0.26, 0, 1);
          const e = gone * gone * (3 - 2 * gone);
          el.style.opacity = String(1 - e);
          if (!reduced) {
            const spread = (k - (n - 1) / 2) * e * 9;
            el.style.transform =
              'translate3d(' + spread.toFixed(1) + 'px,' + (-e * 22).toFixed(1) +
              'px,0)';
            el.style.filter = e > 0.01 ? 'blur(' + (e * 7).toFixed(1) + 'px)' : '';
          }
        }
        if (menuRef.current) {
          // the names rise and enlarge into place
          // starts once most of the wordmark has gone (letters clear by ~0.57)
          const m = clamp((t - 0.38) / 0.52, 0, 1);
          // and gives way again as the closing frame comes up
          const leave = clamp(u / 0.45, 0, 1);
          menuRef.current.style.opacity = String(m * (1 - leave));
          if (!reduced) {
            menuRef.current.style.transform =
              'translate3d(0,' + ((1 - m) * 60 - leave * 40).toFixed(1) + 'px,0) scale(' +
              (0.82 + m * 0.18 - leave * 0.04).toFixed(4) + ')';
          }
          menuRef.current.style.pointerEvents = m > 0.9 && leave < 0.15 ? 'auto' : 'none';
        }
        if (collabRef.current) {
          const c = clamp((u - 0.3) / 0.55, 0, 1);
          collabRef.current.style.opacity = String(c);
          if (!reduced) {
            collabRef.current.style.transform =
              'translate3d(0,' + ((1 - c) * 48).toFixed(1) + 'px,0)';
          }
          collabRef.current.style.pointerEvents = c > 0.85 ? 'auto' : 'none';
        }
        if (heroRef.current && !reduced) {
          heroRef.current.style.transform =
            'scale(' + (1.04 + t * 0.05).toFixed(4) + ')';
        }
        if (cueRef.current) {
          cueRef.current.style.opacity = String(clamp(1 - p / 0.35, 0, 1));
        }
        const nextMode = u > 0.5 ? 'collab' : t > 0.6 ? 'menu' : 'intro';
        if (nextMode !== modeRef.current) {
          modeRef.current = nextMode;
          setMode(nextMode);
        }
        return;
      }

      /* ---------- an idea, opened ---------- */
      const scenes = stateRef.current.ideas[openAt].scenes;
      const end = scenes.length - 1 + holdFor(scenes);   // where the tail starts
      let idx = 0;
      let best = -1;
      let text = 0;

      for (let i = 0; i < scenes.length; i++) {
        const layer = layerRefs.current[i];
        if (!layer) continue;
        const video = videoRefs.current[i];
        const line = lineRefs.current[i];

        const t = p - i;
        const tOp = i === scenes.length - 1 ? Math.min(t, 0) : t;
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
          const tc = clamp(t, -1, 1.2 + holdFor(scenes));
          // scale stays ahead of the shift so a moved clip never shows an edge
          video.style.transform =
            'translate3d(0,' + (-tc * 3.5).toFixed(1) + '%,0) scale(' +
            (1.08 + (tc + 1) * 0.04).toFixed(4) + ')';
        }

        if (line) {
          // zero by the midpoint between chapters, so two statements are never
          // both up — crossfading different texts in one place is ghosting
          const reveal = clamp((0.5 - a) / 0.22, 0, 1);
          line.style.opacity = String(reveal);
          if (!reduced) {
            line.style.transform =
              'translate3d(0,' + ((1 - reveal) * 12).toFixed(1) + 'px,0)';
          }
          if (reveal > text) text = reveal;
        }

        if (o > best) {
          best = o;
          idx = i;
        }
      }

      if (conceptRef.current) {
        // holds for the whole idea, easing off only as it closes
        const out = clamp((p - end) / TAIL, 0, 1);
        conceptRef.current.style.opacity = String(1 - out);
      }

      if (veilRef.current) {
        const blur = Math.round(text * 2.5 * 2) / 2;
        if (blur !== lastBlur) {
          lastBlur = blur;
          veilRef.current.style.backdropFilter = 'blur(' + blur + 'px)';
          veilRef.current.style.webkitBackdropFilter = 'blur(' + blur + 'px)';
        }
      }
      if (veilDarkRef.current) {
        veilDarkRef.current.style.opacity = (0.16 + 0.84 * text).toFixed(3);
      }

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }

      // scrolled past the end — fold it back up
      if (panelCueRef.current) {
        // the cue inside an opened idea: gone as soon as the page moves
        panelCueRef.current.style.opacity = String(1 - clamp(p / 0.12, 0, 1));
      }

      if (p >= end + TAIL - 0.02 && !closingRef.current) {
        closingRef.current = true;
        window.dispatchEvent(new CustomEvent('p49:close'));
      }
    };

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
    // a backgrounded tab starves rAF; reset the latch and catch up
    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      cancelAnimationFrame(raf);
      running = false;
      onResize();
    };
    const onJump = () => {
      cancelAnimationFrame(raf);
      running = false;
      current = 0;
      target = 0;
      render(0);
    };
    // land exactly where the page is now, no easing — used after a close
    const onSync = () => {
      cancelAnimationFrame(raf);
      running = false;
      readTarget();
      current = target;
      render(current);
    };

    layout();
    readTarget();
    current = target;
    render(current);

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('p49:jump', onJump);
    window.addEventListener('p49:sync', onSync);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('p49:jump', onJump);
      window.removeEventListener('p49:sync', onSync);
      ro.disconnect();
    };
  }, [layout, spanFor]);

  /* ---------- open / close ---------- */

  const open = useCallback(
    (i) => {
      if (openRef.current != null) return;
      const item = menuItemRefs.current[i];
      const panel = panelRef.current;
      menuYRef.current = scrollTop();

      openRef.current = i;
      closingRef.current = false;
      activeRef.current = 0;
      setOpenIdea(i);
      setActive(0);
      setMode('idea');

      // FLIP: start on the word's own rect, then run to identity. Done
      // synchronously — a backgrounded tab is given no animation frames, and
      // the layout and scroll reset must not be hostage to one.
      layout();
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('p49:jump'));
      if (panel && item && !prefersReduced() && window.innerWidth > 0 && window.innerHeight > 0) {
        const r = (item.querySelector('.menu-name') || item).getBoundingClientRect();
        const sx = Math.max(r.width / window.innerWidth, 0.12);
        const sy = Math.max(r.height / window.innerHeight, 0.04);
        const dx = r.left + r.width / 2 - window.innerWidth / 2;
        const dy = r.top + r.height / 2 - window.innerHeight / 2;
        panel.style.transition = 'none';
        panel.style.opacity = '0';
        panel.style.transform =
          'translate3d(' + dx + 'px,' + dy + 'px,0) scale(' + sx + ',' + sy + ')';
        // commit the start rect, then release it
        void panel.offsetWidth;
        panel.style.transition =
          'transform 900ms cubic-bezier(0.16,1,0.3,1), opacity 500ms ease-out';
        panel.style.opacity = '1';
        panel.style.transform = 'none';
      } else if (panel) {
        panel.style.transition = 'none';
        panel.style.transform = 'none';
        panel.style.opacity = '1';
      }
    },
    [layout]
  );

  const close = useCallback(() => {
    const i = openRef.current;
    if (i == null) return;
    const item = menuItemRefs.current[i];
    const panel = panelRef.current;

    const finish = () => {
      openRef.current = null;
      closingRef.current = false;
      setOpenIdea(null);
      setMode('menu');
      // put the page back where the menu was, and draw it there at once
      layout();
      window.scrollTo(0, menuYRef.current);
      window.dispatchEvent(new Event('p49:sync'));
    };

    if (panel && item && !prefersReduced() && window.innerWidth > 0 && window.innerHeight > 0) {
      const r = (item.querySelector('.menu-name') || item).getBoundingClientRect();
      const sx = Math.max(r.width / window.innerWidth, 0.12);
      const sy = Math.max(r.height / window.innerHeight, 0.04);
      const dx = r.left + r.width / 2 - window.innerWidth / 2;
      const dy = r.top + r.height / 2 - window.innerHeight / 2;
      panel.style.transition =
        'transform 760ms cubic-bezier(0.16,1,0.3,1), opacity 420ms ease-in 220ms';
      panel.style.opacity = '0';
      panel.style.transform =
        'translate3d(' + dx + 'px,' + dy + 'px,0) scale(' + sx + ',' + sy + ')';
      window.setTimeout(finish, 780);
    } else {
      finish();
    }
  }, [layout]);

  // the driver asks for a close when you scroll past the last chapter
  useEffect(() => {
    const h = () => close();
    window.addEventListener('p49:close', h);
    return () => window.removeEventListener('p49:close', h);
  }, [close]);

  // escape closes too
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [close]);

  return {
    heroRef,
    introRef,
    letterRefs,
    subRef,
    crestRef,
    menuRef,
    collabRef,
    menuItemRefs,
    panelRef,
    layerRefs,
    videoRefs,
    conceptRef,
    lineRefs,
    veilRef,
    veilDarkRef,
    cueRef,
    panelCueRef,
    scrollerRef,
    mode,
    openIdea,
    active,
    open,
    close,
  };
}

export default useJourney;
