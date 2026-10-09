import { CSSProperties, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { audio } from '../audio/AudioEngine';
import { useAudioZone } from '../audio/useAudioZone';
import ArtMedia from '../components/ArtMedia';
import LightField from '../components/LightField';
import Particles from '../components/Particles';
import { DIALOGUES, DialogueId, dialogue } from '../data/dialogues';
import { isClosed } from '../data/collection';
import { useMotion } from '../hooks/motion';
import { useInView } from '../hooks/scroll';

/**
 * Part 18. Seven words in one dark space. No cards.
 * Hover or focus lets each word act on the space the way its dialogue does;
 * Enter or click walks into it.
 */
const PLACE: Record<DialogueId, { x: number; y: number; s: number }> = {
  LIGHT: { x: 7, y: 16, s: 1.05 }, AIR: { x: 50, y: 8, s: 0.8 }, EARTH: { x: 21, y: 38, s: 1.15 },
  SILENCE: { x: 58, y: 34, s: 0.9 }, ROOTS: { x: 5, y: 64, s: 0.85 }, ART: { x: 40, y: 60, s: 0.75 }, FUTURE: { x: 60, y: 72, s: 1 },
};

function Preview({ id, mouse }: { id: DialogueId; mouse: { x: number; y: number } }) {
  const d = dialogue(id);
  const style = { ['--mx' as string]: `${mouse.x * 100}%`, ['--my' as string]: `${mouse.y * 100}%` } as CSSProperties;
  return (
    <div className={`portal-preview pv-${id.toLowerCase()}`} style={style} aria-hidden="true">
      {id === 'LIGHT' && <LightField sun={mouse.x} />}
      {id !== 'LIGHT' && <ArtMedia media={d.hero} decorative className="portal-media" />}
      {id === 'ROOTS' && <ArtMedia media={dialogue('ROOTS').studies[0]} decorative video={false} className="portal-media roots-under" />}
      {id === 'AIR' && <Particles flow={1} />}
      {id === 'FUTURE' && <div className="future-panels">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ ['--i' as string]: i }} />)}</div>}
    </div>
  );
}

export default function ExperiencePortal({ onOpen, suggested }: { onOpen: (id: DialogueId) => void; suggested?: DialogueId[] }) {
  const [active, setActive] = useState<DialogueId | null>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [ref, inView] = useInView<HTMLElement>({ live: true, threshold: 0.4 });
  const { tier } = useMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  useAudioZone(inView && !active, { bed: null, layers: { drone: 0.12 } });
  useEffect(() => {
    if (!inView || !active) return;
    const d = dialogue(active);
    if (active === 'SILENCE') { audio.duck(0.04, 1.6); void audio.bedTo(null); }
    else { audio.duck(1, 0.4); void audio.bedTo(d.bed, 0.22, 0.8); }
    audio.layer('hum', active === 'FUTURE' ? 0.4 : 0);
  }, [active, inView]);

  const onMove = (e: PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  };
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = DIALOGUES.length;
    if (['ArrowRight', 'ArrowDown'].includes(e.key)) { e.preventDefault(); buttons.current[(i + 1) % n]?.focus(); }
    if (['ArrowLeft', 'ArrowUp'].includes(e.key)) { e.preventDefault(); buttons.current[(i - 1 + n) % n]?.focus(); }
  };

  const tilt = active === 'ART' ? `perspective(1200px) rotateY(${(mouse.x - 0.5) * 14}deg) rotateX(${(0.5 - mouse.y) * 8}deg)` : undefined;

  return (
    <section id="experiences" ref={ref} className={'portal' + (active ? ` is-${active.toLowerCase()}` : '')} aria-labelledby="portal-title" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      {active && <Preview key={active} id={active} mouse={mouse} />}
      <header className="portal-head">
        <p className="label">7 human experiences</p>
        <h2 id="portal-title" className="narrative">Choose where to begin.</h2>
      </header>
      <ul className="portal-words" style={{ transform: tilt }}>
        {DIALOGUES.map((d, i) => {
          const pl = PLACE[d.id];
          const pos = tier === 'mobile' ? undefined : ({ left: `${pl.x}%`, top: `${pl.y}%`, fontSize: `calc(var(--portal-size) * ${pl.s})` } as CSSProperties);
          return (
            <li key={d.id} style={pos} className={active && active !== d.id ? 'is-dim' : ''}>
              <button ref={(el: HTMLButtonElement | null) => { buttons.current[i] = el; }} onPointerEnter={() => setActive(d.id)} onFocus={() => setActive(d.id)} onBlur={() => setActive(null)}
                onClick={() => onOpen(d.id)} onKeyDown={(e: KeyboardEvent) => onKey(e, i)} aria-describedby={`q-${d.id}`}>
                <span className="label portal-index">{d.index}{suggested?.includes(d.id) ? ' · for you' : ''}{isClosed(d.id) ? ' · commissions closed' : ''}</span>
                <span className="portal-word">{d.id}</span>
                <span id={`q-${d.id}`} className="portal-question">{d.question.join(' ')}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="label portal-hint">Hover, or use the arrow keys · Enter to open</p>
    </section>
  );
}
