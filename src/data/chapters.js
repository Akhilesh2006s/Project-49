import scenes from './scenes';
const definitions = [
['LIGHT','Houses planned around the sun.','Rooms are placed and openings cut so daylight moves through the house from morning to evening, and shade arrives where the afternoon is hottest.','Orientation / Openings / Shade'],
['AIR','Houses that breathe.','Cross-ventilation, courtyards and deep openings let the breeze pass through every room, so the house stays cool the way Deccan homes always have.','Ventilation / Courtyard / Openness'],
['ART','Walls built to hold art.','Gallery walls, murals and space for sculpture are designed into the house from the first drawing, not hung on it afterwards.','Gallery / Mural / Sculpture'],
['ROOTS','Built with Indian craft.','Carved stone, the threshold and the courtyard: houses made by hand, in the building language of the Deccan.','Craft / Material / Belonging'],
['EARTH','Built from the ground up.','Rammed-earth walls, natural stone and trees growing inside the house. Materials taken from the land and built back into it.','Stone / Earth / Garden'],
['SILENCE','Houses that keep the city out.','Thick walls, water and quiet courts. Each house is planned so the noise of the city stops at the door.','Stillness / Water / Sanctuary'],
['FUTURE','Houses that respond.','Smart glass, hidden screens and a kitchen that grows food, built in so technology is there when you need it and gone when you do not.','Glass / Automation / Growing'],
];
export default definitions.map(([id,title,description,tags],i)=>({id,title,description,tags,number:String(i+1).padStart(2,'0'),scenes:id==='ROOTS'?[
{id:'root-entrance',video:'/scenes/17-root-entrance-clean.mp4',poster:'/scenes/17-root-entrance.jpg',eyebrow:'Belonging',line:['An entrance','carved by hand.']},
{id:'root-material',video:'/scenes/18-root-material-clean.mp4',poster:'/scenes/18-root-material.jpg',eyebrow:'Material memory',line:['Local stone,','built to last generations.']}
]:scenes.filter(s=>s.idea===id)}));
