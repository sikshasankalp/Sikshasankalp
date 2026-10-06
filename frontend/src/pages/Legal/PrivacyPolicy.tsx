import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container-default max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm font-medium text-content-tertiary mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-content-primary">Privacy Policy</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-content-secondary text-sm">
            Last Updated: October 2026 | Siksha Sankalp Foundation
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-content-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">1. Introduction</h2>
            <p>
              Siksha Sankalp Foundation (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy and personal data. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you visit our website, make a donation, apply to volunteer, or interact with our community programs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">2. Information We Collect</h2>
            <p className="mb-2">We may collect personal identification information from you in several ways, including but not limited to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Information:</strong> Full name, email address, phone number, and mailing address when you donate, register as a volunteer, or contact us.</li>
              <li><strong>Donation &amp; Tax Compliance Data:</strong> PAN number, billing address, and transaction metadata required under the Indian Income Tax Act to issue official 80G tax-exemption receipts.</li>
              <li><strong>Volunteer &amp; Career Information:</strong> Resume details, educational background, skills, and areas of interest submitted through volunteer application forms.</li>
              <li><strong>Technical Data:</strong> Browser type, operating system, IP address, and usage timestamps collected automatically to ensure website security and performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To issue official donation receipts and 80G certificates.</li>
              <li>To process and coordinate volunteer applications and social impact partnerships.</li>
              <li>To send updates, newsletters, and project reports regarding the children and communities we support (you may opt out at any time).</li>
              <li>To respond to your inquiries, questions, and feedback submitted via our contact channels.</li>
              <li>To comply with regulatory, legal, and statutory obligations under Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">4. Payment Security &amp; Financial Details</h2>
            <p>
              We do <strong>not</strong> store credit card, debit card, or net banking passwords on our servers. All financial transactions are securely processed through RBI-authorized payment gateways (such as Razorpay / Cashfree) adhering to stringent PCI-DSS standards with end-to-end SSL/TLS encryption.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">5. Data Sharing and Disclosure</h2>
            <p>
              Siksha Sankalp Foundation does not sell, rent, or trade your personal information to third parties. We may disclose information only:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>To trusted service providers who assist us in operating our digital platforms and communication systems (under confidentiality agreements).</li>
              <li>When required by law, court order, or governmental authorities to comply with statutory legal requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">6. Contact &amp; Grievance Redressal</h2>
            <p className="mb-2">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our administrative office:
            </p>
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
