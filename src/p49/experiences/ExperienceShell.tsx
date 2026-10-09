import { ReactNode, useEffect, useRef } from 'react';
import { audio } from '../audio/AudioEngine';
import { useAudioZone } from '../audio/useAudioZone';
import ArtMedia from '../components/ArtMedia';
import { DIALOGUES, Dialogue, DialogueId } from '../data/dialogues';
import { useInView } from '../hooks/scroll';

/**
 * Every dialogue has the same frame: arrive on the question, walk through the
 * experience, leave on the thought. Only the middle is different.
 */
interface Props { d: Dialogue; children: ReactNode; onClose: () => void; onOpen: (id: DialogueId) => void }

function Block({ className, children, zone }: { className: string; children: ReactNode; zone?: Parameters<typeof useAudioZone>[1] }) {
  const [ref, inView] = useInView<HTMLElement>({ live: true, threshold: 0.5 });
  useAudioZone(!!zone && inView, zone ?? {});
  return <section ref={ref} className={className + (inView ? ' is-in' : '')}>{children}</section>;
}

export default function ExperienceShell({ d, children, onClose, onOpen }: Props) {
  const i = DIALOGUES.indexOf(d);
  const next = DIALOGUES[(i + 1) % DIALOGUES.length];
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); return () => { audio.layer('hum', 0); audio.duck(1); }; }, []);

  return (
    <article className={`experience x-${d.id.toLowerCase()}`} aria-labelledby={`x-title-${d.id}`}>
      <nav className="x-bar" aria-label={`${d.id} navigation`}>
        <button ref={closeRef} className="label" onClick={onClose}><span aria-hidden="true">←</span> 7 experiences</button>
        <span className="label x-bar-index">{d.index} / 07 · {d.id}</span>
        <button className="label" onClick={() => onOpen(next.id)}>{next.id} <span aria-hidden="true">→</span></button>
      </nav>

      <Block className="x-intro" zone={{ bed: d.bed, level: 0.25 }}>
        <ArtMedia media={d.hero} className="x-intro-media" decorative />
        <p className="label">{d.index} · Architectural dialogue</p>
        <h1 id={`x-title-${d.id}`} className="x-word">{d.id}</h1>
        <h2 className="monument-sm x-question">{d.question.map((l, k) => <span key={k}>{l}</span>)}</h2>
        <p className="label x-scroll" aria-hidden="true">Scroll</p>
      </Block>

      {children}

      <Block className="x-concepts">
        <p className="label">What this dialogue considers</p>
        <ul className="x-concept-list">{d.concepts.map(c => <li key={c}>{c}</li>)}</ul>
        {d.vocabulary.length > 0 && <><p className="label">Architectural vocabulary</p><ul className="x-vocab label">{d.vocabulary.map(v => <li key={v}>{v}</li>)}</ul></>}
        <p className="x-evidence label">Evidence informs the architecture. It does not replace architecture.</p>
      </Block>

      <Block className="x-final" zone={d.id === 'SILENCE' ? { bed: null, duck: 0.02 } : { bed: d.bed, level: 0.18, layers: { drone: 0.2 } }}>
        {d.preface && <p className="narrative x-preface">{d.preface}</p>}
        <h2 className="monument">{d.final.map((l, k) => <span key={k}>{l}</span>)}</h2>
        {d.coda && <ul className="x-coda">{d.coda.map(c => <li key={c}>{c}</li>)}</ul>}
      </Block>

      <footer className="x-next">
        <button className="x-next-link" onClick={() => onOpen(next.id)}>
          <span className="label">Next dialogue · {next.index}</span><span className="monument-sm">{next.id}</span>
        </button>
        <button className="label x-return" onClick={onClose}>Return to the seven experiences</button>
      </footer>
    </article>
  );
}
