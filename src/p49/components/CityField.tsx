import { useEffect, useRef } from 'react';
import { LAKES, POSITIONS, RIVER, URBAN } from '../data/city';
import { useMotion } from '../hooks/motion';
import { ease, lerp, seg } from '../utils/math';
import { HOMES } from '../data/collection';

/**
 * The 1 → 7 → 49 → Hyderabad field, drawn on canvas.
 * `stage` 0..1 drives the choreography; `night` switches to the closure palette
 * where only real (entered) statuses are lit; `isolate` leaves a single point.
 */
interface Props { stage: number; night?: boolean; isolate?: number; label: string }

export default function CityField({ stage, night = false, isolate = 0, label }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const { tier } = useMotion();

  useEffect(() => {
    const c = ref.current!;
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, tier === 'high' ? 2 : 1.5);
      const w = c.clientWidth, h = c.clientHeight;
      size.current = { w, h, dpr }; c.width = w * dpr; c.height = h * dpr;
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(c);
    return () => ro.disconnect();
  }, [tier]);

  useEffect(() => {
    const c = ref.current!, g = c.getContext('2d'); if (!g) return;
    const { w, h, dpr } = size.current; if (!w) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    const S = Math.min(w, h * 1.3), ox = (w - S) / 2, oy = (h - S / 1.3) / 2;
    const X = (x: number) => ox + x * S, Y = (y: number) => oy + y * (S / 1.3);
    const cx = w / 2, cy = h / 2;

    const one = ease(seg(stage, 0, 0.12));
    const seven = ease(seg(stage, 0.14, 0.28));
    const fortyNine = ease(seg(stage, 0.3, 0.44));
    const city = ease(seg(stage, 0.46, 0.62));
    const gold = night ? '185,154,97' : '185,154,97';

    // urban field
    if (city > 0) {
      const n = tier === 'mobile' ? 500 : tier === 'standard' ? 900 : URBAN.length;
      g.fillStyle = `rgba(241,236,226,${0.16 * city})`;
      for (let i = 0; i < n; i++) { const pt = URBAN[i]; g.fillRect(X(pt.x), Y(pt.y), 1.1, 1.1); }
      g.strokeStyle = `rgba(137,130,120,${0.5 * city})`; g.lineWidth = 1;
      g.beginPath(); RIVER.forEach((pt, i) => (i ? g.lineTo(X(pt.x), Y(pt.y)) : g.moveTo(X(pt.x), Y(pt.y)))); g.stroke();
      LAKES.forEach(l => { g.beginPath(); g.ellipse(X(l.x), Y(l.y), l.r * S, l.r * S * 0.7, 0, 0, Math.PI * 2); g.stroke(); });
    }

    // the points
    const R = Math.min(w, h) * 0.22;
    POSITIONS.forEach((pt, i) => {
      const di = Math.floor(i / 7), oi = i % 7;
      const a7 = (di / 7) * Math.PI * 2 - Math.PI / 2;
      const sx = cx + Math.cos(a7) * R, sy = cy + Math.sin(a7) * R;          // seven
      const a49 = (oi / 7) * Math.PI * 2;
      const fx = sx + Math.cos(a49) * R * 0.28, fy = sy + Math.sin(a49) * R * 0.28; // forty-nine
      let x = lerp(cx, sx, seven), y = lerp(cy, sy, seven);
      x = lerp(x, fx, fortyNine); y = lerp(y, fy, fortyNine);
      x = lerp(x, X(pt.x), city); y = lerp(y, Y(pt.y), city);
      const visible = oi === 0 ? (di === 0 ? one : seven) : fortyNine;
      if (visible <= 0) return;
      let alpha = visible, r = 2.4;
      if (night) {
        const home = HOMES[i];
        const lit = !!home.status && home.status !== 'AVAILABLE';
        alpha = lit ? 1 : 0.28; r = lit ? 3.2 : 2;
        if (isolate > 0 && i !== 24) alpha *= 1 - isolate * 0.85;
        if (isolate > 0 && i === 24) { alpha = 1; r = 2.4 + isolate * 2.4; }
      }
      g.fillStyle = `rgba(${gold},${alpha})`;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
      if (night && isolate > 0 && i === 24) {
        g.strokeStyle = `rgba(${gold},${0.4 * isolate})`; g.beginPath(); g.arc(x, y, 14 + isolate * 10, 0, Math.PI * 2); g.stroke();
      }
    });
  }, [stage, night, isolate, tier]);

  return <canvas ref={ref} className="city-field" role="img" aria-label={label} />;
}
