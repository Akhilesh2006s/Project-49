import { useEffect, useRef, useState } from 'react';
import chapters from './data/chapters';
import HOUSES, { COUNTS } from './data/houses';
import CONTACT from './data/contact';
import { Soundscape } from './sound';
import IdeaPreview from './IdeaPreview';
import Cinema from './Cinema';

const PROCESS = [
  ['01', 'Listen', 'One family, one brief. How you wake, cook, work, gather and rest — before a single line is drawn.'],
  ['02', 'Draw', 'The house is designed under one of the seven ideas. Orientation, openings, courtyards and material follow from it.'],
  ['03', 'Build', 'We build it ourselves, in Hyderabad, with the craftspeople and materials of the Deccan. Stone, earth, timber, lime.'],
  ['04', 'Hand over', 'You receive a finished house, not a shell. Then we go and design the next one, differently.'],
];

/* adds .in to every [data-reveal] element as it scrolls into view */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function Masthead({ sound, onSound, solid }) {
  return (
    <header className={'masthead ' + (solid ? 'is-solid' : '')}>
      <a className="brand" href="#home"><img src="/marks/elephant-160.png" alt="" /><span>PROJECT 49</span></a>
      <nav>
        <a href="#ideas">Seven ideas</a>
        <a href="#houses">The forty-nine</a>
        <a href="#build">How we build</a>
        <a href="#conversation">Conversation</a>
      </nav>
      <button className={'sound-toggle ' + (sound ? 'is-on' : '')} onClick={onSound} aria-pressed={sound}>
        <span className="equalizer"><i /><i /><i /><i /></span>Sound {sound ? 'on' : 'off'}
      </button>
    </header>
  );
}

function Opening() {
  return (
    <section className="opening" id="home">
      <img className="opening-image" src="/opening/hero.jpg" srcSet="/opening/hero-1280.jpg 1280w, /opening/hero.jpg 1920w" sizes="100vw"
        alt="Sunlight across a carved stone entrance and planted courtyard" fetchpriority="high" />
      <div className="opening-shade" />
      <div className="opening-copy">
        <p className="eyebrow">Forty-nine houses · Hyderabad</p>
        <h1>Forty-nine houses.<br /><em>None alike.</em></h1>
        <p className="opening-description">
          Seven architectural ideas. Seven houses designed and built on each.
          We are building them now, one family at a time, in Hyderabad.
        </p>
        <div className="opening-actions">
          <a className="enter-link" href="#ideas">The seven ideas <span>↗</span></a>
          <a className="enter-link quiet" href="#houses">See the forty-nine <span>↓</span></a>
        </div>
      </div>
      <div className="opening-bottom">
        <span>Designed &amp; built by Project 49</span>
        <a href="#equation">Scroll <i>↓</i></a>
        <span>7 × 7 = 49</span>
      </div>
    </section>
  );
}

function Equation() {
  return (
    <section className="equation" id="equation">
      <div className="equation-row" data-reveal>
        <div className="figure"><strong>7</strong><span>ideas</span></div>
        <div className="op">×</div>
        <div className="figure"><strong>7</strong><span>houses on each</span></div>
        <div className="op">=</div>
        <div className="figure"><strong>49</strong><span>houses, none repeated</span></div>
      </div>
      <div className="equation-copy" data-reveal>
        <p className="eyebrow">What Project 49 is</p>
        <h2>The idea repeats.<br /><em>The house never does.</em></h2>
        <p>
          Each of the seven ideas — light, air, art, roots, earth, silence, future — is a brief. Under
          every brief we design seven houses, each for a different family, on a different plot, with a
          different answer. Forty-nine houses. Not a gated community of copies; a body of work, built in one city.
        </p>
      </div>
    </section>
  );
}

function Ideas({ hover, setHover, enter, opened, visited }) {
  const c = chapters[hover];
  return (
    <section className="ideas-section" id="ideas">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">01 — The seven ideas</p>
        <h2>Seven ways <em>a house can think.</em></h2>
        <p>Every house under an idea is planned, built and lived in around it. Open one to walk through its films.</p>
      </div>
      <div className="ideas-composition">
        <div className="idea-preview" data-reveal>
          <IdeaPreview chapter={c} hidden={opened !== null} />
          <div className="preview-shade" />
          <span className="preview-number">{c.number}</span>
          <div className="preview-caption" key={c.id}>
            <p>{c.tags}</p>
            <h3>{c.title}</h3>
            <button onClick={() => enter(hover)}>Enter {c.id.toLowerCase()} <span>↗</span></button>
          </div>
        </div>
        <div className="idea-list" data-reveal>
          {chapters.map((ch, i) => (
            <button key={ch.id} className={'idea-row ' + (hover === i ? 'selected' : '')}
              onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => enter(i)}>
              <span className="idea-number">{ch.number}</span>
              <span className="idea-name">{ch.id.toLowerCase()}</span>
              <span className="idea-detail">{ch.title}</span>
              <span className="idea-arrow">{visited.includes(i) ? '◦' : '↗'}</span>
            </button>
          ))}
          <p className="list-note">Seven houses are designed under each idea. Each opens with its own film and sound.</p>
        </div>
      </div>
    </section>
  );
}

function FortyNine({ enter }) {
  const [active, setActive] = useState(null);
  const shown = active ?? HOUSES[0];
  return (
    <section className="houses" id="houses">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">02 — The forty-nine</p>
        <h2>One grid. <em>Forty-nine answers.</em></h2>
        <p>
          Seven rows, one for each idea. Seven houses in every row. The grid fills as houses are designed,
          built and handed over.
        </p>
      </div>
      <div className="houses-grid" data-reveal role="table" aria-label="The forty-nine houses, by idea">
        {chapters.map((ch, row) => (
          <div className="houses-row" role="row" key={ch.id}>
            <button className="houses-idea" onClick={() => enter(row)} role="rowheader">
              <span>{ch.number}</span><strong>{ch.id.toLowerCase()}</strong>
            </button>
            {HOUSES.filter(h => h.ideaIndex === row).map(h => (
              <div key={h.number} role="cell" tabIndex={0}
                className={'house ' + h.status.toLowerCase().replace(/\s+/g, '-') + (shown.number === h.number ? ' shown' : '')}
                onMouseEnter={() => setActive(h)} onFocus={() => setActive(h)} onMouseLeave={() => setActive(null)}>
                <span className="house-number">{h.label}</span>
                <i className="house-mark" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="houses-foot" data-reveal>
        <div className="houses-legend">
          <span><i className="in-design" />In design · {COUNTS['In design'] || 0}</span>
          <span><i className="under-construction" />Under construction · {COUNTS['Under construction'] || 0}</span>
          <span><i className="built" />Built · {COUNTS['Built'] || 0}</span>
        </div>
        <p className="houses-readout" aria-live="polite">
          <strong>House {shown.label}</strong> · {shown.idea.toLowerCase()} {shown.ordinal} of 7 · {shown.status}
        </p>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="process" id="build">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">03 — How we build</p>
        <h2 className="two-lines"><span>We are not building you a house.</span><br /><em>We are building where you belong.</em></h2>
        <p>A house is walls. A home is the years inside them. We design and build each one ourselves, for one family, so that it fits the life that will be lived in it.</p>
      </div>
      <ol className="process-steps">
        {PROCESS.map(([n, title, text]) => (
          <li key={n} data-reveal>
            <span className="step-number">{n}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      <div className="process-films" data-reveal>
        <figure><img src="/scenes/09-courtyard.jpg" alt="Rammed-earth walls around a planted courtyard" loading="lazy" /><figcaption>Rammed earth · EARTH</figcaption></figure>
        <figure><img src="/scenes/17-root-entrance.jpg" alt="A carved stone jali entrance in evening light" loading="lazy" /><figcaption>Carved threshold · ROOTS</figcaption></figure>
        <figure><img src="/scenes/02-day.jpg" alt="Daylight through slatted openings on a plaster wall" loading="lazy" /><figcaption>Openings · LIGHT</figcaption></figure>
      </div>
    </section>
  );
}

function Place() {
  return (
    <section className="place" id="city">
      <img src="/scenes/10-silence.jpg" alt="Hyderabad at night, seen from above" loading="lazy" />
      <div className="place-shade" />
      <div className="place-copy" data-reveal>
        <p className="eyebrow">04 — One city</p>
        <h2>Built in Hyderabad,<br /><em>in the language of the Deccan.</em></h2>
        <p>
          Granite that has sat here for two billion years. Courtyards that have cooled houses for centuries.
          Lime, stone, timber and shade. The forty-nine are built with what this land already knows.
        </p>
      </div>
    </section>
  );
}

function Conversation() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!CONTACT.enabled) return null;
  const wa = CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}` : null;
  const channel = CONTACT.endpoint || CONTACT.email;

  const submit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (CONTACT.endpoint) {
      setBusy(true);
      try {
        const r = await fetch(CONTACT.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error();
        setSent(true);
      } catch { alert('That did not go through. Please write to us directly instead.'); }
      setBusy(false);
    } else {
      const body = `Name: ${data.name}\nPhone / email: ${data.reach}\nIdea: ${data.idea}\n\n${data.message}`;
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Project 49 — a private conversation')}&body=${encodeURIComponent(body)}`;
      setSent(true);
    }
  };

  return (
    <section className="conversation" id="conversation">
      <div className="conversation-copy" data-reveal>
        <p className="eyebrow">{CONTACT.eyebrow}</p>
        <h2>{CONTACT.line}</h2>
        <p>{CONTACT.note}</p>
        <div className="private-links">
          {CONTACT.name && <span>{CONTACT.name}</span>}
          {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          {CONTACT.phone && <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>}
          {CONTACT.instagram && <a href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener noreferrer">@{CONTACT.instagram}</a>}
        </div>
      </div>
      <div className="conversation-form" data-reveal>
        {channel ? (
          sent ? (
            <p className="sent">Thank you. We will write back to you personally.</p>
          ) : (
            <form onSubmit={submit}>
              <label>Your name<input name="name" required autoComplete="name" /></label>
              <label>Phone or email<input name="reach" required autoComplete="tel" /></label>
              <label>An idea that stayed with you
                <select name="idea" defaultValue="">
                  <option value="">Not sure yet</option>
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.id.toLowerCase()} — {c.title}</option>)}
                </select>
              </label>
              <label>Anything you would like us to know<textarea name="message" rows="4" /></label>
              <button type="submit" className="enter-link" disabled={busy}>{busy ? 'Sending…' : 'Begin the conversation'} <span>↗</span></button>
            </form>
          )
        ) : (
          <p className="pending">The details for this conversation are being finalised. Until then, the films above say most of what we would.</p>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="collaboration">
      <div className="footer-grid">
        <div>
          <p className="eyebrow">In collaboration</p>
          <h2>Ayra <em>×</em> Anxa</h2>
          <p>Architecture &amp; digital experience.</p>
        </div>
        <nav className="footer-nav" aria-label="Sections">
          <a href="#ideas">Seven ideas</a>
          <a href="#houses">The forty-nine</a>
          <a href="#build">How we build</a>
          <a href="#city">Hyderabad</a>
          <a href="#conversation">A private conversation</a>
        </nav>
        <div className="footer-ideas" aria-hidden="true">
          {chapters.map(c => <span key={c.id}>{c.id.toLowerCase()}</span>)}
        </div>
      </div>
      {CONTACT.rera && <p className="rera-line">{CONTACT.rera}</p>}
      <div className="footer-end">
        <span>PROJECT 49 · HYDERABAD · {new Date().getFullYear()}</span>
        <a href="#home">Back to the beginning ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  const [hover, setHover] = useState(0), [opened, setOpened] = useState(null), [frame, setFrame] = useState(0);
  const [sound, setSound] = useState(false), [volume, setVolume] = useState(.5), [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0), [visited, setVisited] = useState([]), [muted, setMuted] = useState(false);
  const [solid, setSolid] = useState(false);
  const engine = useRef(null), trigger = useRef(null);
  const chapter = opened === null ? null : chapters[opened], scene = chapter?.scenes[frame];

  useReveal();
  useEffect(() => { engine.current = new Soundscape(); return () => engine.current.dispose(); }, []);
  useEffect(() => { if (sound) engine.current.scene(chapter?.id || 'HOME', scene?.id || ''); }, [sound, chapter, scene]);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const enable = async (idea, film) => {
    try {
      await engine.current.start(); engine.current.volume(volume);
      typeof idea === 'string' ? engine.current.scene(idea, film || '') : engine.current.scene(chapter?.id || 'HOME', scene?.id || '');
      setSound(true); setMuted(false);
    } catch { setSound(false); }
  };
  const toggleSound = () => { if (sound) { engine.current.suspend(); setSound(false); setMuted(true); } else enable(); };
  const enter = i => {
    if (opened === null) trigger.current = document.activeElement;
    setFrame(0); setProgress(0); setPaused(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setOpened(i); setHover(i); setVisited(v => [...new Set([...v, i])]);
    if (sound) { engine.current.start(); engine.current.scene(chapters[i].id, chapters[i].scenes[0]?.id || ''); }
    else if (!muted) enable(chapters[i].id, chapters[i].scenes[0]?.id);
  };
  const leave = () => { setOpened(null); if (sound) { engine.current.start(); engine.current.scene('HOME'); } requestAnimationFrame(() => trigger.current?.focus()); };
  const advance = () => { setProgress(0); setFrame(n => (n + 1) % chapter.scenes.length); if (sound && chapter.id === 'SILENCE') engine.current.scene('SILENCE'); };
  const back = () => { setProgress(0); setFrame(n => (n - 1 + chapter.scenes.length) % chapter.scenes.length); };
  const pause = () => { setPaused(!paused); if (sound) { if (!paused) engine.current.suspend(); else engine.current.start(); } };

  useEffect(() => { if (!chapter) return; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, [opened]);
  useEffect(() => {
    if (!scene || scene.video || paused) return;
    const start = Date.now(), timer = setInterval(() => { const p = (Date.now() - start) / 10000; setProgress(p); if (p >= 1) { clearInterval(timer); advance(); } }, 100);
    return () => clearInterval(timer);
  }, [scene, paused]);
  useEffect(() => {
    const visibility = () => { if (document.hidden) engine.current.suspend(); else if (sound && !paused) engine.current.start(); };
    document.addEventListener('visibilitychange', visibility); return () => document.removeEventListener('visibilitychange', visibility);
  }, [sound, paused]);

  return (
    <>
      <div className="site-shell" inert={chapter ? true : undefined}>
        <Masthead sound={sound} onSound={toggleSound} solid={solid} />
        <main>
          <Opening />
          <Equation />
          <Ideas hover={hover} setHover={setHover} enter={enter} opened={opened} visited={visited} />
          <FortyNine enter={enter} />
          <Process />
          <Place />
          <Conversation />
        </main>
        <Footer />
      </div>
      {chapter && (
        <Cinema chapter={chapter} scene={scene} frame={frame} opened={opened} paused={paused} progress={progress}
          sound={sound} volume={volume} setVolume={v => { setVolume(v); engine.current.volume(v); }}
          onProgress={setProgress} onAdvance={advance} onBack={back} onLeave={leave} onPause={pause}
          onSound={toggleSound} onEnable={enable} onSelect={i => { setFrame(i); setProgress(0); }} onNext={() => enter((opened + 1) % 7)} />
      )}
    </>
  );
}
