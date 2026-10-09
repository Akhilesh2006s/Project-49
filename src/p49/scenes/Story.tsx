import { BRAND } from '../config/brand';
import { DIALOGUES } from '../data/dialogues';

/**
 * PROJECT 49 / STORY. Factual attribution of where the initiative came from.
 * Deliberately editorial, and deliberately far from any enquiry action.
 */
export default function Story() {
  return (
    <section id="story" className="story" aria-labelledby="story-title">
      <p className="label">{BRAND.projectName} / Story</p>
      <h2 id="story-title" className="monument-sm">Why {BRAND.projectName} exists</h2>
      <div className="story-body narrative">
        <p>{BRAND.projectName} began with a question:</p>
        <p className="story-question">What if a private home were designed not merely around what its occupants need to contain, but around how they experience space?</p>
        <p>The initiative was conceived by {BRAND.authorName} as an exploration of how light, air, nature, sound, memory, movement, proportion, culture and change can become meaningful starting points for residential design.</p>
        <p>{BRAND.projectName} develops that question through seven architectural dialogues:</p>
        <p className="story-dialogues">{DIALOGUES.map(d => <span key={d.id}>{d.id}.</span>)}</p>
        <p>Seven individually authored residences explore each dialogue. Forty-nine homes. No repeated designs.</p>
        <p className="story-close"><em>What repeats is not the architecture. What repeats is the question.</em></p>
      </div>
    </section>
  );
}
