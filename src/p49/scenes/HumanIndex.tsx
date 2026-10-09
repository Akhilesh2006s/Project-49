import { createPortal } from 'react-dom';
import { KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import Fingerprint from '../components/Fingerprint';
import Sketch from '../components/Sketch';
import { DialogueId, dialogue } from '../data/dialogues';
import { DIMENSIONS, QUESTIONS, Scores, dialogueRanking, score } from '../data/humanIndex';
import { KEYS, store } from '../utils/storage';

/**
 * Part 26. THE HUMAN INDEX. No name, email or phone at any point.
 * Answers stay in this browser. It is an architectural questionnaire, not a diagnosis.
 */
interface Props { onExplore: (id: DialogueId) => void; onResult: (top: DialogueId[]) => void; openSignal: number }

function Scene({ scene }: { scene: string }) {
  if (scene.startsWith('img:')) return <img src={scene.slice(4)} alt="" loading="lazy" />;
  return <Sketch kind={scene.slice(5)} />;
}

export default function HumanIndex({ onExplore, onResult, openSignal }: Props) {
  const saved = useMemo(() => { try { return JSON.parse(store.get(KEYS.index) ?? 'null') as Record<string, number> | null; } catch { return null; } }, []);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(saved ?? {});
  const [done, setDone] = useState(!!saved && Object.keys(saved).length === QUESTIONS.length);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scores: Scores = useMemo(() => score(answers), [answers]);
  const ranking = useMemo(() => dialogueRanking(scores), [scores]);
  const seed = useMemo(() => Object.values(answers).reduce((a, v, i) => a * 7 + v + i, 49), [answers]);

  useEffect(() => { if (openSignal > 0) setOpen(true); }, [openSignal]);
  useEffect(() => { if (done) onResult(ranking.slice(0, 3).map(r => r.id)); }, [done, ranking, onResult]);
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('is-locked');
    const main = document.getElementById('main'); if (main) main.inert = true;
    const first = dialogRef.current?.querySelector<HTMLElement>('button[role="radio"], .index-result button');
    first?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', key);
    return () => { document.body.classList.remove('is-locked'); if (main) main.inert = false; window.removeEventListener('keydown', key); };
  }, [open, step, done]);

  const q = QUESTIONS[step];
  const choose = (i: number) => {
    const next = { ...answers, [q.id]: i };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setTimeout(() => setStep(step + 1), 280);
    else { store.set(KEYS.index, JSON.stringify(next)); setTimeout(() => setDone(true), 280); }
  };
  const restart = () => { setAnswers({}); setStep(0); setDone(false); store.del(KEYS.index); };

  return (
    <section id="human-index" className="index" aria-labelledby="index-title">
      <div className="index-intro">
        <p className="label">P49 / Human Index</p>
        <h2 id="index-title" className="monument">Discover how<br />you experience space.</h2>
        <p className="narrative">Eleven questions, answered with images. Nothing is asked about who you are, and nothing leaves this browser.</p>
        <button className="line-button" onClick={() => { setOpen(true); if (!done) setStep(0); }}>{done ? 'See your spatial profile' : 'Begin the Human Index'} <span aria-hidden="true">→</span></button>
      </div>

      {open && createPortal(
        <div ref={dialogRef} className="index-dialog" role="dialog" aria-modal="true" aria-label="Human Index">
          <div className="index-bar">
            <span className="label">P49 / Human Index</span>
            {!done && <span className="label">{String(step + 1).padStart(2, '0')} / {QUESTIONS.length}</span>}
            <button className="label" onClick={() => setOpen(false)}>Close <span aria-hidden="true">×</span></button>
          </div>

          {!done ? (
            <div className="index-question" key={q.id}>
              <h3 id={`iq-${q.id}`} className="monument-sm">{q.prompt}</h3>
              <div className="index-options" role="radiogroup" aria-labelledby={`iq-${q.id}`} style={{ ['--n' as string]: q.options.length }}
                onKeyDown={(e: ReactKeyboardEvent<HTMLDivElement>) => {
                  const btns = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
                  const i = btns.indexOf(document.activeElement as HTMLButtonElement);
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); btns[(i + 1) % btns.length].focus(); }
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); btns[(i - 1 + btns.length) % btns.length].focus(); }
                }}>
                {q.options.map((o, i) => (
                  <button key={o.label} role="radio" aria-checked={answers[q.id] === i} className={'index-option' + (answers[q.id] === i ? ' is-chosen' : '')} onClick={() => choose(i)}>
                    <span className="index-scene"><Scene scene={o.scene} /></span>
                    <span className="index-label">{o.label}</span>
                  </button>
                ))}
              </div>
              <div className="index-steps">
                <button className="label" disabled={step === 0} onClick={() => setStep(step - 1)}>← Previous</button>
                <span className="index-track" aria-hidden="true"><i style={{ transform: `scaleX(${(step + 1) / QUESTIONS.length})` }} /></span>
              </div>
            </div>
          ) : (
            <div className="index-result">
              <div className="index-result-art"><Fingerprint scores={scores} seed={seed} /></div>
              <div className="index-result-copy">
                <p className="label">Your spatial profile</p>
                <h3 className="monument-sm">This isn&rsquo;t your house style.<br /><em>It&rsquo;s the beginning of understanding how you inhabit space.</em></h3>
                <p className="label index-lean">The dialogues you lean toward</p>
                <ol className="index-top">
                  {ranking.slice(0, 3).map(r => (
                    <li key={r.id}><button onClick={() => { setOpen(false); onExplore(r.id); }}><span className="label">{dialogue(r.id).index}</span>{r.id}<span aria-hidden="true"> →</span></button></li>
                  ))}
                </ol>
                <details className="index-method">
                  <summary className="label">How this was calculated</summary>
                  <p>Every answer adds points to seven dimensions. Your totals:</p>
                  <table><tbody>{DIMENSIONS.map(d => <tr key={d}><th scope="row">{d}</th><td>{scores[d]}</td></tr>)}</tbody></table>
                  <p>Each dimension leans toward one or two dialogues (for example CALM toward SILENCE, MEMORY toward ROOTS). The drawing uses the same totals: a larger court for calm, rays for light, planting for nature, a grid for adaptability.</p>
                </details>
                <p className="index-disclaimer">An exploratory architectural questionnaire. It is not a psychological, medical or neurological assessment.</p>
                <button className="label" onClick={restart}>Answer again</button>
              </div>
            </div>
          )}
        </div>, document.body,
      )}
    </section>
  );
}
