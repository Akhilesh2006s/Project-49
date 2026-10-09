import { useEffect, useRef } from 'react';
import { DIMENSIONS, Scores } from '../data/humanIndex';
import { rng } from '../utils/math';

/**
 * A spatial fingerprint: the result drawn as a plan, not a chart.
 * CALM sizes the central court · MEMORY adds concentric thresholds ·
 * LIGHT cuts rays through the walls · NATURE scatters planting ·
 * NOVELTY breaks the geometry · ADAPTABILITY lays a modular grid ·
 * SOCIAL gathers a shared centre.
 */
export default function Fingerprint({ scores, seed, size = 520 }: { scores: Scores; seed: number; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, g = c.getContext('2d'); if (!g) return;
    const dpr = Math.min(devicePixelRatio || 1, 2); c.width = size * dpr; c.height = size * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const max = Math.max(1, ...DIMENSIONS.map(d => scores[d]));
    const n = (d: keyof Scores) => scores[d] / max;
    const r = rng(seed), cx = size / 2, cy = size / 2, R = size * 0.42;
    g.clearRect(0, 0, size, size);
    g.lineCap = 'round';

    // adaptability grid
    g.strokeStyle = `rgba(137,130,120,${0.08 + n('ADAPTABILITY') * 0.25})`; g.lineWidth = 0.6;
    const step = size / (6 + Math.round(n('ADAPTABILITY') * 10));
    for (let x = step; x < size; x += step) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, size); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(size, x); g.stroke(); }

    // walls: seven arcs, one per dimension, openings where the score is high (more permeability)
    DIMENSIONS.forEach((dim, i) => {
      const a0 = (i / 7) * Math.PI * 2 - Math.PI / 2, span = (Math.PI * 2) / 7;
      const opening = span * (0.15 + n(dim) * 0.55);
      const broken = n('NOVELTY') * (r() - 0.5) * 0.5;
      const rad = R * (0.72 + broken * 0.3);
      g.strokeStyle = 'rgba(241,236,226,0.85)'; g.lineWidth = 1.4 + (1 - n('CALM')) * 1.2;
      g.beginPath(); g.arc(cx, cy, rad, a0 + opening / 2, a0 + span - opening / 2); g.stroke();
    });

    // memory: concentric thresholds
    const rings = 1 + Math.round(n('MEMORY') * 4);
    g.strokeStyle = 'rgba(185,154,97,0.5)'; g.lineWidth = 0.8;
    for (let i = 1; i <= rings; i++) { g.beginPath(); g.arc(cx, cy, R * (0.72 + i * 0.05), 0, Math.PI * 2); g.setLineDash([2, 6 + i * 2]); g.stroke(); }
    g.setLineDash([]);

    // calm: the court
    const court = R * (0.15 + n('CALM') * 0.35);
    g.fillStyle = 'rgba(241,236,226,0.05)'; g.strokeStyle = 'rgba(241,236,226,0.4)';
    g.beginPath(); g.arc(cx, cy, court, 0, Math.PI * 2); g.fill(); g.stroke();

    // light: rays
    const rays = Math.round(n('LIGHT') * 9);
    for (let i = 0; i < rays; i++) {
      const a = r() * Math.PI * 2, w = 0.04 + r() * 0.05;
      const grad = g.createRadialGradient(cx, cy, court, cx, cy, R * 1.05);
      grad.addColorStop(0, 'rgba(241,236,226,0.22)'); grad.addColorStop(1, 'rgba(241,236,226,0)');
      g.fillStyle = grad; g.beginPath(); g.moveTo(cx + Math.cos(a) * court, cy + Math.sin(a) * court);
      g.arc(cx, cy, R * 1.05, a - w, a + w); g.closePath(); g.fill();
    }

    // nature: planting
    const plants = Math.round(n('NATURE') * 70);
    for (let i = 0; i < plants; i++) {
      const a = r() * Math.PI * 2, d = court * 0.3 + r() * (R * 0.95);
      const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, s = 1 + r() * 3.5;
      g.strokeStyle = 'rgba(137,130,120,0.7)'; g.lineWidth = 0.7; g.beginPath(); g.arc(x, y, s, 0, Math.PI * 2); g.stroke();
    }

    // social: the gathering centre
    const gather = 2 + n('SOCIAL') * 12;
    g.fillStyle = 'rgba(185,154,97,0.9)';
    for (let i = 0; i < Math.round(3 + n('SOCIAL') * 6); i++) { const a = (i / 9) * Math.PI * 2; g.beginPath(); g.arc(cx + Math.cos(a) * gather, cy + Math.sin(a) * gather, 2.2, 0, Math.PI * 2); g.fill(); }
  }, [scores, seed, size]);
  return <canvas ref={ref} className="fingerprint" style={{ width: size, height: size }} role="img" aria-label="Your spatial profile drawn as an abstract plan" />;
}
