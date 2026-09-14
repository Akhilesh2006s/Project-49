import { useEffect, useRef, useState } from 'react';
import chapters from './data/chapters';
import HOUSES, { AVAILABLE, COLLECTION_STATUS, COUNTS, STATUSES, TAKEN } from './data/houses';
import CONTACT from './data/contact';
import PEOPLE from './data/people';
import { Soundscape } from './sound';
import IdeaPreview from './IdeaPreview';
import Cinema from './Cinema';

const JOURNEY = [
  ['Land', 'We study the site before we draw. Light, wind, trees, approach, views and neighbourhood become part of the brief.'],
  ['Family', 'We begin with the people: how you gather, work, retreat, celebrate and imagine the years ahead.'],
  ['Life', 'Daily rhythms become the brief. The house is organised around the way you live, not a standard plan.'],
  ['Architecture', 'One of seven ideas becomes a lens as Saketh and AYRA develop a singular response to family and land.'],
  ['Commission', 'The design, responsibilities, approvals, engineering, cost and programme are resolved into one clear undertaking.'],
  ['Build', 'ANXA leads construction, craftspeople, quality and communication from the first day on site.'],
  ['Completion', 'The finished residence enters the Project 49 archive with its identity, craft and architectural record intact.'],
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

function Masthead({ solid }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = e => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={'masthead ' + (solid ? 'is-solid' : '')}>
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
          <a href="#home" onClick={closeMenu}><span>01</span>Beginning</a>
          <a href="#ideas" onClick={closeMenu}><span>02</span>Seven ideas</a>
          <a href="#houses" onClick={closeMenu}><span>03</span>Forty-nine</a>
          <a href="#people" onClick={closeMenu}><span>04</span>The people</a>
          <a href="#journey" onClick={closeMenu}><span>05</span>The journey</a>
        </nav>
        <a className="menu-commission" href="#conversation" onClick={closeMenu}>Begin a private commission <span>↗</span></a>
        <p className="menu-location">Hyderabad, India</p>
      </aside>
    </>
  );
}

function Opening() {
  return (
    <section className="opening" id="home">
      <img className="opening-image" src="/opening/hero-courtyard.jpg" srcSet="/opening/hero-courtyard-1280.jpg 1280w, /opening/hero-courtyard.jpg 1672w" sizes="100vw"
        alt="Sunlight across a carved stone entrance and planted courtyard" fetchPriority="high" />
      <div className="opening-shade" />
      <div className="opening-copy">
        <p className="eyebrow">Project 49 · Hyderabad</p>
        <h1>Forty-nine private<br /><em>architectural commissions.</em></h1>
        <p className="opening-description">
          A finite collection of individually commissioned residences. Each shaped by one family, one piece of land
          and one way of living.
        </p>
        <div className="opening-actions">
          <a className="enter-link" href="#conversation">Begin a private commission <span>↗</span></a>
          <a className="enter-link quiet" href="#houses">View the collection <span>↓</span></a>
        </div>
      </div>
      <div className="opening-bottom">
        <span>A finite collection · Hyderabad</span>
        <a href="#gap">Scroll <i>↓</i></a>
        <span>The complete collection</span>
      </div>
    </section>
  );
}

function Gap() {
  return (
    <section className="gap" id="gap">
      <div className="gap-grid">
        <div data-reveal>
          <p className="eyebrow">01 / The proposition</p>
          <h2>Not forty-nine versions of one house.<br /><em>Forty-nine private architectural commissions.</em></h2>
        </div>
        <div className="gap-copy" data-reveal>
          <p>
            Each commission begins with a client, a piece of land and a way of living. The architecture is authored
            around that exact combination, so no two residences can become the same answer.
          </p>
          <p>
            Forty-nine is the complete body of work: seven architectural ideas explored through seven private
            commissions each. The limit is part of the idea, giving every place in the collection lasting meaning.
          </p>
          <p className="gap-answer">The collection is complete at forty-nine.</p>
        </div>
      </div>
    </section>
  );
}

function Commission() {
  return (
    <section className="commission" id="commission">
      <div className="commission-number" data-reveal>01 <span>client</span></div>
      <div className="commission-number" data-reveal>01 <span>piece of land</span></div>
      <div className="commission-number" data-reveal>01 <span>way of living</span></div>
      <div className="commission-copy" data-reveal>
        <p className="eyebrow">02 / What is a commission?</p>
        <h2>One family. One site.<br /><em>One architectural response.</em></h2>
        <p>No catalogue. No standard plan. No repeated house. A commission is a direct relationship between a family, its land and the architects responsible for giving both a distinct form.</p>
      </div>
    </section>
  );
}

function Equation() {
  return (
    <section className="equation" id="equation">
      <div className="equation-limit" data-reveal>
        <strong>49</strong><span>private commissions.<br />The collection ends here.</span>
      </div>
      <div className="equation-row" data-reveal>
        <div className="figure"><strong>7</strong><span>architectural ideas</span></div>
        <div className="op">×</div>
        <div className="figure"><strong>7</strong><span>commissions under each</span></div>
        <div className="op">=</div>
        <div className="figure"><strong>49</strong><span>the complete collection</span></div>
      </div>
      <div className="equation-copy" data-reveal>
        <p className="eyebrow">03 / Why 49?</p>
        <h2>The limit gives the collection<br /><em>its meaning.</em></h2>
        <p>
          Project 49 is intentionally limited. Seven private commissions will explore each architectural idea.
          The collection is defined before it begins: seven private commissions explore each of seven architectural ideas.
          Each place is used once. The philosophy may repeat. The architecture never does.
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
        <p className="eyebrow">04 / The seven ideas</p>
        <h2>The philosophy may repeat.<br /><em>The architecture never does.</em></h2>
        <p>
          Light, air, art, roots, earth, silence and future are architectural ideas, not designs to choose from.
          Each becomes a point of departure. The final home is an original response to its family, its land
          and the way they want to live.
        </p>
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
          <p className="list-note">Seven commissions explore each idea. Every answer is different. Enter an idea to experience its films and sound.</p>
        </div>
      </div>
    </section>
  );
}

function FortyNine({ enter }) {
  const [active, setActive] = useState(null);
  const shown = active ?? HOUSES[0];
  const slug = s => s.toLowerCase().replace(/\s+/g, '-');
  return (
    <section className="houses" id="houses">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">05 / The collection</p>
        <h2>Forty-nine identities.<br /><em>Each used once.</em></h2>
        <p>
          Seven commissions sit under each of seven ideas. Each receives a permanent identity such as LIGHT 01 or
          EARTH 04, and its status is carried into the architectural record.
        </p>
      </div>
      <div className="houses-grid" data-reveal role="table" aria-label="The forty-nine commissions, by idea">
        {chapters.map((ch, row) => (
          <div className="houses-row" role="row" key={ch.id}>
            <button className="houses-idea" onClick={() => enter(row)} role="rowheader">
              <span>{ch.number}</span><strong>{ch.id.toLowerCase()}</strong>
            </button>
            {HOUSES.filter(h => h.ideaIndex === row).map(h => (
              <div key={h.number} role="cell" tabIndex={0}
                className={'house ' + slug(h.status) + (shown.number === h.number ? ' shown' : '')}
                aria-label={`${h.commission_id}, ${h.status}`}
                onMouseEnter={() => setActive(h)} onFocus={() => setActive(h)} onMouseLeave={() => setActive(null)}>
                <span className="house-number">{String(h.ordinal).padStart(2, '0')}</span>
                <i className="house-mark" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="houses-foot" data-reveal>
        <div className="houses-legend">
          {STATUSES.map(s => <span key={s}><i className={slug(s)} />{s} · {COUNTS[s] || 0}</span>)}
        </div>
        <p className="houses-readout" aria-live="polite">
          <strong>{shown.commission_id}</strong> · Project 49 · {shown.status}
        </p>
        <p className="collection-count">{TAKEN} taken · {AVAILABLE} remaining · Collection {COLLECTION_STATUS.toLowerCase()}</p>
      </div>
    </section>
  );
}

function Person({ p }) {
  return (
    <article className="person" data-reveal>
      <div className="person-portrait">
        {p.photo ? <img src={p.photo} alt={p.name} loading="lazy" /> : <span aria-hidden="true">{p.name[0]}</span>}
      </div>
      <div className="person-body">
        <p className="eyebrow">{p.studio} · {p.role}</p>
        <h3>{p.name}</h3>
        <blockquote>{p.quote}</blockquote>
      </div>
    </article>
  );
}

function People() {
  return (
    <section className="people" id="people">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">06 / The people</p>
        <h2>Architecture with an author.<br /><em>Delivery with an owner.</em></h2>
        <p>
          Project 49 brings two responsibilities together without confusing them. Saketh and AYRA lead
          the architectural vision. Divya and ANXA take responsibility for making it real.
        </p>
      </div>
      <div className="people-grid">
        {PEOPLE.map(p => <Person key={p.id} p={p} />)}
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="journey" id="journey">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">07 / The journey</p>
        <h2 className="two-lines"><span>From a piece of land</span><br /><em>to a completed work.</em></h2>
        <p>
          Seven clear stages make the responsibilities visible while preserving what matters: a home authored
          around the family rather than selected from a catalogue.
        </p>
      </div>
      <ol className="journey-steps">
        {JOURNEY.map(([title, text], i) => (
          <li key={title} data-reveal>
            <span className="step-number">{String(i + 1).padStart(2, '0')}</span>
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

function Record() {
  const records = ['Drawings', 'Materials', 'Craft', 'Photography', 'Film', 'Provenance', 'Documentation'];
  return (
    <section className="record" id="record">
      <div className="record-copy" data-reveal>
        <p className="eyebrow">08 / The architectural record</p>
        <h2>The house is completed.<br /><em>Its record continues.</em></h2>
        <p>Each commission becomes part of a permanent architectural archive: the thinking, making and evidence of a one-of-one residence, documented without compromising private family information.</p>
      </div>
      <ol className="record-list" data-reveal>{records.map((record, i) => <li key={record}><span>{String(i + 1).padStart(2, '0')}</span>{record}</li>)}</ol>
    </section>
  );
}

function Place() {
  return (
    <section className="place" id="city">
      <img src="/scenes/10-silence.jpg" alt="Hyderabad at night, seen from above" loading="lazy" />
      <div className="place-shade" />
      <div className="place-copy" data-reveal>
        <p className="eyebrow">09 / One city</p>
        <h2>Built in Hyderabad.<br /><em>Shaped by the Deccan.</em></h2>
        <p>
          We do not import a style and place it on the land. We work with Hyderabad's sun, monsoon and stone,
          and with the Deccan traditions of courtyards, shade, lime, earth and craft. The result is contemporary
          architecture that could belong here, and nowhere else.
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
      const body = `Name: ${data.name}\nPhone / email: ${data.reach}\nLand: ${data.land}\nLocation: ${data.location}\nFamily: ${data.family}\nWay of living: ${data.life}\nArchitectural interest: ${data.idea}\n\n${data.message}`;
      location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Project 49: private commission enquiry')}&body=${encodeURIComponent(body)}`;
      setSent(true);
    }
  };

  return (
    <section className="conversation" id="conversation">
      <div className="conversation-copy" data-reveal>
        <p className="eyebrow">10 / {CONTACT.eyebrow}</p>
        <h2>{CONTACT.line}</h2>
        <p>{CONTACT.note}</p>
        <p className="closing-thought">
          The first conversation is not a sales call. It is a chance to understand the life, land and ambition
          behind the home you want to make. This is where a private commission begins.
        </p>
        <div className="private-links">
          {CONTACT.name && <span>{CONTACT.name}</span>}
          {CONTACT.email && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer">Start a conversation on WhatsApp</a>}
          {CONTACT.phone && <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>}
          {CONTACT.instagram && <a href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener noreferrer">@{CONTACT.instagram}</a>}
        </div>
      </div>
      <div className="conversation-form" data-reveal>
        {channel ? (
          sent ? (
            <p className="sent">Thank you. We will write back to you personally, within a day.</p>
          ) : (
            <form onSubmit={submit}>
              <label>Your name<input name="name" required autoComplete="name" /></label>
              <label>Phone or email<input name="reach" required autoComplete="tel" /></label>
              <label>Do you have land in mind?
                <select name="land" defaultValue="">
                  <option value="">Not yet</option>
                  <option value="own">Yes, we own a plot</option>
                  <option value="looking">We are looking</option>
                </select>
              </label>
              <label>Land location<input name="location" autoComplete="address-level2" /></label>
              <label>About your family<textarea name="family" rows="3" /></label>
              <label>The way you want to live<textarea name="life" rows="3" /></label>
              <label>An architectural interest
                <select name="idea" defaultValue="">
                  <option value="">Not sure yet</option>
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.id.toLowerCase()} · {c.title}</option>)}
                </select>
              </label>
              <label>Anything you would like us to know<textarea name="message" rows="4" /></label>
              <button type="submit" className="enter-link" disabled={busy}>{busy ? 'Sending…' : 'Request a private commission'} <span>↗</span></button>
            </form>
          )
        ) : (
          <p className="pending">Private commission enquiries will open shortly. Until then, the collection and its seven ideas offer a first sense of how we think.</p>
        )}
      </div>
    </section>
  );
}

function Finality() {
  return (
    <section className={'finality ' + (COLLECTION_STATUS === 'CLOSED' ? 'is-closed' : '')} id="finality">
      <p className="eyebrow" data-reveal>11 / The finite collection</p>
      <div className="finality-count" data-reveal>{COLLECTION_STATUS === 'CLOSED' ? '49 / 49' : '49'}</div>
      <p className="finality-label" data-reveal>{COLLECTION_STATUS === 'CLOSED' ? 'The collection is complete.' : 'Private architectural commissions.'}</p>
      <h2 data-reveal>{COLLECTION_STATUS === 'CLOSED' ? 'The collection is complete.' : 'A finite body of architecture.'}<br /><em>Every commission entirely its own.</em></h2>
    </section>
  );
}

function Footer() {
  return (
    <footer id="collaboration">
      <div className="footer-grid">
        <div>
          <p className="eyebrow">Architecture × Delivery</p>
          <h2>AYRA <em>×</em> ANXA</h2>
          <p>Saketh leads the architecture. Divya leads its delivery. Forty-nine one-of-one residences in Hyderabad.</p>
        </div>
        <nav className="footer-nav" aria-label="Sections">
          <a href="#gap">Why we exist</a>
          <a href="#ideas">Seven ideas</a>
          <a href="#houses">Forty-nine commissions</a>
          <a href="#people">The people</a>
          <a href="#journey">The journey</a>
          <a href="#record">The architectural record</a>
          <a href="#conversation">Begin a private commission</a>
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
        <Masthead solid={solid} />
        <main>
          <Opening />
          <Gap />
          <Commission />
          <Equation />
          <Ideas hover={hover} setHover={setHover} enter={enter} opened={opened} visited={visited} />
          <FortyNine enter={enter} />
          <People />
          <Journey />
          <Record />
          <Place />
          <Conversation />
          <Finality />
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
