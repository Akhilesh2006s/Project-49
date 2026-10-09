import { useEffect, useRef } from 'react';
import { audio } from '../audio/AudioEngine';
import ArtMedia from '../components/ArtMedia';
import Stage from '../components/Stage';
import { dialogue } from '../data/dialogues';
import { ease, seg } from '../utils/math';

/**
 * ART. The page itself becomes a corridor: the viewport narrows as you walk,
 * then opens all at once onto a stair that is also a sculpture.
 */
export default function ArtExperience() {
  const d = dialogue('ART');
  const released = useRef(false);
  useEffect(() => () => { released.current = false; }, []);
  return (
    <Stage label="Compression, then release" length={5} stills={[0.3, 1]} className="x-art">
      {(p, mode) => {
        const live = mode === 'live';
        const squeeze = live ? ease(seg(p, 0.05, 0.5)) * (1 - seg(p, 0.55, 0.58)) : p < 0.5 ? 0.8 : 0;
        const open = live ? seg(p, 0.55, 0.6) : p < 0.5 ? 0 : 1;
        if (live && open > 0.5 && !released.current) { released.current = true; audio.swell(3); void audio.once('art-footsteps', 0.4); }
        if (live && open < 0.1) released.current = false;
        const inset = squeeze * 40;
        return (
          <div className="art-stage">
            <div className="art-corridor" style={{ clipPath: `inset(${squeeze * 12}% ${inset}% ${squeeze * 12}% ${inset}%)` }}>
              <ArtMedia media={d.studies[0]} decorative className="art-walls" />
              <p className="label art-walk" style={{ opacity: 1 - open }}>Compressed passage · {Math.round(100 - inset * 2)}% of the view</p>
            </div>
            <div className="art-release" style={{ opacity: open, transform: `scale(${1.08 - open * 0.08})` }} aria-hidden={open < 0.5}>
              <ArtMedia media={d.hero} decorative active={open > 0.2} />
              <div className="art-release-copy" style={{ transform: live ? `perspective(900px) rotateY(${(seg(p, 0.6, 1) - 0.5) * -10}deg)` : undefined }}>
                <p className="label">Release</p>
                <h2 className="monument-sm">The stair becomes sculpture.</h2>
                <p className="narrative">An opening frames an unexpected view. Light meets art exactly once, where it was decided.</p>
              </div>
            </div>
          </div>
        );
      }}
    </Stage>
  );
}
