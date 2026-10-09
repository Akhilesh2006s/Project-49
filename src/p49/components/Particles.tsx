import { useEffect, useRef } from 'react';
import { useMotion } from '../hooks/motion';

/**
 * Air made visible. Particles advect along a flow; `flow` 0 stops them,
 * `path` bends them through openings (used by the AIR section drawing).
 */
interface Props { flow: number; className?: string; path?: (x: number, y: number) => [number, number]; count?: number }

export default function Particles({ flow, className = '', path, count }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const flowRef = useRef(flow);
  const { tier, reduced } = useMotion();
  flowRef.current = flow;

  useEffect(() => {
    if (reduced) return;
    const c = ref.current!, g = c.getContext('2d'); if (!g) return;
    const n = count ?? (tier === 'high' ? 420 : tier === 'standard' ? 220 : 110);
    let w = 0, h = 0, raf = 0, visible = true;
    const pts = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), life: Math.random() }));
    const fit = () => { const dpr = Math.min(devicePixelRatio || 1, 1.5); w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(c);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) raf = requestAnimationFrame(tick); });
    io.observe(c);
    let current = flowRef.current;
    function tick() {
      if (!visible) return;
      current += (flowRef.current - current) * 0.03;
      g!.clearRect(0, 0, w, h);
      g!.fillStyle = 'rgba(241,236,226,0.55)';
      for (const p of pts) {
        const [vx, vy] = path ? path(p.x, p.y) : [1, Math.sin(p.y * 12 + p.x * 4) * 0.25];
        p.x += vx * 0.0022 * current; p.y += vy * 0.0022 * current;
        p.life -= 0.002 * (0.3 + current);
        if (p.x > 1.02 || p.x < -0.02 || p.y > 1.02 || p.y < -0.02 || p.life < 0) { p.x = path ? Math.random() * 0.08 : Math.random() * 0.1; p.y = Math.random(); p.life = 1; }
        const a = Math.min(1, p.life * 2) * (0.25 + current * 0.75);
        g!.globalAlpha = a;
        g!.fillRect(p.x * w, p.y * h, 1.4 + current, 1.1);
      }
      g!.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [tier, reduced, path, count]);

  return <canvas ref={ref} className={'particles ' + className} aria-hidden="true" />;
}
