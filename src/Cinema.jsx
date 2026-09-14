import { useEffect, useRef } from 'react';
import chapters from './data/chapters';

function Film({ scene, paused, onProgress, onEnd }) {
  const ref = useRef(null);
  useEffect(() => { const v = ref.current; if (v) { if (paused) v.pause(); else v.play().catch(() => {}); } }, [paused, scene]);
  return (
    <div className="film-frame" key={scene.id}>
      <img src={scene.poster} alt="" />
      {scene.video && (
        <video ref={ref} src={scene.video} poster={scene.poster} muted playsInline preload="auto"
          onTimeUpdate={e => onProgress(e.target.currentTime / e.target.duration || 0)}
          onEnded={e => { e.target.currentTime = 0; if (!paused) e.target.play().catch(() => {}); onEnd(); }} />
      )}
    </div>
  );
}

export default function Cinema({ chapter, scene, frame, opened, paused, progress, sound, volume, setVolume,
  onProgress, onAdvance, onBack, onLeave, onPause, onSound, onEnable, onSelect, onNext }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, [chapter]);
  useEffect(() => {
    const key = e => {
      if (e.key === 'Escape') onLeave();
      if (e.key === 'ArrowRight') onAdvance();
      if (e.key === 'ArrowLeft') onBack();
      if (e.key === 'Tab') {
        const els = [...document.querySelectorAll('.experience button,.experience input')], first = els[0], last = els.at(-1);
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [onLeave, onAdvance, onBack]);

  const next = chapters[(opened + 1) % 7];
  return (
    <section className={'experience theme-' + chapter.id.toLowerCase()} role="dialog" aria-modal="true" aria-label={`${chapter.id} film experience`}>
      <Film scene={scene} paused={paused} onProgress={onProgress} onEnd={onAdvance} />
      <div className="cinema-shade" />
      <div className="cinema-header">
        <span>PROJECT 49 <b>/ {chapter.number} / {chapter.id}</b></span>
        <button ref={closeRef} onClick={onLeave} aria-label="Close film and return to the seven ideas">All ideas <span>×</span></button>
      </div>
      <div className="chapter-entry" key={chapter.id} aria-hidden="true">
        <span>{chapter.number} / Seven ideas</span><strong>{chapter.id.toLowerCase()}</strong><em>{chapter.title}</em>
      </div>
      <div className="cinema-copy" key={`${chapter.id}-${frame}`}>
        <p className="eyebrow">{chapter.id} / {scene.eyebrow}</p>
        <h2>{scene.line[0]}<br /><em>{scene.line[1]}</em></h2>
        <p className="chapter-description">{chapter.description}</p>
        <p className="chapter-count">Seven interpretations of {chapter.id.toLowerCase()}. No repetition.</p>
      </div>
      {!sound && <button className="sound-invite" onClick={() => onEnable()}>◉ Hear this space <span>Enable sound</span></button>}
      <div className="cinema-bottom">
        <div className="scene-selector">
          {chapter.scenes.map((s, i) => (
            <button key={s.id} aria-label={`Play ${s.eyebrow}`} aria-current={frame === i ? 'step' : undefined} onClick={() => onSelect(i)}>
              <span className="track"><i style={{ width: frame === i ? `${progress * 100}%` : frame > i ? '100%' : '0%' }} /></span>
              <span>{String(i + 1).padStart(2, '0')} <b>{s.eyebrow}</b></span>
            </button>
          ))}
        </div>
        <div className="playback">
          <button onClick={onPause} aria-label={paused ? 'Play film' : 'Pause film'}>{paused ? 'Play ▷' : 'Pause Ⅱ'}</button>
          <button onClick={onSound} aria-pressed={sound}>Sound {sound ? 'on' : 'off'}</button>
          {sound && <input type="range" aria-label="Sound volume" min="0" max="1" step=".05" value={volume} onChange={e => setVolume(+e.target.value)} />}
          <button className="next-idea" onClick={onNext}>Next: {next.id.toLowerCase()} ↗</button>
        </div>
      </div>
    </section>
  );
}
