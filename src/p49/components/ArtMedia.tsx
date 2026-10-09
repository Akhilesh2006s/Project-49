import { CSSProperties, useEffect, useRef, useState } from 'react';
import type { MediaRef } from '../data/dialogues';
import { useMotion } from '../hooks/motion';
import { useInView } from '../hooks/scroll';

/**
 * Art-directed media with graceful fallback:
 * final asset (/media/...) → existing study (/scenes/...) → poster → nothing.
 * Video only plays while visible, never under reduced motion or on save-data,
 * and on mobile only when `mobileVideo` is set.
 */
interface Props { media: MediaRef; className?: string; style?: CSSProperties; video?: boolean; mobileVideo?: boolean; active?: boolean; decorative?: boolean }

export default function ArtMedia({ media, className = '', style, video = true, mobileVideo = false, active = true, decorative = false }: Props) {
  const { reduced, tier } = useMotion();
  const [ref, inView] = useInView<HTMLDivElement>({ live: true, margin: '20% 0px' });
  const [poster, setPoster] = useState(media.poster);
  const vid = useRef<HTMLVideoElement>(null);
  const wantVideo = video && !reduced && (tier !== 'mobile' || mobileVideo);

  useEffect(() => { setPoster(media.poster); }, [media.poster]);
  useEffect(() => {
    const v = vid.current; if (!v) return;
    if (inView && active) v.play().catch(() => {}); else v.pause();
  }, [inView, active, wantVideo]);

  return (
    <div ref={ref} className={'art-media ' + className} style={style} role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : media.alt} aria-hidden={decorative || undefined}>
      <img src={poster} alt="" loading="lazy" decoding="async" onError={() => poster !== media.posterFallback && setPoster(media.posterFallback)} />
      {wantVideo && inView && (
        <video ref={vid} muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
          <source src={media.primary} type="video/mp4" />
          {media.fallback !== media.primary && <source src={media.fallback} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}
