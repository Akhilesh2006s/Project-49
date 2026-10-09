import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { audio } from '../audio/AudioEngine';
import { BRAND } from '../config/brand';
import { CUES, FILM, FRAGMENTS, LINES, SHOTS, Shot } from '../data/film';

/**
 * The opening film. Plays the produced film when it exists; otherwise the
 * composed version from data/film.ts. Either way: skippable after two seconds
 * (Esc too), captions always available, and the final black frame is the same
 * PROJECT 49 lockup the page opens on, so the hand-off has no visible cut.
 */
interface Props { sound: boolean; returning: boolean; onDone: () => void }

async function hasProducedFilm() {
  try {
    const r = await fetch(FILM.src, { method: 'HEAD' });
    return r.ok && (r.headers.get('content-type') ?? '').startsWith('video');
  } catch { return false; }
}

function ShotLayer({ shot, t }: { shot: Shot; t: number }) {
  const local = (t - shot.from) / (shot.to - shot.from);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => { ref.current?.play().catch(() => {}); }, []);
  if (shot.treatment === 'black') return <div className="film-shot is-black" />;
  return (
    <div className={`film-shot t-${shot.treatment}`} style={{ ['--l' as string]: local.toFixed(3) }}>
      {shot.poster && <img src={shot.poster} alt="" />}
      {shot.clip && <video ref={ref} src={shot.clip} muted playsInline autoPlay preload="auto" />}
      {shot.treatment === 'blade' && <div className="film-blade" />}
      {shot.treatment === 'threshold' && <div className="film-threshold" />}
      {shot.word && shot.treatment === 'macro' && <span className="film-word">{shot.word}.</span>}
      {shot.word && shot.treatment === 'flash' && <span className="film-flash-word">{shot.word}</span>}
    </div>
  );
}

function ComposedFilm({ t }: { t: number }) {
  const shot = SHOTS.find(s => t >= s.from && t < s.to) ?? SHOTS[SHOTS.length - 1];
  const lines = LINES.filter(l => t >= l.from && t < l.to);
  const caption = lines.find(l => l.mode === 'caption');
  const title = t >= 27.6;
  return (
    <>
      <ShotLayer key={shot.from} shot={shot} t={t} />
      {t < 4 && (
        <div className="film-fragments" aria-hidden="true">
          {FRAGMENTS.map((f, i) => <span key={f} style={{ opacity: t > 0.6 + i * 0.45 && t < 3.9 ? 0.8 : 0, left: `${12 + i * 11}%`, top: `${20 + ((i * 23) % 60)}%` }}>{f}</span>)}
        </div>
      )}
      <div className={'title-lockup film-title' + (title ? ' is-on' : '')} aria-hidden={!title}>
        <h2>{BRAND.projectName}</h2>
        <p className="label">{BRAND.projectDescriptor}</p>
      </div>
      <p className={'film-caption' + (caption ? ' is-on' : '')} aria-live="polite">{caption?.text ?? ''}</p>
    </>
  );
}

export default function OpeningFilm({ sound, returning, onDone }: Props) {
  const [produced, setProduced] = useState<boolean | null>(null);
  const [t, setT] = useState(0);
  const [ending, setEnding] = useState(false);
  const [captions, setCaptions] = useState(true);
  const fired = useRef(new Set<number>());
  const done = useRef(false);
  const vid = useRef<HTMLVideoElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setEnding(true);
    audio.layer('city', 0); audio.layer('density', 0); audio.duck(1); void audio.bedTo(null);
    setTimeout(onDone, 900);
  }, [onDone]);

  useEffect(() => { void hasProducedFilm().then(setProduced); }, []);

  // composed-film clock
  useEffect(() => {
    if (produced !== false) return;
    let raf = 0; const start = performance.now();
    const tick = (now: number) => {
      const v = (now - start) / 1000;
      setT(v);
      if (v >= FILM.duration) { finish(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onVis = () => { if (document.hidden) finish(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); };
  }, [produced, finish]);

  // sound cues
  useEffect(() => {
    if (produced !== false || !sound) return;
    for (const c of CUES) {
      if (t < c.at || fired.current.has(c.at)) continue;
      fired.current.add(c.at);
      if (c.do === 'city') audio.layer('city', 1, 1.5);
      if (c.do === 'door') audio.doorClose();
      if (c.do === 'bed') { audio.duck(1, 0.3); void audio.bedTo(c.arg ?? null, 0.3, 0.8); }
      if (c.do === 'silence') audio.duck(0.03, 0.35);
      if (c.do === 'restore') audio.duck(1, 0.2);
      if (c.do === 'drone') { void audio.bedTo(null, 0, 1); audio.layer('drone', 0.6, 3); }
      if (c.do === 'open') { audio.layer('drone', 0.15, 1); void audio.bedTo('roots-courtyard-birds', 0.4, 0.4); void audio.once('roots-wooden-door', 0.5); }
      if (c.do === 'swell') { audio.duck(1, 0.5); audio.swell(2.5); }
    }
  }, [t, sound, produced]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') finish(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [finish]);

  const canSkip = returning || t >= FILM.skipAfter || (produced && (vid.current?.currentTime ?? 0) >= FILM.skipAfter);
  useEffect(() => { if (canSkip) skipRef.current?.focus({ preventScroll: true }); }, [canSkip]);

  return (
    <div className={'film' + (ending ? ' is-ending' : '') + (captions ? '' : ' no-captions')} role="dialog" aria-modal="true" aria-label="PROJECT 49 opening film">
      {produced === true && (
        <video ref={vid} className="film-produced" src={FILM.src} poster={FILM.poster} autoPlay playsInline muted={!sound}
          onTimeUpdate={(e: SyntheticEvent<HTMLVideoElement>) => setT(e.currentTarget.currentTime)} onEnded={finish} onError={() => setProduced(false)}>
          <track kind="captions" src={FILM.captions} srcLang="en" label="English" default={captions} />
        </video>
      )}
      {produced === false && <ComposedFilm t={t} />}
      <div className="film-controls">
        <button className="label film-cc" aria-pressed={captions} onClick={() => setCaptions(c => !c)}>Captions {captions ? 'on' : 'off'}</button>
        <button ref={skipRef} className={'label film-skip' + (canSkip ? ' is-on' : '')} onClick={finish} tabIndex={canSkip ? 0 : -1} aria-hidden={!canSkip}>
          Skip to {BRAND.projectName} <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="film-progress" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, t / FILM.duration)})` }} /></div>
    </div>
  );
}
