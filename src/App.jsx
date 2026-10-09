import { useEffect, useRef, useState } from 'react';
import chapters from './data/chapters';
import CONTACT from './data/contact';
import PLACES from './data/places';
import { Soundscape } from './sound';
import IdeaPreview from './IdeaPreview';
import Cinema from './Cinema';
import IntroFilm from './intro/IntroFilm';

/* LIGHT -> Light */
const ideaName = id => id.charAt(0) + id.slice(1).toLowerCase();

/* Splits a heading into lines that rise out of a mask, one after another. */
function splitLines(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const html = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = html.map((line, i) => `<span class="ln" style="--d:${i * 90}ms"><i>${line}</i></span>`).join('');
}

/* One scroll loop for the whole page: gives [data-parallax] elements a slow drift. */
function useParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = [...document.querySelectorAll('[data-parallax]')];
    if (!els.length) return;
    let queued = false;
    const draw = () => {
      queued = false;
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        const centre = (r.top + r.height / 2 - vh / 2) / vh;      // -1 … 1
        el.style.setProperty('--py', `${(centre * (Number(el.dataset.parallax) || 6)).toFixed(2)}%`);
      }
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
    draw();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
}

/* adds .in to every [data-reveal] element as it scrolls into view */
function useReveal() {
  useEffect(() => {
    document.querySelectorAll('[data-lines]').forEach(splitLines);
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { threshold: 0.04, rootMargin: '0px 0px 6% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, []);
}

function Masthead({ solid, hidden }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = e => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={'masthead ' + (solid ? 'is-solid' : '') + (hidden && !menuOpen ? ' is-hidden' : '')}>
        <a className="brand" href="#home"><img src="/marks/elephant-160.png" alt="" /><span>PROJECT 49</span></a>
        <button className={'menu-toggle ' + (menuOpen ? 'is-open' : '')} onClick={() => setMenuOpen(v => !v)}
          aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          <i /><i /><i />
        </button>
      </header>
      <button className={'menu-backdrop ' + (menuOpen ? 'is-open' : '')} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1} aria-label="Close menu" />
      <aside className={'site-menu ' + (menuOpen ? 'is-open' : '')} id="site-menu" aria-hidden={!menuOpen}>
        <button className="menu-close" onClick={closeMenu} aria-label="Close menu"><i /><i /></button>
        <p className="eyebrow">Project 49 · Hyderabad</p>
        <nav aria-label="Menu">
          <a href="#idea" onClick={closeMenu}><span>01</span>The idea</a>
          <a href="#ideas" onClick={closeMenu}><span>02</span>Seven ideas</a>
          <a href="#places" onClick={closeMenu}><span>03</span>Where we build</a>
          <a href="#people" onClick={closeMenu}><span>04</span>The people</a>
          <a href="#conversation" onClick={closeMenu}><span>05</span>Talk to us</a>
        </nav>
        <a className="menu-commission" href="#conversation" onClick={closeMenu}>Start a conversation <span>↗</span></a>
        <p className="menu-location">Hyderabad, India</p>
      </aside>
    </>
  );
}

function Opening() {
  return (
    <section className="opening" id="home">
      <img className="opening-image" data-parallax="7" src="/opening/hero-courtyard.jpg" srcSet="/opening/hero-courtyard-1280.jpg 1280w, /opening/hero-courtyard.jpg 1672w" sizes="100vw"
        alt="Sunlight across a carved stone entrance and planted courtyard" fetchPriority="high" />
      <div className="opening-shade" />
      <div className="opening-copy">
        <p className="eyebrow">Project 49 · Hyderabad</p>
        <h1 data-lines>One city. A million ways to live.<br /><em>Different lives deserve different homes.</em></h1>
        <p className="opening-description">
          Bring your land. Choose the idea your home grows from. We design it and build it, start to finish.
        </p>
        <p className="opening-neuro">Forty-nine homes in Hyderabad. Then we stop.</p>
        <div className="opening-actions">
          <a className="enter-link" href="#idea">How it works <span>↓</span></a>
          <a className="enter-link quiet" href="#conversation">Tell us about your land <span>↗</span></a>
        </div>
      </div>
      <div className="opening-bottom">
        <span>Seven ideas · Forty-nine homes</span>
        <a href="#idea">Scroll <i>↓</i></a>
        <span>Hyderabad</span>
      </div>
    </section>
  );
}

function Idea() {
  return (
    <section className="gap" id="idea">
      <div className="gap-grid">
        <div data-reveal>
          <p className="eyebrow">01 / The idea</p>
          <h2 data-lines>Your land. Your way of living.<br /><em>Crafted by us.</em></h2>
        </div>
        <div className="gap-copy" data-reveal>
          <p>Every Project 49 home begins with your land and the way your family lives. You choose the design it grows from; we shape it, build it and hand you the keys.</p>
          <p>Seven ideas. Forty-nine homes in all. Then we stop, so every one of them stays one of one.</p>
          <p className="gap-answer">Forty-nine homes. Forty-nine stories.</p>
          <ol className="gap-steps">
            <li><span>01</span>Your land</li>
            <li><span>02</span>Your design</li>
            <li><span>03</span>Your home</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

function Ideas({ hover, setHover, enter, opened, visited }) {
  const c = chapters[hover];
  return (
    <section className="ideas-section" id="ideas">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">02 / The seven ideas</p>
        <h2 data-lines>Seven ways to build.<br /><em>Which one is yours?</em></h2>
        <p>Each idea is a way of thinking about a house, not a fixed plan. Your home is drawn fresh for your land and your family.</p>
      </div>
      <div className="ideas-composition">
        <div className="idea-preview" data-reveal>
          <IdeaPreview chapter={c} hidden={opened !== null} />
          <div className="preview-shade" />
          <span className="preview-number">{c.number}</span>
          <div className="preview-caption" key={c.id}>
            <p>{c.tags}</p>
            <p className="preview-whisper">{c.whisper}</p>
            <h3>{c.title}</h3>
            <button onClick={() => enter(hover)}>Enter {ideaName(c.id)} <span>↗</span></button>
          </div>
        </div>
        <div className="idea-list" data-reveal>
          {chapters.map((ch, i) => (
            <button key={ch.id} className={'idea-row ' + (hover === i ? 'selected' : '')}
              onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} onClick={() => enter(i)}>
              <span className="idea-number">{ch.number}</span>
              <span className="idea-name">{ideaName(ch.id)}</span>
              <span className="idea-detail">{ch.title}</span>
              <span className="idea-arrow">{visited.includes(i) ? '◦' : '↗'}</span>
            </button>
          ))}
          <p className="list-note">Every home is drawn fresh for its land and its family. Enter an idea to see it in film.</p>
        </div>
      </div>
    </section>
  );
}

function Places() {
  const ref = useRef(null);
  useEffect(() => {
    const L = window.L;
    if (!ref.current || !L || PLACES.video) return;
    const map = L.map(ref.current, { center: PLACES.center, zoom: PLACES.zoom, zoomSnap: 0, zoomControl: false, scrollWheelZoom: false, attributionControl: false, dragging: !L.Browser.mobile });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(map);
    PLACES.pins.forEach(p => {
      L.marker([p.lat, p.lng], { icon: L.divIcon({ className: 'pin', html: `<i></i><b>${p.name}</b>`, iconSize: [0, 0] }) })
        .addTo(map).on('click', () => map.flyTo([p.lat, p.lng], 16, { duration: 1.6 }));
    });
    map.on('click', () => map.flyTo(PLACES.center, PLACES.zoom, { duration: 1.4 }));
    ref.current._map = map;
    return () => map.remove();
  }, []);
  return (
    <section className="places" id="places">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">03 / Where we build</p>
        <h2 data-lines>Hyderabad,<br /><em>seen from above.</em></h2>
        <p>On the green western edge of the city, where there is still room for a garden and a tree. Tap a place to see it up close. Have land somewhere else? Tell us; we will come and look.</p>
      </div>
      <div className="places-map" data-reveal data-parallax="4">
        {PLACES.video
          ? <video src={PLACES.video} poster={PLACES.poster} autoPlay muted loop playsInline />
          : <div ref={ref} className="places-canvas" aria-label="Satellite map of Hyderabad with the Project 49 locations" />}
        <div className="places-tint" />
      </div>
      <ul className="places-list" data-reveal>
        {PLACES.pins.map(p => <li key={p.name}><strong>{p.name}</strong><span>{p.note}</span></li>)}
      </ul>
    </section>
  );
}

function People() {
  return (
    <section className="credits" id="people">
      <p className="eyebrow" data-reveal>04 / The people</p>
      <div className="credits-row" data-reveal>
        <div className="credit">
          <span className="credit-studio">AYRA</span>
          <strong>Saketh</strong>
          <em>Architect</em>
          <p>Designs your home.</p>
        </div>
        <div className="credit-x" aria-hidden="true">×</div>
        <div className="credit">
          <span className="credit-studio">ANXA</span>
          <strong>Divya</strong>
          <em>Builder</em>
          <p>Your one point of contact, start to finish.</p>
        </div>
      </div>
      <p className="credits-note" data-reveal>Two people. One home. From the first sketch to the keys.</p>
    </section>
  );
}

function Conversation() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!CONTACT.enabled) return null;
  const wa = CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, '')}` : null;
  const channel = CONTACT.endpoint || CONTACT.email || wa;

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
    } else if (!CONTACT.email && wa) {
      const ideaLine = data.idea ? `The idea I like: ${data.idea}` : 'Not sure which idea yet';
      const landLine = data.land === 'own' ? 'I own a plot' : data.land === 'looking' ? 'I am looking for land' : 'No land yet';
      const text = `Hello Project 49,\n\nI am ${data.name}.\n${landLine}${data.location ? ` in ${data.location}` : ''}.\n${ideaLine}.${data.message ? `\n\n${data.message}` : ''}\n\nYou can reach me on ${data.reach}.`;
      window.open(`${wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      setSent(true);
    } else {
      const body = `Name: ${data.name}\nPhone / email: ${data.reach}\nLand: ${data.land}\nLocation: ${data.location}\nIdea: ${data.idea}\n\n${data.message}`;
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Project 49: my land')}&body=${encodeURIComponent(body)}`;
      setSent(true);
    }
  };

  return (
    <section className="conversation" id="conversation">
      <div className="conversation-copy" data-reveal>
        <p className="eyebrow">05 / {CONTACT.eyebrow}</p>
        <h2 data-lines>{CONTACT.line}</h2>
        <p>{CONTACT.note}</p>
        <div className="private-links">
          {CONTACT.name && <span>{CONTACT.name}</span>}
          {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
          {wa && (CONTACT.endpoint || CONTACT.email) && <a href={wa} target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a>}
          {CONTACT.phone && <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>}
          {CONTACT.instagram && <a href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener noreferrer">@{CONTACT.instagram}</a>}
        </div>
      </div>
      <div className="conversation-form" data-reveal>
        {channel ? (
          sent ? (
            <p className="sent">Thank you. {CONTACT.endpoint || CONTACT.email ? 'We will call you back within a day.' : 'Your message is ready in WhatsApp; press send and we will call you back within a day.'}</p>
          ) : (
            <form onSubmit={submit}>
              <label>Your name<input name="name" required autoComplete="name" /></label>
              <label>Phone or email<input name="reach" required autoComplete="tel" /></label>
              <label>Do you have land?
                <select name="land" defaultValue="">
                  <option value="">Not yet</option>
                  <option value="own">Yes, I own a plot</option>
                  <option value="looking">I am looking</option>
                </select>
              </label>
              <label>Where is it?<input name="location" autoComplete="address-level2" /></label>
              <label>An idea you like
                <select name="idea" defaultValue="">
                  <option value="">Not sure yet</option>
                  {chapters.map(c => <option key={c.id} value={c.id}>{ideaName(c.id)} · {c.title}</option>)}
                </select>
              </label>
              <label>Anything else<textarea name="message" rows="3" /></label>
              <button type="submit" className="enter-link" disabled={busy}>{busy ? 'Sending…' : (CONTACT.endpoint || CONTACT.email ? 'Start a conversation' : 'Send on WhatsApp')} <span>↗</span></button>
              {!CONTACT.endpoint && !CONTACT.email && wa && <small className="form-alt">Or message us directly on <a href={wa} target="_blank" rel="noopener noreferrer">{CONTACT.whatsapp}</a></small>}
            </form>
          )
        ) : (
          wa
            ? <div className="whatsapp-in"><a className="enter-link" href={wa} target="_blank" rel="noopener noreferrer">Message us on WhatsApp <span>↗</span></a><small>{CONTACT.whatsapp}</small></div>
            : <p className="pending">Enquiries open shortly. Until then, the seven ideas are the best way to get a feel for how we build.</p>
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
          <p className="eyebrow">Design × Build</p>
          <h2 data-lines>AYRA <em>×</em> ANXA</h2>
        </div>
        <nav className="footer-nav" aria-label="Sections">
          <a href="#idea">The idea</a>
          <a href="#ideas">Seven ideas</a>
          <a href="#places">Where we build</a>
          <a href="#people">The people</a>
          <a href="#conversation">Start a conversation</a>
        </nav>
        <div className="footer-ideas" aria-hidden="true">
          {chapters.map(c => <span key={c.id}>{ideaName(c.id)}</span>)}
        </div>
      </div>
      {CONTACT.rera && <p className="rera-line">{CONTACT.rera}</p>}
      <div className="footer-end">
        <span>PROJECT 49 · HYDERABAD · {new Date().getFullYear()}</span>
        <a href="#home">Back to the top ↑</a>
      </div>
    </footer>
  );
}

export default function App() {
  const [hover, setHover] = useState(0), [opened, setOpened] = useState(null), [frame, setFrame] = useState(0);
  const [sound, setSound] = useState(false), [volume, setVolume] = useState(.5), [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0), [visited, setVisited] = useState([]), [muted, setMuted] = useState(false);
  const [solid, setSolid] = useState(false), [hideBar, setHideBar] = useState(false);
  const engine = useRef(null), trigger = useRef(null);
  const chapter = opened === null ? null : chapters[opened], scene = chapter?.scenes[frame];

  useReveal();
  useParallax();
  useEffect(() => { engine.current = new Soundscape(); return () => engine.current.dispose(); }, []);
  useEffect(() => { if (sound) engine.current.scene(chapter?.id || 'HOME', scene?.id || ''); }, [sound, chapter, scene]);
  useEffect(() => {
    /* Clear over the hero; solid once the hero has gone; tucks away while you read
       downwards and comes back the moment you scroll up. */
    let last = window.scrollY, queued = false;
    const draw = () => {
      queued = false;
      const y = window.scrollY, hero = document.getElementById('home');
      const heroEnd = hero ? hero.offsetTop + hero.offsetHeight - 90 : window.innerHeight;
      setSolid(y > heroEnd);
      if (Math.abs(y - last) > 6) { setHideBar(y > last && y > heroEnd - window.innerHeight * 0.6); last = y; }
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
    draw(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const enable = async (idea, film) => {
    try {
      await engine.current.start(); engine.current.volume(volume);
      typeof idea === 'string' ? engine.current.scene(idea, film || '') : engine.current.scene(chapter?.id || 'HOME', scene?.id || '');
      if (typeof idea === 'string' && idea !== 'HOME') { engine.current.sting(idea); engine.current.theme(idea); }
      if (idea === 'HOME') engine.current.theme(null);
      setSound(true); setMuted(false);
    } catch { setSound(false); }
  };
  const toggleSound = () => { if (sound) { engine.current.suspend(); setSound(false); setMuted(true); } else enable(); };
  const enter = i => {
    if (opened === null) trigger.current = document.activeElement;
    setFrame(0); setProgress(0); setPaused(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setOpened(i); setHover(i); setVisited(v => [...new Set([...v, i])]);
    if (sound) { engine.current.start(); engine.current.sting(chapters[i].id); engine.current.theme(chapters[i].id); engine.current.scene(chapters[i].id, chapters[i].scenes[0]?.id || ''); }
    else if (!muted) enable(chapters[i].id, chapters[i].scenes[0]?.id);
  };
  const leave = () => { setOpened(null); if (sound) { engine.current.start(); engine.current.theme(null); engine.current.scene('HOME'); } requestAnimationFrame(() => trigger.current?.focus()); };
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
        <Masthead solid={solid} hidden={hideBar} />
        <main>
          <IntroFilm onEnterIdea={enter} />
          <Opening />
          <Idea />
          <Ideas hover={hover} setHover={setHover} enter={enter} opened={opened} visited={visited} />
          <Places />
          <People />
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
