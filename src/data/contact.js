/**
 * A private conversation: the quiet way in.
 *
 * The section is shown when `enabled` is true. The form itself appears once
 * there is somewhere for it to go: an `endpoint` (a form service such as
 * Formspree / Basin / your own function, which receives a JSON POST) or,
 * failing that, an `email` (the form opens the visitor's mail app with the
 * message written out). WhatsApp and phone are shown as links when set.
 *
 * Keep the tone flat: no urgency, no scarcity, none of the banned phrases in
 * command-center/brand/BRAND_BIBLE.md ("enquire now", "book now", ...).
 * Any field left empty is simply not shown.
 */
export const CONTACT = {
  enabled: true,
  eyebrow: 'A private commission',
  line: 'Request a private commission.',
  note: 'Tell us about your land, your family and the life you want the architecture to hold. Every enquiry is considered personally.',
  name: '',
  email: '',
  endpoint: '',
  whatsapp: '', // international format, e.g. '+91 90000 00000'
  phone: '',
  instagram: '', // handle without the @
  // Once registered, RERA requires the registration number and the authority
  // website on advertising, e.g. 'TG RERA Reg. No. ... · rera.telangana.gov.in'
  rera: '',
};

export default CONTACT;
