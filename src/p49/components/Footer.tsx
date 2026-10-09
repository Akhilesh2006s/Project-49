import { BRAND } from '../config/brand';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-lockup">
        <p className="footer-name">{BRAND.projectName}</p>
        <p className="label">{BRAND.projectDescriptor} · {BRAND.lockup}</p>
        <p className="label">{BRAND.designBrand} — {BRAND.designRole} · {BRAND.executionBrand} — {BRAND.executionRole} · {BRAND.location}</p>
      </div>
      <nav className="footer-nav label" aria-label="Footer">
        <a href="#story">Story</a><a href="#human-index">Human Index</a><a href="#the-49">The 49</a><a href="#enquiries">Enquiries</a>
        <a href="?classic">Previous site</a>
      </nav>
      <div className="footer-legal">
        {BRAND.companyLegalName && <p>{BRAND.companyLegalName}</p>}
        {BRAND.individualProfessionalTitle && <p>{BRAND.individualProfessionalTitle}</p>}
        {BRAND.registrationDisclosure && <p>{BRAND.registrationDisclosure}</p>}
        {BRAND.professionalServicesWording && <p>{BRAND.professionalServicesWording}</p>}
        <p>{BRAND.footerLegal}</p>
        <p>© {new Date().getFullYear()} {BRAND.projectName}</p>
      </div>
    </footer>
  );
}
