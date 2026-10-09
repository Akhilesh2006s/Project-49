/**
 * AudioEngine — sound as space.
 *
 * Two kinds of layer:
 *  - beds: recorded environments from /public/audio (crossfaded, one at a time)
 *  - synthesised layers that track the narrative: city pressure (filtered
 *    noise), a low architectural drone, a mechanical hum, and density (the
 *    cognitive load of the sensory-overload sequence).
 *
 * The AudioContext is only created inside a user gesture (the Sound Gateway),
 * which satisfies browser autoplay rules. Everything is released in dispose().
 */
type Layer = 'city' | 'drone' | 'hum' | 'density';

class Engine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private layers = new Map<Layer, { gain: GainNode; nodes: AudioNode[] }>();
  private buffers = new Map<string, Promise<AudioBuffer | null>>();
  private bed: { name: string; src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private wanted: string | null = null;
  private listeners = new Set<(on: boolean) => void>();
  enabled = false;

  get ready() { return !!this.ctx; }

  /** Must be called from a click/tap handler. */
  async unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.85;
      this.duckGain = this.ctx.createGain();
      this.duckGain.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.buildLayers();
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.setEnabled(true);
    return true;
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(on ? 0.85 : 0, t, 0.25);
      if (on && this.ctx.state === 'suspended') void this.ctx.resume();
    }
    this.listeners.forEach(l => l(on));
  }

  onChange(fn: (on: boolean) => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }

  private noiseBuffer(ctx: AudioContext, brown = true) {
    const len = ctx.sampleRate * 4, buf = ctx.createBuffer(1, len, ctx.sampleRate), data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) { last = (last + 0.02 * white) / 1.02; data[i] = last * 3.5; } else data[i] = white;
    }
    return buf;
  }

  private buildLayers() {
    const ctx = this.ctx!, out = this.duckGain!;
    const mk = (name: Layer, build: (g: GainNode) => AudioNode[]) => {
      const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(out);
      this.layers.set(name, { gain, nodes: build(gain) });
    };
    mk('city', g => {
      const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer(ctx); src.loop = true;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      const pan = ctx.createStereoPanner();
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.35; lfo.connect(lfoGain).connect(pan.pan);
      src.connect(lp).connect(pan).connect(g); src.start(); lfo.start();
      return [src, lp, pan, lfo, lfoGain];
    });
    mk('drone', g => {
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220; lp.connect(g);
      const oscs = [41.2, 41.6, 61.7].map((f, i) => {
        const o = ctx.createOscillator(); o.type = i === 2 ? 'triangle' : 'sine'; o.frequency.value = f;
        const og = ctx.createGain(); og.gain.value = i === 2 ? 0.12 : 0.35; o.connect(og).connect(lp); o.start(); return [o, og];
      }).flat();
      return [lp, ...oscs];
    });
    mk('hum', g => {
      const oscs = [100, 200, 300].map((f, i) => {
        const o = ctx.createOscillator(); o.frequency.value = f;
        const og = ctx.createGain(); og.gain.value = [0.3, 0.12, 0.05][i]; o.connect(og).connect(g); o.start(); return [o, og];
      }).flat();
      return oscs;
    });
    mk('density', g => {
      const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer(ctx, false); src.loop = true;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 0.7;
      const tone = ctx.createOscillator(); tone.type = 'sawtooth'; tone.frequency.value = 138;
      const tlp = ctx.createBiquadFilter(); tlp.type = 'lowpass'; tlp.frequency.value = 500;
      const tg = ctx.createGain(); tg.gain.value = 0.08;
      src.connect(bp).connect(g); tone.connect(tlp).connect(tg).connect(g); src.start(); tone.start();
      return [src, bp, tone, tlp, tg];
    });
  }

  /** Set a synthesised layer's level (0..1) with a smooth ramp. */
  layer(name: Layer, level: number, seconds = 0.6) {
    const l = this.layers.get(name); if (!l || !this.ctx) return;
    const max = { city: 0.22, drone: 0.5, hum: 0.05, density: 0.12 }[name];
    l.gain.gain.setTargetAtTime(Math.max(0, Math.min(1, level)) * max, this.ctx.currentTime, Math.max(0.01, seconds / 3));
  }

  /** Everything recorded or synthesised passes through here; 0 = silent, 1 = normal. */
  duck(level: number, seconds = 1.2) {
    if (!this.ctx || !this.duckGain) return;
    this.duckGain.gain.setTargetAtTime(level, this.ctx.currentTime, Math.max(0.01, seconds / 3));
  }

  private load(name: string) {
    if (!this.buffers.has(name)) {
      this.buffers.set(name, fetch(`/audio/${name}.mp3`)
        .then(r => (r.ok ? r.arrayBuffer() : Promise.reject()))
        .then(b => this.ctx!.decodeAudioData(b))
        .catch(() => null));
    }
    return this.buffers.get(name)!;
  }

  /** Crossfade to a recorded environment. `null` fades to nothing. */
  async bedTo(name: string | null, level = 0.4, fade = 1.4) {
    this.wanted = name;
    if (!this.ctx || !this.duckGain) return;
    if (this.bed?.name === name) { this.bed.gain.gain.setTargetAtTime(level, this.ctx.currentTime, fade / 3); return; }
    const old = this.bed; this.bed = null;
    if (old) { old.gain.gain.setTargetAtTime(0, this.ctx.currentTime, fade / 3); const s = old.src; setTimeout(() => { try { s.stop(); } catch { /* */ } }, fade * 2000); }
    if (!name) return;
    const buf = await this.load(name);
    if (!buf || this.wanted !== name || !this.ctx) return;
    const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const gain = this.ctx.createGain(); gain.gain.value = 0;
    src.connect(gain).connect(this.duckGain); src.start();
    gain.gain.setTargetAtTime(level, this.ctx.currentTime, fade / 3);
    this.bed = { name, src, gain };
  }

  /** A one-shot recorded sound. */
  async once(name: string, level = 0.5) {
    if (!this.ctx || !this.enabled) return;
    const buf = await this.load(name); if (!buf || !this.ctx) return;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const g = this.ctx.createGain(); g.gain.value = level; src.connect(g).connect(this.duckGain!); src.start();
  }

  /** A door closing: a low thud, and the city is gone. */
  doorClose() {
    if (!this.ctx) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const src = ctx.createBufferSource(); src.buffer = this.noiseBuffer(ctx);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 140;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    src.connect(lp).connect(g).connect(this.duckGain!); src.start(t); src.stop(t + 0.6);
    this.layer('city', 0, 0.12); this.layer('density', 0, 0.12);
  }

  /** A soft architectural "breath" used on major reveals. */
  swell(seconds = 3) {
    this.layer('drone', 0.9, seconds * 0.4);
    setTimeout(() => this.layer('drone', 0.25, seconds), seconds * 500);
  }

  suspend() { if (this.ctx && this.ctx.state === 'running') void this.ctx.suspend(); }
  resume() { if (this.ctx && this.enabled && this.ctx.state === 'suspended') void this.ctx.resume(); }

  dispose() {
    this.layers.forEach(l => l.nodes.forEach(n => { try { (n as AudioScheduledSourceNode).stop?.(); } catch { /* */ } n.disconnect(); }));
    this.layers.clear();
    try { this.bed?.src.stop(); } catch { /* */ }
    this.bed = null;
    void this.ctx?.close();
    this.ctx = null;
  }
}

export const audio = new Engine();
export type { Layer };
