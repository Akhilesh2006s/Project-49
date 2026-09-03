import { useEffect, useMemo } from 'react';
import SCENES, { CARDS } from './data/scenes';
import { BEATS, HERO, MARKS } from './data/opening';
import useSequence from './hooks/useSequence';
import Opening from './components/Opening';

export default function App() {
  // Each idea owns a stretch of the run. The concept title belongs to the idea,
  // so it holds while the statement beneath it changes chapter to chapter.
  const ideaRanges = useMemo(() => {
    const out = [];
    SCENES.forEach((s, i) => {
      const last = out[out.length - 1];
      if (last && last.name === s.idea) last.to = i;
      else out.push({ name: s.idea, from: i, to: i });
    });
    return out;
  }, []);

  const {
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
    // a light hero must not be greyed down by the chapter veil
  } = useSequence(
    SCENES.length,
    BEATS.length,
    CARDS,
    ideaRanges,
    HERO.tone === 'light' ? 0 : 0.34
  );

  // the masthead and cue live outside the panel, so they follow the tone here
  useEffect(() => {
    const on = HERO.tone === 'light' && phase === 'opening';
    document.body.classList.toggle('opening-light', on);
    return () => document.body.classList.remove('opening-light');
  }, [phase]);

  const activeIdea = SCENES[active]?.idea ?? 'LIGHT';
  const activeIdeaNo = ideaRanges.findIndex((r) => r.name === activeIdea) + 1;

  return (
    <>
      <div className="stage" aria-hidden="true">
        {SCENES.map((s, i) => (
          <div
            key={s.id}
            className="layer"
            ref={(el) => {
              layerRefs.current[i] = el;
            }}
          >
            <video
              className="layer-video"
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={s.video}
              poster={s.poster}
              muted
              loop
              playsInline
              preload={i === 0 ? 'auto' : 'metadata'}
              // A clip that becomes playable after the last render would sit
              // paused until the next scroll. Nudge the driver instead: it
              // plays whatever is on screen and pauses the rest.
              onCanPlay={() => window.dispatchEvent(new Event('scroll'))}
            />
          </div>
        ))}
      </div>

      <Opening heroRef={heroRef} railRef={railRef} beatRefs={beatRefs} />

      {/* blurs the light behind the words, and only while the words are up */}
      <div className="veil" ref={veilRef} aria-hidden="true" />
      {/* and darkens it — these clips go near-white, and ivory on a sunlit
          wall is unreadable without it. Opacity rides the same curve. */}
      <div className="veil-dark" ref={veilDarkRef} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="mast">
        <span className="mast-mark">PROJECT 49</span>
        <span className={phase === 'chapters' ? 'mast-idea on' : 'mast-idea'}>
          {String(activeIdeaNo).padStart(2, '0')} / {activeIdea}
        </span>
      </header>

      {/* the concept, held for the length of its idea */}
      <div className="concepts" aria-hidden="true">
        {ideaRanges.map((r, i) => (
          <h2
            key={r.name}
            className="concept"
            ref={(el) => {
              ideaRefs.current[i] = el;
            }}
          >
            {MARKS[r.name] ? (
              <img className="concept-mark" src={MARKS[r.name]} alt="" />
            ) : (
              r.name
            )}
          </h2>
        ))}
      </div>

      {/* one statement beneath it, changing chapter to chapter */}
      <div className="statements">
        {SCENES.map((s, i) => (
          <p
            key={s.id}
            className="statement"
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
          >
            {s.line.map((part, k) => (
              <span className="statement-row" key={k}>
                {part}
              </span>
            ))}
          </p>
        ))}
      </div>

      <div className="cards">
        {CARDS.map((c, i) => (
          <div
            key={c.id}
            className="idea-card"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <p className="card-num">
              {c.no} / {c.name}
            </p>
            <p className="card-sub">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* the quietest thing on the page: position, not decoration */}
      <nav className="marks" ref={ticksRef} aria-label="Chapters">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={i === active ? 'mark on' : 'mark'}
            aria-current={i === active ? 'true' : undefined}
            aria-label={`${s.idea} — ${s.eyebrow}`}
            onClick={() => scrollToScene(i)}
          />
        ))}
      </nav>

      <p className="cue" ref={cueRef} aria-hidden="true">
        SCROLL
      </p>

      {/* the only element in flow: its height is what there is to scroll */}
      <div className="scroller" ref={scrollerRef} />
    </>
  );
}
