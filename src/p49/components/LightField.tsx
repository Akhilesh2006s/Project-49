import { useEffect, useRef } from 'react';
import { useMotion } from '../hooks/motion';
import { FRAG, VERT } from '../shaders/lightField';

/** WebGL daylight. Falls back to a CSS gradient when WebGL is off, on mobile, or under reduced motion. */
export default function LightField({ sun, className = '' }: { sun: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const sunRef = useRef(sun);
  const { webgl, tier, reduced } = useMotion();
  sunRef.current = sun;
  const enabled = webgl && tier !== 'mobile' && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const c = ref.current!;
    const gl = c.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!; gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u('u_res'), uTime = u('u_time'), uSun = u('u_sun'), uQ = u('u_quality'), uMouse = u('u_mouse');
    const scale = tier === 'high' ? 0.75 : 0.5; // render resolution
    const mouse = [0.5, 0.5];
    const onMove = (e: PointerEvent) => { const r = c.getBoundingClientRect(); mouse[0] = (e.clientX - r.left) / r.width; mouse[1] = 1 - (e.clientY - r.top) / r.height; };
    window.addEventListener('pointermove', onMove, { passive: true });
    const fit = () => { c.width = c.clientWidth * scale; c.height = c.clientHeight * scale; gl.viewport(0, 0, c.width, c.height); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(c);
    let raf = 0, visible = true; const t0 = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) raf = requestAnimationFrame(draw); }); io.observe(c);
    function draw(now: number) {
      if (!visible) return;
      gl!.uniform2f(uRes, c.width, c.height); gl!.uniform1f(uTime, (now - t0) / 1000); gl!.uniform1f(uSun, sunRef.current);
      gl!.uniform1f(uQ, tier === 'high' ? 5 : 3); gl!.uniform2f(uMouse, mouse[0], mouse[1]);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove);
      gl.deleteBuffer(buf); gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs);
    };
  }, [enabled, tier]);

  if (!enabled) return <div className={'light-field-fallback ' + className} style={{ ['--sun' as string]: sun }} aria-hidden="true" />;
  return <canvas ref={ref} className={'light-field ' + className} aria-hidden="true" />;
}
