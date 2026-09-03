import { useMemo, useState } from 'react';
import SCENES from './data/scenes';
import { HERO, IDEAS, MARKS } from './data/opening';
import COLLAB from './data/collab';
import useJourney from './hooks/useJourney';

export default function App() {
  // group the chapters by idea, in the order the seven are listed; ideas with
  // no chapters yet still appear in the menu, just inert
  const ideas = useMemo(
    () =>
      IDEAS.map((name) => ({
        name,
        scenes: SCENES.filter((s) => s.idea === name),
      })),
    []
  );

  const {
    heroRef,
    introRef,
    letterRefs,
    subRef,
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
    scrollerRef,
    mode,
    openIdea,
    active,
    open,
    close,
  } = useJourney(ideas);

  const [partner, setPartner] = useState(0);
  const who = COLLAB.partners[partner];

  const current = openIdea != null ? ideas[openIdea] : null;
  const currentNo = openIdea != null ? String(openIdea + 1).padStart(2, '0') : null;

  return (
    <>
      {/* ---------- the hero, behind everything ---------- */}
      <div className="hero" ref={heroRef} aria-hidden="true">
        <picture>
          <source media="(max-width: 900px)" srcSet={HERO.sm} />
          <img className="hero-img" src={HERO.lg} alt="" decoding="async" fetchpriority="high" />
        </picture>
        <div className="hero-sweep" aria-hidden="true" />
        <div className="hero-bloom" aria-hidden="true" />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="mast">
        <span className="mast-mark">PROJECT 49</span>
        <span className={current ? 'mast-idea on' : 'mast-idea'}>
          {current ? `${currentNo} / ${current.name}` : ''}
        </span>
      </header>

      {/* ---------- intro: the wordmark ---------- */}
      <div className="intro" ref={introRef}>
        <h1 className="wordmark" aria-label="PROJECT 49">
          {'PROJECT 49'.split('').map((ch, k) => (
            <span
              key={k}
              className={ch === ' ' ? 'wm-l wm-l--space' : 'wm-l'}
              aria-hidden="true"
              ref={(el) => {
                letterRefs.current[k] = el;
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </h1>
        <p className="wordmark-sub" ref={subRef}>
          49 Homes. 7 Ideas. 1 City.
        </p>
      </div>

      {/* ---------- menu: the seven, risen ---------- */}
      <nav className="menu" ref={menuRef} aria-label="The seven ideas">
        {ideas.map((idea, i) => {
          const can = idea.scenes.length > 0;
          return (
            <button
              key={idea.name}
              type="button"
              className={'menu-item' + (can ? '' : ' menu-item--soon')}
              ref={(el) => {
                menuItemRefs.current[i] = el;
              }}
              disabled={!can}
              onClick={() => can && open(i)}
            >
              <span className="menu-no">{String(i + 1).padStart(2, '0')}</span>
              <span className="menu-name">
                {MARKS[idea.name] ? (
                  <img className="menu-mark" src={MARKS[idea.name]} alt={idea.name} />
                ) : (
                  idea.name
                )}
              </span>
              <span className="menu-count">
                {can ? `${idea.scenes.length} films` : 'soon'}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ---------- closing frame: the collaboration ---------- */}
      <section className="collab" ref={collabRef} aria-label="Collaboration">
        <p className="collab-eyebrow">{COLLAB.eyebrow}</p>
        <h2 className="collab-title">
          {COLLAB.partners.map((pt, i) => (
            <span key={pt.id}>
              {i > 0 && <span className="collab-x">{'\u00d7'}</span>}
              <span className="collab-name">{pt.name}</span>
            </span>
          ))}
        </h2>

        <div className="tabs" role="tablist" aria-label="Our experience">
          {COLLAB.partners.map((pt, i) => (
            <button
              key={pt.id}
              type="button"
              role="tab"
              aria-selected={i === partner}
              className={'tab' + (i === partner ? ' on' : '')}
              onClick={() => setPartner(i)}
            >
              {pt.name}
            </button>
          ))}
        </div>

        <div className="exp" role="tabpanel" key={who.id}>
          <p className="exp-role">{who.role}</p>
          <ul className="exp-list">
            {who.experience.map((e, i) => (
              <li className="exp-item" key={i}>
                <span className="exp-title">{e.title}</span>
                <span className="exp-meta">{e.meta}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="cue" ref={cueRef} aria-hidden="true">
        SCROLL
      </p>

      {/* ---------- an idea, opened ---------- */}
      <section
        className={'panel' + (current ? ' panel--open' : '')}
        ref={panelRef}
        aria-hidden={current ? 'false' : 'true'}
      >
        {current && (
          <>
            <div className="stage" aria-hidden="true">
              {current.scenes.map((s, i) => (
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
                    onCanPlay={() => window.dispatchEvent(new Event('scroll'))}
                  />
                </div>
              ))}
            </div>

            <div className="veil" ref={veilRef} aria-hidden="true" />
            <div className="veil-dark" ref={veilDarkRef} aria-hidden="true" />

            <div className="concepts" aria-hidden="true">
              <h2 className="concept" ref={conceptRef}>
                {MARKS[current.name] ? (
                  <img className="concept-mark" src={MARKS[current.name]} alt="" />
                ) : (
                  current.name
                )}
              </h2>
            </div>

            <div className="statements">
              {current.scenes.map((s, i) => (
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

            <nav className="marks" aria-label="Chapters">
              {current.scenes.map((s, i) => (
                <span
                  key={s.id}
                  className={i === active ? 'mark on' : 'mark'}
                  aria-label={s.eyebrow}
                />
              ))}
            </nav>

            <button type="button" className="panel-close" onClick={close} aria-label="Close">
              CLOSE
            </button>
          </>
        )}
      </section>

      {/* the only element in flow: its height is what there is to scroll */}
      <div className="scroller" ref={scrollerRef} />
    </>
  );
}
