// Environmental recordings. Sources and license: public/audio/CREDITS.md.
//
// Every film has its own sound: a looping bed, plus an optional accent played
// once as the film begins ([file, level, delay s]). Opening another film or
// idea cuts straight to its sound. The home page and SILENCE are silent.
// Levels are balanced against each file's measured loudness, so a quiet
// recording can sit at 0.9 and a loud one at 0.06 and still feel even.

const HOME = { bed: null }; // no sound on the home page

const IDEAS = {
  LIGHT: { bed: ['morning-birds', 0.25] },
  AIR: { bed: ['breeze', 0.16] },
  ART: { bed: ['art-room-tone', 0.06] },
  ROOTS: { bed: ['roots-courtyard-birds', 0.3] },
  EARTH: { bed: ['earth-garden-morning', 0.9] },
  SILENCE: { bed: null }, // pin-drop silence
  FUTURE: { bed: ['future-refrigerator-hum', 0.55] },
};

const SCENES = {
  // LIGHT — the day passing: dawn, daytime, evening
  gradient: { bed: ['morning-birds', 0.25] },
  day: { bed: ['garden', 0.9] },
  shadow: { bed: ['light-evening-crickets', 0.5] },
  // AIR — breeze outside, air moving through rooms, chimes in a doorway
  wind: { bed: ['breeze', 0.16] },
  breath: { bed: ['air-soft-wind-interior', 0.22] },
  trace: { bed: ['air-soft-wind-interior', 0.16], accent: ['air-wind-chimes', 0.2, 0.8] },
  // ART — a quiet gallery room
  gallery: { bed: ['art-room-tone', 0.06], accent: ['art-footsteps', 0.8, 0.6] },
  mural: { bed: ['art-room-tone', 0.07] },
  sculpture: { bed: ['art-room-tone', 0.06], accent: ['art-stone-scratch', 0.28, 1.2] },
  // ROOTS — a courtyard house, a heavy door, hand work on stone
  'root-entrance': { bed: ['roots-courtyard-birds', 0.3], accent: ['roots-wooden-door', 0.45, 0.5] },
  'root-material': { bed: ['roots-courtyard-birds', 0.26], accent: ['art-stone-scratch', 0.26, 1.4] },
  // EARTH — garden, stone underfoot, earth being worked
  garden: { bed: ['earth-garden-morning', 0.9] },
  stone: { bed: ['earth-walking-on-stones', 0.9] },
  courtyard: { bed: ['breeze', 0.1], accent: ['earth-digging', 0.7, 0.8] },
  // SILENCE — nothing at all
  silence: { bed: null },
  // FUTURE — a quiet home hum with small signs of technology
  grown: { bed: ['future-refrigerator-hum', 0.55], accent: ['future-water-bubble', 0.35, 1] },
  'smart-glass': { bed: ['future-refrigerator-hum', 0.45], accent: ['future-glass-slide', 0.6, 1] },
  'ceiling-tv': { bed: ['future-refrigerator-hum', 0.45], accent: ['future-power-up', 0.07, 0.8] },
};

// Films of each idea, in order, so an idea's sounds can load as soon as it opens.
const IDEA_FILMS = {
  LIGHT: ['gradient', 'day', 'shadow'], AIR: ['wind', 'breath', 'trace'], ART: ['gallery', 'mural', 'sculpture'],
  ROOTS: ['root-entrance', 'root-material'], EARTH: ['garden', 'stone', 'courtyard'], SILENCE: ['silence'],
  FUTURE: ['grown', 'smart-glass', 'ceiling-tv'],
};
const ORDER = Object.keys(IDEA_FILMS);

export class Soundscape {
  constructor() { this.cache = new Map(); this.generation = 0; this.bed = null; this.accents = new Set(); }

  async start() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.5; this.master.connect(this.ctx.destination);
    }
    await this.ctx.resume();
  }

  volume(v) { if (this.ctx) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.15); }

  load(name) {
    if (!this.cache.has(name)) {
      this.cache.set(name, fetch(`/audio/${name}.mp3`)
        .then(r => { if (!r.ok) throw new Error(`Audio unavailable: ${name}`); return r.arrayBuffer(); })
        .then(b => this.ctx.decodeAudioData(b))
        .then(buffer => { // short fades at both ends so loops and accents never click
          const fade = Math.min(Math.floor(buffer.sampleRate * 0.08), Math.floor(buffer.length / 2));
          for (let ch = 0; ch < buffer.numberOfChannels; ch++) { const a = buffer.getChannelData(ch); for (let i = 0; i < fade; i++) { a[i] *= i / fade; a[a.length - 1 - i] *= i / fade; } }
          return buffer;
        })
        .catch(e => { this.cache.delete(name); throw e; }));
    }
    return this.cache.get(name);
  }

  // quick fade (about a tenth of a second) so a switch sounds like a cut, not a click
  fadeOut(layer, now) {
    if (!layer) return;
    layer.gain.gain.cancelScheduledValues(now); layer.gain.gain.setTargetAtTime(0, now, 0.05);
    try { layer.source.stop(now + 0.4); } catch {}
  }

  // load this idea's sounds, and the next idea's first one, in the background
  preload(id) {
    if (!IDEA_FILMS[id]) return;
    const next = ORDER[(ORDER.indexOf(id) + 1) % ORDER.length];
    const films = [...IDEA_FILMS[id], IDEA_FILMS[next][0]];
    for (const film of films) {
      const spec = SCENES[film] || {};
      for (const part of [spec.bed, spec.accent]) if (part) this.load(part[0]).catch(() => {});
    }
  }

  async scene(id, sceneId = '') {
    if (!this.ctx) return;
    const token = ++this.generation;
    const spec = id === 'HOME' ? HOME : (SCENES[sceneId] || IDEAS[id] || HOME);
    const c = this.ctx;
    try {
      const now = c.currentTime;
      for (const accent of this.accents) this.fadeOut(accent, now);
      this.accents.clear();
      this.preload(id);
      const [bedName, bedLevel] = spec.bed || [];
      if (bedName && this.bed && this.bed.name === bedName && this.bed.idea === id) {
        // next film of the same idea shares this recording: keep it running
        this.bed.gain.gain.cancelScheduledValues(now); this.bed.gain.gain.setTargetAtTime(bedLevel, now, 0.3);
      } else {
        // stop what was playing right away, before the new sound has loaded
        this.fadeOut(this.bed, now); this.bed = null;
        if (!bedName) return;
        const buffer = await this.load(bedName);
        if (token !== this.generation || c.state === 'closed') return;
        const start = c.currentTime;
        const source = c.createBufferSource(), gain = c.createGain();
        source.buffer = buffer; source.loop = true; gain.gain.value = 0;
        source.connect(gain); gain.connect(this.master); gain.gain.setTargetAtTime(bedLevel, start, 0.25);
        source.onended = () => { source.disconnect(); gain.disconnect(); };
        source.start();
        this.bed = { name: bedName, idea: id, source, gain };
      }
      if (spec.accent) {
        const [name, level, delay = 0] = spec.accent;
        const buffer = await this.load(name);
        if (token !== this.generation || c.state === 'closed') return;
        const source = c.createBufferSource(), gain = c.createGain();
        source.buffer = buffer; gain.gain.value = level; source.connect(gain); gain.connect(this.master);
        const layer = { source, gain }; this.accents.add(layer);
        source.onended = () => { source.disconnect(); gain.disconnect(); this.accents.delete(layer); };
        source.start(c.currentTime + delay);
      }
    } catch (e) { console.warn('Environmental audio could not load', e); }
  }

  suspend() { return this.ctx?.suspend(); }
  dispose() { this.generation++; this.ctx?.close(); this.cache.clear(); }
}
