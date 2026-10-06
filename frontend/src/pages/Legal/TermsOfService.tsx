import { Link } from 'react-router-dom';

export default function TermsOfService() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container-default max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm font-medium text-content-tertiary mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-content-primary">Terms of Service</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-content-secondary text-sm">
            Last Updated: October 2026 | Siksha Sankalp Foundation
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-content-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you agree to comply with and be bound by the following terms and conditions of use. If you disagree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">2. Donations &amp; Tax Deductions (80G)</h2>
            <p className="mb-2">
              All donations made to Siksha Sankalp Foundation are utilized strictly towards charitable and educational initiatives, child welfare, digital literacy, and community support in accordance with our trust deed and Indian non-profit regulations.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Donations are eligible for tax deduction under Section 80G of the Income Tax Act, 1961, subject to accurate submission of donor PAN and details.</li>
              <li>Receipts are generated electronically and dispatched via registered email upon payment confirmation.</li>
              <li>Donations once completed are voluntary and non-refundable. If a duplicate deduction occurs due to technical gateway issues, please reach out to us within 7 days for review.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">3. Intellectual Property Rights</h2>
            <p>
              The content, graphics, photographs, branding, logo, and digital media published on this site are protected by copyright and intellectual property laws. Reproduction, modification, or distribution without prior written authorization from Siksha Sankalp Foundation is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">4. Volunteer Participation &amp; Code of Conduct</h2>
            <p>
              Individuals volunteering with Siksha Sankalp Foundation agree to uphold values of empathy, integrity, and child safety. Any discrimination, harassment, or misuse of foundation resources or access to vulnerable communities will result in immediate disqualification and legal remedies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">5. Disclaimer &amp; Limitation of Liability</h2>
            <p>
              While we strive to keep information accurate and up-to-date, Siksha Sankalp Foundation makes no warranties regarding the absolute completeness or reliability of website contents. In no event shall the foundation be liable for indirect or consequential damages arising from website usage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">6. Governing Law &amp; Jurisdiction</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising in connection with the website or services shall be subject to the exclusive jurisdiction of the competent courts in Gautam Buddha Nagar, Uttar Pradesh.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">7. Contact Information</h2>
            <p className="mb-2">For any questions concerning these Terms of Service, please contact us at:</p>
            <div className="bg-surface-muted border border-border/70 rounded-xl p-4 mt-3 text-sm">
              <p className="font-semibold text-content-primary">Siksha Sankalp Foundation</p>
              <p>KH-103, Alawardi Pur, Near Durga Mandir,</p>
              <p>Gautam Buddha Nagar, Uttar Pradesh – 201308</p>
              <p className="mt-2">Email: <a href="mailto:info@sikshasankalp.org" className="text-primary hover:underline">info@sikshasankalp.org</a></p>
              <p>Phone: <a href="tel:+918287843477" className="text-primary hover:underline">+91 82878 43477</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
