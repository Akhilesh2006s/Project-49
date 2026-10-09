import { FormEvent, useState } from 'react';
import { BRAND } from '../config/brand';
import { DIALOGUES } from '../data/dialogues';

/**
 * PROJECT 49 ENQUIRIES. An enquiry about participating in the initiative,
 * kept separate from authorship and from any individual. Sends to a form
 * endpoint when configured; otherwise composes a WhatsApp message.
 */
const STAGES = ['Own land', 'Acquiring land', 'Exploring', 'Other'];

export default function Enquiries() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const { endpoint, whatsapp, email } = BRAND.enquiry;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (endpoint) {
      setState('sending');
      try {
        const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        setState(r.ok ? 'sent' : 'error');
      } catch { setState('error'); }
      return;
    }
    const text = [
      `${BRAND.projectName} enquiry`, `Name: ${data.name}`, `Email: ${data.email}`, `Phone: ${data.phone}`,
      `Land location: ${data.location}`, `Approximate land area: ${data.area}`, `Current stage: ${data.stage}`,
      `Dialogue of interest: ${data.dialogue || 'Not sure'}`, '', data.interest,
    ].join('\n');
    if (whatsapp) window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    else if (email) window.location.href = `mailto:${email}?subject=${encodeURIComponent(`${BRAND.projectName} enquiry`)}&body=${encodeURIComponent(text)}`;
    setState('sent');
  };

  return (
    <section id="enquiries" className="enquiries" aria-labelledby="enq-title">
      <div className="enq-head">
        <p className="label">{BRAND.projectName} / Land</p>
        <h2 id="enq-title" className="monument-sm">{BRAND.enquiry.heading}</h2>
        <p className="narrative">For landowners and families curious about taking part in {BRAND.projectName}. Every enquiry is read in full.</p>
      </div>
      {state === 'sent' ? (
        <p className="narrative enq-done" role="status">Thank you. Your enquiry has been prepared{whatsapp && !endpoint ? ' in WhatsApp — send it from there to reach us' : ''}.</p>
      ) : (
        <form className="enq-form" onSubmit={submit}>
          <label>Name<input name="name" required autoComplete="name" /></label>
          <label>Email<input name="email" type="email" autoComplete="email" /></label>
          <label>Phone<input name="phone" type="tel" required autoComplete="tel" /></label>
          <label>Land location<input name="location" autoComplete="address-level2" /></label>
          <label>Approximate land area<input name="area" placeholder="e.g. 1,200 sq yd" /></label>
          <label>Current stage
            <select name="stage" defaultValue=""><option value="" disabled>Select</option>{STAGES.map(s => <option key={s}>{s}</option>)}</select>
          </label>
          <fieldset className="enq-dialogues">
            <legend>Which dialogue are you most curious about? <span>(optional)</span></legend>
            {DIALOGUES.map(d => <label key={d.id} className="enq-chip"><input type="radio" name="dialogue" value={d.id} />{d.id}</label>)}
          </fieldset>
          <label className="enq-wide">What interested you about {BRAND.projectName}?<textarea name="interest" rows={4} /></label>
          <button type="submit" className="line-button" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : BRAND.enquiry.submitLabel} <span aria-hidden="true">→</span></button>
          {state === 'error' && <p role="alert" className="enq-error">That did not go through. Please try again in a moment.</p>}
        </form>
      )}
    </section>
  );
}
