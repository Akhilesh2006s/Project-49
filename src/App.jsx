import { useEffect } from 'react';
import SCENES, { CARDS } from './data/scenes';
import { BEATS, HERO } from './data/opening';
import useSequence from './hooks/useSequence';
import Opening from './components/Opening';

export default function App() {
  const {
    heroRef,
    railRef,
    beatRefs,
    layerRefs,
    videoRefs,
    lineRefs,
    cardRefs,
    veilRef,
    veilDarkRef,
    cueRef,
    ticksRef,
    scrollerRef,
    active,
    phase,
    scrollToScene,
    // a light hero must not be greyed down by the chapter veil
  } = useSequence(SCENES.length, BEATS.length, CARDS, HERO.tone === 'light' ? 0 : 0.34);

  // the masthead and cue live outside the panel, so they follow the tone here
  useEffect(() => {
    const on = HERO.tone === 'light' && phase === 'opening';
    document.body.classList.toggle('opening-light', on);
    return () => document.body.classList.remove('opening-light');
  }, [phase]);

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
          {(() => {
            const idea = SCENES[active]?.idea ?? 'LIGHT';
            const no = String(
              [...new Set(SCENES.map((s) => s.idea))].indexOf(idea) + 1
            ).padStart(2, '0');
            return `${no} / ${idea}`;
          })()}
        </span>
      </header>

      <div className="lines">
        {SCENES.map((s, i) => (
          <div
            key={s.id}
            className="line"
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
          >
            <p className="line-eyebrow">{s.eyebrow}</p>
            <p className="line-text">{s.line}</p>
          </div>
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
            <p className="chapter-num">
              {c.no} / {c.name}
            </p>
            <h2 className="chapter-title">{c.title}</h2>
            <p className="chapter-sub">{c.sub}</p>
          </div>
        ))}
      </div>

      <nav className="ticks" ref={ticksRef} aria-label="Chapters">
        {SCENES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={i === active ? 'tick on' : 'tick'}
            aria-current={i === active ? 'true' : undefined}
            aria-label={s.line}
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
