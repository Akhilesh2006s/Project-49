import { CSSProperties, ReactNode } from 'react';
import { useMotion } from '../hooks/motion';
import { useInView, useStageProgress } from '../hooks/scroll';

/**
 * Scroll as camera movement. A Stage is a tall section whose inner viewport is
 * pinned while the visitor scrolls; children receive progress 0..1.
 *
 * Reduced motion: no pinning. The sequence is rendered as a few composed
 * stills (`stills`), each fading in as it arrives. Same content, no movement.
 * Mobile: camera moves are shortened (`length` × 0.7).
 */
interface Props {
  id?: string;
  label: string;
  length: number;
  stills?: number[];
  className?: string;
  style?: CSSProperties;
  children: (p: number, mode: 'live' | 'still', seen: boolean) => ReactNode;
}

/** Render props run inside their own component, so hooks used in them keep a stable order. */
function Frame({ p, mode, seen, children }: { p: number; mode: 'live' | 'still'; seen: boolean; children: Props['children'] }) {
  return <>{children(p, mode, seen)}</>;
}

function Still({ p, children }: { p: number; children: Props['children'] }) {
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.25 });
  return <div ref={ref} className={'stage-still' + (seen ? ' is-seen' : '')}><Frame p={p} mode="still" seen={seen}>{children}</Frame></div>;
}

export default function Stage({ id, label, length, stills = [1], className = '', style, children }: Props) {
  const { reduced, tier } = useMotion();
  const [ref, p] = useStageProgress<HTMLElement>(!reduced);
  if (reduced) {
    return (
      <section id={id} aria-label={label} className={'stage is-reduced ' + className} style={style}>
        {stills.map(s => <Still key={s} p={s}>{children}</Still>)}
      </section>
    );
  }
  const vh = Math.round(length * (tier === 'mobile' ? 70 : 100));
  return (
    <section id={id} ref={ref} aria-label={label} className={'stage ' + className} style={{ ...style, height: `${vh}vh` }}>
      <div className="stage-pin"><Frame p={p} mode="live" seen>{children}</Frame></div>
    </section>
  );
}
