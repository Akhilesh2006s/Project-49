import { BEATS, IDEAS, HERO } from '../data/opening';

/**
 * Two panels on a horizontal rail: the opening composition, then the chapter
 * card it travels into. The rail is translated by the scroll driver.
 *
 * The seven names are part of the opening itself — they sit together at the
 * foot of the frame and settle in on load, not on scroll.
 */
export default function Opening({ heroRef, railRef, beatRefs }) {
  return (
    <>
      <div className="hero" ref={heroRef} aria-hidden="true">
        <picture>
          <source media="(max-width: 900px)" srcSet={HERO.sm} />
          <img className="hero-img" src={HERO.lg} alt="" decoding="async" fetchpriority="high" />
        </picture>
      </div>

      <div className="rail" ref={railRef}>
        {BEATS.map((b, i) => (
          <section
            key={b.id}
            className={`beat beat--${HERO.tone === 'light' ? 'light' : 'dark'}`}
            // laid out left-to-right, so advancing brings each in from the right
            style={{ left: `${i * 100}vw` }}
            ref={(el) => {
              beatRefs.current[i] = el;
            }}
          >
            {b.kind === 'opening' && (
              <>
                {/* The type is centred, and this hero runs bright through its
                    centre-right. These two pools of shade give the words a
                    ground without flattening the whole frame. */}
                <div className="beat-core" aria-hidden="true" />
                <div className="beat-foot" aria-hidden="true" />
                <div className="opening-centre">
                  <h1 className="wordmark">PROJECT 49</h1>
                  <p className="wordmark-sub">Seven ideas. One extraordinary home.</p>
                </div>
                <ul className="ideas">
                  {IDEAS.map((name, k) => (
                    <li key={name} className="idea" style={{ animationDelay: `${0.9 + k * 0.11}s` }}>
                      {name}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {b.kind === 'chapter' && (
              <div className="opening-centre">
                <p className="chapter-num">01 / LIGHT</p>
                <h2 className="chapter-title">A home that plays with light</h2>
                <p className="chapter-sub">Sunlight becomes building material.</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
