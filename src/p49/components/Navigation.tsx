import { useEffect, useState } from 'react';
import { audio } from '../audio/AudioEngine';
import { BRAND } from '../config/brand';
import { useMotion } from '../hooks/motion';
import { useScrollDirection } from '../hooks/scroll';
import { KEYS, store } from '../utils/storage';

/** Part 33. Appears only after the concept is revealed; hides on the way down, returns on the way up. */
export default function Navigation({ visible, onIndex }: { visible: boolean; onIndex: () => void }) {
  const { down, progress, y } = useScrollDirection();
  const { reduced, setReduced } = useMotion();
  const [sound, setSound] = useState(audio.enabled);
  useEffect(() => audio.onChange(setSound), []);
  const hidden = !visible || (down && y > 200);

  const toggleSound = async () => {
    if (sound) { audio.setEnabled(false); store.set(KEYS.sound, 'off'); }
    else { await audio.unlock(); store.set(KEYS.sound, 'on'); }
  };

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
      <header className={'nav' + (hidden ? ' is-hidden' : '')} aria-hidden={!visible}>
        <a href="#top" className="nav-brand" tabIndex={visible ? 0 : -1}>{BRAND.projectName}</a>
        <nav aria-label="Primary">
          <a href="#philosophy" tabIndex={visible ? 0 : -1}>Philosophy</a>
          <a href="#experiences" tabIndex={visible ? 0 : -1}>7 Experiences</a>
          <button onClick={onIndex} tabIndex={visible ? 0 : -1}>Human Index</button>
          <a href="#the-49" tabIndex={visible ? 0 : -1}>The 49</a>
          <span className="nav-sep" aria-hidden="true" />
          <button className="nav-toggle" aria-pressed={sound} onClick={toggleSound} tabIndex={visible ? 0 : -1}>Sound {sound ? 'on' : 'off'}</button>
          <button className="nav-toggle" aria-pressed={reduced} onClick={() => setReduced(!reduced)} tabIndex={visible ? 0 : -1}>Motion {reduced ? 'reduced' : 'full'}</button>
        </nav>
      </header>
    </>
  );
}
