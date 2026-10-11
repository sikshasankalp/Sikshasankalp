import { Link } from 'react-router-dom';

export default function RefundPolicy() {
  return (
    <div className="bg-background min-h-screen py-16">
      <div className="container-default max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <nav className="text-sm font-medium text-content-tertiary mb-3">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-content-primary">Cancellation &amp; Refund Policy</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-content-primary tracking-tight">
            Cancellation &amp; Refund Policy
          </h1>
          <p className="mt-2 text-content-secondary text-sm">
            Last Updated: October 2026 | Siksha Sankalp Foundation
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-10 shadow-sm space-y-8 text-content-secondary leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">1. General Policy on Donations</h2>
            <p>
              Siksha Sankalp Foundation is a registered non-profit organization dedicated to empowering underprivileged children and underserved communities through education, digital literacy, and basic human dignity. 
              As all donations made to our foundation are voluntary charitable contributions utilized immediately towards welfare projects and educational resources, donations are generally non-refundable once processed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">2. Exceptions &amp; Refund Eligibility</h2>
            <p className="mb-2">
              We understand that technical anomalies or accidental errors may occur during online transactions. We will gladly review and process refunds under the following exceptional circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Duplicate Transaction:</strong> If your card/account was debited more than once for the same donation due to network timeout or gateway glitch.</li>
              <li><strong>Technical Overcharge:</strong> If the deducted amount exceeds your intended donation due to an input or technical system error.</li>
              <li><strong>Unauthorized Charge:</strong> If you suspect that a fraudulent transaction was conducted using your card or bank account without your permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">3. How to Request a Refund</h2>
            <p className="mb-2">
              To request a refund, please notify us within <strong>7 days</strong> from the transaction date with the following details:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Donor Full Name</li>
              <li>Registered Email Address and Mobile Number</li>
              <li>Date and Amount of transaction</li>
              <li>Payment ID or Order ID (received via email / SMS receipt)</li>
              <li>Reason for requesting the refund with relevant payment confirmation screenshot</li>
            </ul>
            <p className="mt-3">
              Please send your written request to: <a href="mailto:sikshasankalpfoundation@gmail.com" className="text-primary font-medium hover:underline">sikshasankalpfoundation@gmail.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">4. Processing &amp; Refund Timeline</h2>
            <p>
              Upon receipt of your refund request, our finance team will verify the payment log with the payment gateway. If approved, the refund will be initiated within <strong>2 business days</strong>. 
              The refunded amount will be credited back directly to the original payment source (credit/debit card, net banking, or UPI account) within <strong>5 to 7 working days</strong>, depending on your bank&apos;s processing timeline.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">5. Impact on 80G Tax Exemption Certificates</h2>
            <p>
              If a donation is refunded, any electronic 80G tax-exemption receipt issued for that specific transaction shall stand officially cancelled and rendered void. The donor will not be eligible to claim tax benefits on the refunded sum under Section 80G of the Income Tax Act.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">6. Cancellation of Recurring Pledges</h2>
            <p>
              Donors who have set up recurring or monthly contributions can cancel future scheduled donations at any time by contacting our support team at least 5 business days before the next billing cycle. No further amounts will be deducted once the cancellation is confirmed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-content-primary mb-3">7. Grievance &amp; Contact Details</h2>
            <p className="mb-2">
              For any queries, issues, or refund support, please reach out to our team:
            </p>
            <div className="bg-background/60 p-4 rounded-xl border border-border text-sm space-y-1">
              <p><strong>Entity Name:</strong> Siksha Sankalp Foundation</p>
              <p><strong>Email:</strong> <a href="mailto:sikshasankalpfoundation@gmail.com" className="text-primary hover:underline">sikshasankalpfoundation@gmail.com</a></p>
              <p><strong>Contact Page:</strong> <Link to="/contact" className="text-primary hover:underline">sikshasankalp.com/contact</Link></p>
              <p><strong>Jurisdiction:</strong> Gautam Buddha Nagar, Uttar Pradesh, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
