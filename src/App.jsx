import { useMemo, useState, useCallback } from 'react';
import SPACES from './data/spaces';
import useWalkthrough from './hooks/useWalkthrough';
import Stage from './components/Stage';
import Captions from './components/Captions';
import RouteRail from './components/RouteRail';

export default function App() {
  const spaces = SPACES;
  const {
    frameRefs,
    imageRefs,
    capRefs,
    overtureRef,
    outroRef,
    scrollerRef,
    active,
    scrollToSpace,
  } = useWalkthrough(spaces.length);

  const [ready, setReady] = useState(false);
  const onFirstReady = useCallback(() => setReady(true), []);

  // consecutive spaces sharing a movement collapse into one stop on the rail
  const movements = useMemo(() => {
    const out = [];
    spaces.forEach((s, i) => {
      const last = out[out.length - 1];
      if (last && last.name === s.movement) last.end = i;
      else out.push({ name: s.movement, start: i, end: i });
    });
    return out;
  }, [spaces]);

  return (
    <>
      <div className={ready ? 'loader gone' : 'loader'}>
        <span className="loader-mark">PROJECT 49</span>
      </div>

      <Stage
        spaces={spaces}
        frameRefs={frameRefs}
        imageRefs={imageRefs}
        onFirstReady={onFirstReady}
      />

      <div className="scrim" />
      <div className="grain" />

      <header className="mast">
        <span className="mast-mark">PROJECT 49</span>
        <span className="mast-idea">01 / LIGHT</span>
      </header>

      <div className="overture" ref={overtureRef}>
        <p className="overture-eyebrow">IDEA 01 &middot; SEVEN HOMES</p>
        <h1 className="overture-title">
          A house built
          <br />
          with <em>light</em>
        </h1>
        <p className="overture-sub">HYDERABAD &middot; 7,000 SQ FT</p>
        <div className="overture-cue">
          SCROLL TO WALK THROUGH
          <span />
        </div>
      </div>

      <Captions spaces={spaces} capRefs={capRefs} />

      <RouteRail
        movements={movements}
        spaces={spaces}
        active={active}
        onJump={scrollToSpace}
      />

      <div className="outro" ref={outroRef}>
        <p className="outro-meta">END OF WALKTHROUGH</p>
        <p className="outro-line">
          The philosophy repeats.
          <br />
          The building never does.
        </p>
        <p className="outro-note">
          One of seven homes under Idea 01. Six further ideas &mdash; Air, Art,
          Roots, Land, Silence, Water &mdash; each with their own seven.
        </p>
      </div>

      {/* the only element in flow: its height is what there is to scroll */}
      <div className="scroller" ref={scrollerRef} />
    </>
  );
}
