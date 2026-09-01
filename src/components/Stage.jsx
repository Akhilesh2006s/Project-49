import { useEffect, useState } from 'react';

/**
 * Every space is a stacked full-bleed layer. Each starts on its inlined
 * low-quality placeholder so the stage is never black, then swaps to the full
 * render once that has decoded.
 */

function pickSrc(space) {
  const w = window.innerWidth * (window.devicePixelRatio || 1);
  return w > 1500 ? space.src.lg : space.src.sm;
}

export default function Stage({ spaces, frameRefs, imageRefs, onFirstReady }) {
  const [loaded, setLoaded] = useState(() => new Set());

  useEffect(() => {
    let cancelled = false;
    const done = new Set();

    const load = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          if (cancelled) return resolve();
          done.add(i);
          setLoaded(new Set(done));
          resolve();
        };
        img.src = pickSrc(spaces[i]);
      });

    // The first three carry the opening; fetch them before anything else, then
    // let the rest trickle in so they are ready by the time you scroll to them.
    (async () => {
      await Promise.all([0, 1, 2].filter((i) => i < spaces.length).map(load));
      if (cancelled) return;
      onFirstReady?.();
      for (let i = 3; i < spaces.length; i++) {
        if (cancelled) return;
        await load(i);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [spaces, onFirstReady]);

  return (
    <div className="stage" aria-hidden="true">
      {spaces.map((s, i) => (
        <div
          key={s.id}
          className="frame"
          ref={(el) => (frameRefs.current[i] = el)}
        >
          <div
            className="frame-img"
            ref={(el) => (imageRefs.current[i] = el)}
            style={{
              backgroundImage: `url("${loaded.has(i) ? pickSrc(s) : s.lqip}")`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
