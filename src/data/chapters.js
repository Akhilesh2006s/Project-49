import scenes from './scenes';
const definitions = [
['LIGHT','A different home, every hour.','Sunlight, colour and shadow. Architecture that gives the passing hours a place to land.','Daylight / Shadow / Time'],
['AIR','Room to breathe.','A breeze through linen. A leaf in motion. Openings that invite the outside to move gently through your day.','Breeze / Flow / Openness'],
['ART','Live with what moves you.','A wall, an object, a moment of unexpected beauty. Art becomes part of the way you live.','Expression / Form / Collection'],
['ROOTS','A sense of belonging.','Stone, shade and the language of the courtyard. A home in conversation with Indian craft and the Deccan landscape.','Craft / Culture / Belonging'],
['EARTH','Stay close to the ground.','Living trees, tactile walls and stone with a history. The elements of earth woven into the everyday.','Stone / Soil / Growth'],
['SILENCE','Leave the world at the door.','Silence is not the absence of sound. It is the freedom to hear only what belongs at home.','Stillness / Water / Sanctuary'],
['FUTURE','A home that responds.','Food growing within reach. Technology integrated into the room. Thoughtful automation that makes daily life feel effortless.','Intelligence / Adaptation / Ease'],
];
export default definitions.map(([id,title,description,tags],i)=>({id,title,description,tags,number:String(i+1).padStart(2,'0'),scenes:id==='ROOTS'?[
{id:'root-entrance',video:'/scenes/17-root-entrance-clean.mp4',poster:'/scenes/17-root-entrance.jpg',eyebrow:'Belonging',line:['A home that','remembers its place.']},
{id:'root-material',video:'/scenes/18-root-material-clean.mp4',poster:'/scenes/18-root-material.jpg',eyebrow:'Material memory',line:['Local materials.','Lasting connections.']}
]:scenes.filter(s=>s.idea===id)}));
