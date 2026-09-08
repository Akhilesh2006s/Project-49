import {useEffect,useRef} from 'react';
export default function IdeaPreview({chapter,hidden}){
 const ref=useRef(null),scene=chapter.scenes.find(s=>s.video)||chapter.scenes[0];
 useEffect(()=>{const video=ref.current;if(!video)return;let visible=false;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>{if(visible&&!hidden&&!document.hidden&&!reduced.matches)video.play().catch(()=>{});else video.pause();};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.1});observer.observe(video);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);video.pause();};
 },[scene,hidden]);
 return <div className="preview-media" key={chapter.id}><img src={scene.poster} alt={`${chapter.id.toLowerCase()} architectural study`}/>{scene.video&&<video ref={ref} src={scene.video} poster={scene.poster} muted loop playsInline preload="metadata" aria-hidden="true"/>}</div>;
}
