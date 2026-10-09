import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { audio } from './audio/AudioEngine';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import OpeningFilm from './components/OpeningFilm';
import SoundGateway from './components/SoundGateway';
import { DIALOGUE_IDS, DialogueId, dialogue } from './data/dialogues';
import ExperienceShell from './experiences/ExperienceShell';
import { EXPERIENCES } from './experiences';
import { MotionProvider } from './hooks/motion';
import { subscribe } from './hooks/scroll';
import BrandClosure from './scenes/BrandClosure';
import Closure from './scenes/Closure';
import Enquiries from './scenes/Enquiries';
import ExperiencePortal from './scenes/ExperiencePortal';
import HumanBrief from './scenes/HumanBrief';
import HumanIndex from './scenes/HumanIndex';
import HumanStimulus from './scenes/HumanStimulus';
import LuxuryReframed from './scenes/LuxuryReframed';
import Manifesto from './scenes/Manifesto';
import NeuroArchitecture from './scenes/NeuroArchitecture';
import Project49Reveal from './scenes/Project49Reveal';
import Provenance from './scenes/Provenance';
import SensoryOverload from './scenes/SensoryOverload';
import Story from './scenes/Story';
import The49 from './scenes/The49';
import { KEYS, store } from './utils/storage';
import './styles/p49.css';

type Phase = 'gateway' | 'film' | 'site';

const hashDialogue = (): DialogueId | null => {
  const m = window.location.hash.match(/^#\/(\w+)/);
  const id = m?.[1].toUpperCase() as DialogueId | undefined;
  return id && DIALOGUE_IDS.includes(id) ? id : null;
};

function Site() {
  const params = new URLSearchParams(window.location.search);
  const [pref] = useState(() => store.get(KEYS.sound));
  const returning = pref !== null;
  const [phase, setPhase] = useState<Phase>(() => (params.has('nofilm') || hashDialogue() ? 'site' : returning ? 'film' : 'gateway'));
  const [sound, setSound] = useState(pref === 'on');
  const [open, setOpen] = useState<DialogueId | null>(hashDialogue);
  const [navVisible, setNavVisible] = useState(false);
  const [indexSignal, setIndexSignal] = useState(0);
  const [suggested, setSuggested] = useState<DialogueId[]>([]);
  const sentinel = useRef<HTMLDivElement>(null);
  const savedY = useRef(0);

  // returning visitors who chose sound: the first gesture anywhere unlocks it
  useEffect(() => {
    if (pref !== 'on' || audio.ready) return;
    const unlock = () => { void audio.unlock(); };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
  }, [pref]);

  useEffect(() => {
    const onVis = () => (document.hidden ? audio.suspend() : audio.resume());
    document.addEventListener('visibilitychange', onVis);
    return () => { document.removeEventListener('visibilitychange', onVis); audio.dispose(); };
  }, []);

  useEffect(() => { document.body.classList.toggle('is-locked', phase !== 'site'); }, [phase]);

  useEffect(() => subscribe(() => {
    const el = sentinel.current; if (!el) return;
    setNavVisible(el.getBoundingClientRect().top < window.innerHeight * 0.5);
  }), [phase, open]);

  useEffect(() => {
    const onHash = () => setOpen(hashDialogue());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (open) { window.scrollTo(0, 0); document.title = `${open} — PROJECT 49`; }
    else { document.title = 'PROJECT 49 — A NeuroArchitectural Initiative · Hyderabad'; requestAnimationFrame(() => window.scrollTo(0, savedY.current)); }
  }, [open]);

  const choose = async (withSound: boolean) => {
    store.set(KEYS.sound, withSound ? 'on' : 'off');
    setSound(withSound);
    if (withSound) await audio.unlock();
    setPhase('film');
  };
  const openDialogue = useCallback((id: DialogueId) => {
    if (!open) savedY.current = window.scrollY;
    window.location.hash = `#/${id.toLowerCase()}`;
  }, [open]);
  const closeDialogue = useCallback(() => {
    history.pushState(null, '', window.location.pathname + window.location.search + '#experiences');
    setOpen(null);
  }, []);
  const openIndex = useCallback(() => {
    setOpen(null);
    setTimeout(() => { document.getElementById('human-index')?.scrollIntoView({ behavior: 'auto' }); setIndexSignal(s => s + 1); }, 50);
  }, []);
  const onResult = useCallback((top: DialogueId[]) => setSuggested(top), []);

  const Deep = open ? EXPERIENCES[open] : null;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      {phase === 'gateway' && <SoundGateway onChoose={choose} />}
      {phase === 'film' && <OpeningFilm sound={sound} returning={returning} onDone={() => { store.set(KEYS.filmSeen, '1'); setPhase('site'); }} />}

      <Navigation visible={phase === 'site' && (navVisible || !!open)} onIndex={openIndex} />

      <main id="main" hidden={!!open} aria-hidden={phase !== 'site'}>
        <span id="top" />
        <Manifesto />
        <SensoryOverload />
        <NeuroArchitecture />
        <HumanStimulus />
        <Project49Reveal />
        <div ref={sentinel} aria-hidden="true" />
        <ExperiencePortal onOpen={openDialogue} suggested={suggested} />
        <HumanIndex onExplore={openDialogue} onResult={onResult} openSignal={indexSignal} />
        <HumanBrief />
        <The49 />
        <Provenance />
        <LuxuryReframed />
        <Story />
        <Closure onIndex={openIndex} />
        <BrandClosure />
        <Enquiries />
        <Footer />
      </main>

      {open && Deep && (
        <div className="deep" key={open}>
          <ExperienceShell d={dialogue(open)} onClose={closeDialogue} onOpen={openDialogue}>
            <Suspense fallback={<div className="deep-loading label" role="status">Opening {open}…</div>}>
              <Deep />
            </Suspense>
          </ExperienceShell>
        </div>
      )}
    </>
  );
}

export default function Experience() {
  return <MotionProvider><Site /></MotionProvider>;
}
