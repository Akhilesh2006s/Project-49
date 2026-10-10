import { useEffect, useRef, useState } from 'react';

/* Project 49 world: the interactive layer of the site.
   Threshold (doors that open as you scroll), a brass cursor, a progress rail,
   scroll-lit statements, the delivery path and the closing count. */

const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 0..1 progress of an element through the viewport (sticky scenes) */
function useSceneProgress(ref) {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    let queued = false;
    const draw = () => {
      queued = false;
      const el = ref.current; if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setP(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : (r.top < 0 ? 1 : 0));
    };
    const on = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
    draw();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, [ref]);
  return p;
}

/* The way in: two plaster doors part as you scroll and the home appears behind them. */
export function Threshold({ children }) {
  const ref = useRef(null);
  const p = useSceneProgress(ref);
  const still = reduce();
  const open = still ? 1 : Math.min(1, p / 0.7);
  const ease = 1 - Math.pow(1 - open, 3);
  return (
    <section className={'threshold' + (still ? ' is-still' : '')} ref={ref} id="home" aria-label="Enter Project 49">
      <div className="threshold-stage" style={{ '--open': ease.toFixed(4), '--p': p.toFixed(4) }}>
        {children}
        {!still && (
          <div className="doors" aria-hidden="true" style={{ visibility: ease >= 0.999 ? 'hidden' : 'visible' }}>
            <div className="door door-l"><span className="door-word">PROJECT</span></div>
            <div className="door door-r"><span className="door-word">49</span></div>
            <div className="door-light" />
            <p className="door-cue">Step inside <i>↓</i></p>
          </div>
        )}
      </div>
    </section>
  );
}

/* A large statement whose words light up one by one as it passes through the screen. */
export function LitStatement({ id, eyebrow, lines, note }) {
  const ref = useRef(null);
  const p = useSceneProgress(ref);
  const words = lines.flatMap((l, li) => l.split(' ').map((w, wi) => ({ w, li, key: li + '-' + wi })));
  const lit = reduce() ? words.length : Math.round(Math.min(1, p / 0.8) * words.length);
  let n = 0;
  return (
    <section className="lit" id={id} ref={ref}>
      <div className="lit-stage">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="lit-text">
          {lines.map((l, li) => (
            <span className={'lit-line' + (li ? ' is-second' : '')} key={li}>
              {l.split(' ').map((w, wi) => { const on = n++ < lit; return <span key={wi} className={'lit-w' + (on ? ' on' : '')}>{w} </span>; })}
            </span>
          ))}
        </h2>
        {note && <p className="lit-note" style={{ opacity: lit >= words.length ? 1 : 0 }}>{note}</p>}
      </div>
    </section>
  );
}

const STEPS = [
  { t: 'Walk the land', d: 'We visit your plot with you: the light, the trees, the way the ground falls.' },
  { t: 'Choose your philosophy', d: 'One of seven design philosophies becomes the starting point for your home.' },
  { t: 'Design, settled upfront', d: 'Plans, materials and costs agreed before the first brick. Fewer late changes.' },
  { t: 'Build, one point of contact', d: 'Design, approvals, construction and finishing. We take care of everything, and you speak to one person throughout.' },
  { t: 'Move in', d: 'A predictable path to the day you get the keys.' },
];

/* Bespoke does not have to mean slow: the path drawn in brass as you scroll. */
export function Delivery() {
  const ref = useRef(null);
  const p = useSceneProgress(ref);
  const prog = reduce() ? 1 : Math.min(1, Math.max(0, (p - 0.08) / 0.8));
  const active = Math.min(STEPS.length - 1, Math.floor(prog * STEPS.length));
  return (
    <section className="delivery" id="delivery" ref={ref} aria-labelledby="delivery-h">
      <div className="delivery-stage">
        <div className="delivery-head">
          <p className="eyebrow">How we work</p>
          <h2 id="delivery-h">Bespoke does not have to mean slow.</h2>
          <p>Clarity upfront, fewer late changes, and a more predictable path to move-in.</p>
        </div>
        <ol className="path" style={{ '--prog': prog.toFixed(4) }}>
          <span className="path-line" aria-hidden="true"><i /></span>
          {STEPS.map((s, i) => (
            <li key={s.t} className={i <= active ? 'on' : ''}>
              <span className="path-dot" aria-hidden="true" />
              <span className="path-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 49 homes. 7 ideas. No repetition. — the numbers count up once, the line settles. */
export function Scarcity() {
  const ref = useRef(null);
  const [n, setN] = useState(reduce() ? [49, 7] : [0, 0]);
  useEffect(() => {
    if (reduce() || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = now => {
        const k = Math.min(1, (now - t0) / 1800), q = 1 - Math.pow(1 - k, 3);
        setN([Math.round(49 * q), Math.round(7 * q)]);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <section className="scarcity" ref={ref} aria-label="49 homes. 7 ideas. No repetition.">
      <div className="scarcity-row" aria-hidden="true">
        <div><strong>{n[0]}</strong><span>homes</span></div>
        <div><strong>{n[1]}</strong><span>ideas</span></div>
        <div><strong>0</strong><span>repetition</span></div>
      </div>
      <p className="scarcity-line">49 homes. 7 ideas. No repetition.</p>
    </section>
  );
}

/* A thin brass line across the top and a rail of the chapters down the right side. */
const RAIL = [['home', 'Enter'], ['idea', 'The idea'], ['belief', 'Belief'], ['ideas', 'Design philosophies'], ['delivery', 'How we work'], ['places', 'Where we build'], ['people', 'The people'], ['conversation', 'Talk to us']];
export function Rail() {
  const [pct, setPct] = useState(0), [cur, setCur] = useState('home');
  useEffect(() => {
    let queued = false;
    const draw = () => {
      queued = false;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? window.scrollY / h : 0);
      let c = 'home';
      for (const [id] of RAIL) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) c = id; }
      setCur(c);
    };
    const on = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
    draw(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <div className="progress-line" style={{ transform: `scaleX(${pct.toFixed(4)})` }} aria-hidden="true" />
      <nav className="rail" aria-label="Chapters">
        {RAIL.map(([id, label], i) => (
          <a key={id} href={'#' + id} className={cur === id ? 'on' : ''} data-cursor="Go">
            <span className="rail-label">{label}</span>
            <span className="rail-tick" aria-hidden="true" />
            <span className="visually-hidden">{String(i).padStart(2, '0')}</span>
          </a>
        ))}
      </nav>
    </>
  );
}

/* A brass ring that follows the pointer, grows over anything you can open and names it. */
export function Cursor() {
  const ring = useRef(null), dot = useRef(null), [label, setLabel] = useState(''), [on, setOn] = useState(false);
  useEffect(() => {
    if (reduce() || !window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf;
    const move = e => {
      x = e.clientX; y = e.clientY;
      document.documentElement.classList.add('cursor-moved');
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const t = e.target.closest && e.target.closest('a, button, [data-cursor], select, input, textarea, label');
      setOn(!!t);
      setLabel(t ? (t.getAttribute('data-cursor') || '') : '');
      const mag = e.target.closest && e.target.closest('.enter-link, .btn-solid, .preview-caption button');
      document.querySelectorAll('.is-magnet').forEach(el => { if (el !== mag) { el.classList.remove('is-magnet'); el.style.transform = ''; } });
      if (mag) {
        const r = mag.getBoundingClientRect();
        const dx = (x - (r.left + r.width / 2)) * 0.18, dy = (y - (r.top + r.height / 2)) * 0.25;
        mag.classList.add('is-magnet'); mag.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    };
    const loop = () => { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`; raf = requestAnimationFrame(loop); };
    const leave = () => { if (ring.current) ring.current.style.opacity = 0; if (dot.current) dot.current.style.opacity = 0; };
    const enter = () => { if (ring.current) ring.current.style.opacity = ''; if (dot.current) dot.current.style.opacity = ''; };
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave); document.addEventListener('mouseenter', enter);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave); document.removeEventListener('mouseenter', enter); document.documentElement.classList.remove('has-cursor'); };
  }, []);
  return (
    <div className="cursor-layer" aria-hidden="true">
      <div className={'cursor-ring' + (on ? ' on' : '') + (label ? ' labelled' : '')} ref={ring}><span>{label}</span></div>
      <div className="cursor-dot" ref={dot} />
    </div>
  );
}
