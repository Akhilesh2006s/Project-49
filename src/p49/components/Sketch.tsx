/** Small drawn scenes for Human Index options that have no photograph. */
import type { ReactElement } from 'react';
export default function Sketch({ kind }: { kind: string }) {
  const s = { stroke: '#F1ECE2', strokeWidth: 1.2, fill: 'none' } as const;
  const dots = (n: number, cx: number, spread: number) => Array.from({ length: n }, (_, i) => <circle key={i} cx={cx + (i - (n - 1) / 2) * spread} cy="140" r="5" fill="#B99A61" />);
  const art: Record<string, ReactElement> = {
    alcove: <><path {...s} d="M40 200 V60 H260 V200" /><path {...s} d="M170 200 V110 Q200 80 230 110 V200" /><circle cx="200" cy="170" r="6" fill="#B99A61" /></>,
    noise: <>{[0, 1, 2, 3, 4].map(i => <path key={i} {...s} d={`M40 ${70 + i * 28} Q90 ${50 + i * 28} 140 ${70 + i * 28} T240 ${70 + i * 28}`} />)}</>,
    clutter: <>{Array.from({ length: 18 }, (_, i) => <rect key={i} {...s} x={40 + (i * 37) % 200} y={50 + (i * 53) % 130} width={12 + (i % 4) * 8} height={10 + (i % 3) * 9} />)}</>,
    gather: <><circle {...s} cx="150" cy="130" r="60" />{dots(5, 150, 18)}</>,
    corners: <><path {...s} d="M40 60 H260 V210 H40Z M150 60 V210 M40 135 H260" /><circle cx="90" cy="95" r="5" fill="#B99A61" /><circle cx="210" cy="175" r="5" fill="#B99A61" /><circle cx="210" cy="95" r="5" fill="#B99A61" /></>,
    settle: <><path {...s} d="M40 200 H260" /><path {...s} d="M70 200 V120 H230 V200" /></>,
    verandah: <><path {...s} d="M30 90 H270 M60 90 V210 M120 90 V210 M180 90 V210 M240 90 V210" />{Array.from({ length: 16 }, (_, i) => <path key={i} stroke="#898278" d={`M${35 + i * 15} 20 l-8 50`} />)}</>,
    glass: <><rect {...s} x="60" y="60" width="180" height="140" />{Array.from({ length: 12 }, (_, i) => <path key={i} stroke="#898278" d={`M${70 + i * 14} 70 l-6 40`} />)}</>,
    deep: <><path {...s} d="M20 60 H280 V210 H20Z M70 90 H230 V190 H70Z M120 120 H180 V170 H120Z" /></>,
    larger: <>{dots(6, 150, 24)}</>,
    smaller: <>{dots(2, 150, 30)}</>,
    same: <>{dots(4, 150, 28)}</>,
    minimal: <><path {...s} d="M60 200 H240 M100 200 V150 H200 V200" /></>,
  };
  return <svg viewBox="0 0 300 240" className="sketch" aria-hidden="true">{art[kind] ?? <circle {...s} cx="150" cy="120" r="50" />}</svg>;
}
