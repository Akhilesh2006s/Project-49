import { useState } from 'react';
import { DIALOGUES } from '../data/dialogues';
import { HOMES, STATUSES_PUBLISHED, STATUS_ORDER, isClosed } from '../data/collection';

/**
 * Part 28. The collection, as seven rows of seven. Statuses come only from
 * data/collection.ts; until they are published every position is neutral.
 */
export default function The49() {
  const [focus, setFocus] = useState<string | null>(null);
  const shown = HOMES.find(h => h.id === focus);
  return (
    <section id="the-49" className="the49" aria-labelledby="the49-title">
      <header className="the49-head">
        <p className="label">The 49</p>
        <h2 id="the49-title" className="monument-sm">Seven dialogues.<br />Seven residences each.<br /><em>There is no LIGHT 08.</em></h2>
      </header>
      <div className="the49-rows" role="table" aria-label="The forty-nine residences by dialogue">
        {DIALOGUES.map(d => (
          <div className="the49-row" role="row" key={d.id}>
            <span className="the49-name" role="rowheader"><span className="label">{d.index}</span>{d.id}</span>
            <span className="the49-points">
              {HOMES.filter(h => h.dialogue === d.id).map(h => (
                <button key={h.id} role="cell" className={'the49-point' + (h.status ? ` s-${h.status.toLowerCase().replace(/ /g, '-')}` : '')}
                  aria-label={`${h.id}${h.status ? `, ${h.status.toLowerCase()}` : ''}`} onMouseEnter={() => setFocus(h.id)} onFocus={() => setFocus(h.id)}>
                  <i />
                </button>
              ))}
            </span>
            <span className="label the49-state">{isClosed(d.id) ? `${d.id} commissions closed` : ''}</span>
          </div>
        ))}
      </div>
      <div className="the49-foot">
        <p className="label the49-readout" aria-live="polite">{shown ? `${shown.id}${shown.status ? ` · ${shown.status}` : ''}${shown.area ? ` · ${shown.area}` : ''}` : 'Seven of each. Once a dialogue’s seven are commissioned, it closes.'}</p>
        {STATUSES_PUBLISHED ? (
          <ul className="the49-legend label">{STATUS_ORDER.map(s => <li key={s}><i className={`s-${s.toLowerCase().replace(/ /g, '-')}`} />{s}</li>)}</ul>
        ) : (
          <p className="label the49-note">Individual statuses will be published here as commissions begin.</p>
        )}
      </div>
    </section>
  );
}
