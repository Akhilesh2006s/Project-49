import { useEffect, useRef, useState } from 'react';

/** Pure black, a held breath, then one choice. The click is what legally unlocks audio. */
export default function SoundGateway({ onChoose }: { onChoose: (sound: boolean) => void }) {
  const [shown, setShown] = useState(false);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { const t = setTimeout(() => setShown(true), 750); return () => clearTimeout(t); }, []);
  useEffect(() => { if (shown) first.current?.focus({ preventScroll: true }); }, [shown]);
  return (
    <div className={'gateway' + (shown ? ' is-shown' : '')} role="dialog" aria-modal="true" aria-labelledby="gateway-title">
      <div className="gateway-inner">
        <p id="gateway-title" className="label">This experience uses sound</p>
        <div className="gateway-actions">
          <button ref={first} className="gateway-primary" onClick={() => onChoose(true)}>Enter with sound</button>
          <button className="gateway-secondary" onClick={() => onChoose(false)}>Continue silently</button>
        </div>
        <p className="gateway-note label">Headphones recommended</p>
      </div>
    </div>
  );
}
