// Environmental recordings. Sources and license: public/audio/CREDITS.md.
const TRACKS={LIGHT:['morning-birds',.3],AIR:['breeze',.65],ART:['breeze',.08],ROOTS:['morning-birds',.2],EARTH:['garden',.45],SILENCE:['water',.16],FUTURE:['water',.2]};
export class Soundscape {
 constructor(){this.cache=new Map();this.generation=0;this.layers=new Set();}
 async start(){if(!this.ctx){this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.5;this.master.connect(this.ctx.destination);}await this.ctx.resume();}
 volume(v){if(this.ctx)this.master.gain.setTargetAtTime(v,this.ctx.currentTime,.15);}
 async load(name){if(!this.cache.has(name))this.cache.set(name,fetch(`/audio/${name}.mp3`).then(r=>{if(!r.ok)throw new Error('Audio unavailable');return r.arrayBuffer();}).then(b=>this.ctx.decodeAudioData(b)).catch(e=>{this.cache.delete(name);throw e;}));return this.cache.get(name);}
 async scene(id,sceneId=''){
  if(!this.ctx)return;const token=++this.generation;let[name,level]=TRACKS[id]||TRACKS.LIGHT;
  if(id==='FUTURE'&&sceneId==='screen'){name='breeze';level=.045;}
  if(id==='AIR'&&sceneId==='trace'){name='water';level=.2;}
  if(id==='EARTH'&&sceneId==='stone'){name='breeze';level=.15;}
  try{const buffer=await this.load(name);if(token!==this.generation||this.ctx.state==='closed')return;const c=this.ctx,now=c.currentTime;
   for(const old of this.layers){old.gain.gain.cancelScheduledValues(now);old.gain.gain.setTargetAtTime(0,now,.35);try{old.source.stop(now+2);}catch{}}
   const source=c.createBufferSource(),gain=c.createGain(),copy=c.createBuffer(buffer.numberOfChannels,buffer.length,buffer.sampleRate),fade=Math.min(Math.floor(buffer.sampleRate*.08),buffer.length/2);
   for(let channel=0;channel<buffer.numberOfChannels;channel++){const a=copy.getChannelData(channel);a.set(buffer.getChannelData(channel));for(let i=0;i<fade;i++){a[i]*=i/fade;a[a.length-1-i]*=i/fade;}}
   source.buffer=copy;source.loop=true;gain.gain.value=0;source.connect(gain);gain.connect(this.master);gain.gain.setTargetAtTime(level,now,.7);
   const layer={source,gain};this.layers.add(layer);source.onended=()=>{source.disconnect();gain.disconnect();this.layers.delete(layer);};source.start();
  }catch(e){console.warn('Environmental audio could not load',e);}
 }
 suspend(){return this.ctx?.suspend();}dispose(){this.generation++;this.ctx?.close();this.cache.clear();}
}
