/**
 * Every brand, role, credit and legal descriptor used on the site lives here,
 * so final professional / legal wording can change without touching components.
 * Review before public launch: /creative/pre-launch-content-review.md
 */
export const BRAND = {
  projectName: 'PROJECT 49',
  projectDescriptor: 'A NeuroArchitectural Initiative',
  initiativeBy: 'A NeuroArchitectural Initiative by AYRA',
  designBrand: 'AYRA',
  designRole: 'DESIGN',
  designScope: ['Architectural thinking', 'Spatial design', 'Interior architecture', 'Landscape integration', 'NeuroArchitectural exploration'],
  executionBrand: 'ANXA',
  executionRole: 'EXECUTION · CONSTRUCTION',
  executionScope: ['Construction', 'Site implementation', 'Engineering coordination', 'Project delivery'],
  location: 'HYDERABAD',
  lockup: '49 HOMES · 7 HUMAN EXPERIENCES · 1 CITY',
  /** Factual attribution. Shown only in the STORY section, never beside an enquiry action. */
  authorName: 'Saketh Bharadwaj',
  authorCredit: 'Conceived by Saketh Bharadwaj',
  /** Leave empty until reviewed. Rendered in the footer when set. */
  individualProfessionalTitle: '',
  registrationDisclosure: '',
  companyLegalName: '',
  professionalServicesWording: '',
  footerLegal: 'PROJECT 49 is an exploratory architectural initiative. Nothing on this site is a neurological, medical or investment claim.',
  enquiry: {
    heading: 'PROJECT 49 ENQUIRIES',
    submitLabel: 'SEND PROJECT 49 ENQUIRY',
    /** A form service that accepts a JSON POST (Formspree, Basin, your own function). */
    endpoint: '',
    /** Fallback: the enquiry is composed into a WhatsApp message. International digits only. */
    whatsapp: '919000443131',
    email: '',
  },
  siteUrl: 'https://project49-puce.vercel.app/',
} as const;

export type Brand = typeof BRAND;
