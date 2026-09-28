import { useState } from 'react';
import { Button } from '../../buttons/Button';

const ORG_TYPES = [
  'CSR / Corporate',
  'School',
  'College / University',
  'NGO / Foundation',
  'Professional Network',
  'Individual / Other'
];

export function PartnerForm() {
  const [formData, setFormData] = useState({
    orgName: '',
    contactPerson: '',
    email: '',
    mobile: '',
    orgType: '',
    city: '',
    interest: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ orgName: '', contactPerson: '', email: '', mobile: '', orgType: '', city: '', interest: '', message: '' });
    }, 1000);
  };

  if (isSuccess) {
    return (
      <section id="partner-form" className="section-padding bg-background border-b border-border/50">
        <div className="container-default max-w-3xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
          <h2 className="text-h2 mb-4">Enquiry Submitted Successfully</h2>
          <p className="text-body-large text-content-secondary mb-8">
            Thank you for your interest in partnering with Shiksha Sankalp Foundation. Our team will review your details and contact you shortly to begin the conversation.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            Submit Another Enquiry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="partner-form" className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto">
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h2 className="text-h2 mb-4">Partnership Enquiry</h2>
          <p className="text-body-large text-content-secondary max-w-2xl">
            Please provide details about your organisation and how you envision collaborating with us.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-surface-muted/30 border border-border/60 rounded-xl p-6 md:p-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="orgName" className="text-sm font-bold text-content-primary">
                Organisation Name <span className="text-brand-primary">*</span>
              </label>
              <input 
                type="text" 
                id="orgName" 
                required 
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                placeholder="Company, School, or Foundation Name"
                value={formData.orgName}
                onChange={e => setFormData(prev => ({...prev, orgName: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="contactPerson" className="text-sm font-bold text-content-primary">
                Contact Person <span className="text-brand-primary">*</span>
              </label>
              <input 
                type="text" 
                id="contactPerson" 
                required 
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                placeholder="Full Name"
                value={formData.contactPerson}
                onChange={e => setFormData(prev => ({...prev, contactPerson: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-bold text-content-primary">
                Official Email <span className="text-brand-primary">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                required
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                placeholder="name@organization.com"
                value={formData.email}
                onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile" className="text-sm font-bold text-content-primary">
                Mobile Number <span className="text-brand-primary">*</span>
              </label>
              <input 
                type="tel" 
                id="mobile" 
                required 
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                placeholder="+91 98765 43210"
                value={formData.mobile}
                onChange={e => setFormData(prev => ({...prev, mobile: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="orgType" className="text-sm font-bold text-content-primary">
                Organisation Type <span className="text-brand-primary">*</span>
              </label>
              <select
                id="orgType"
                required
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary appearance-none"
                value={formData.orgType}
                onChange={e => setFormData(prev => ({...prev, orgType: e.target.value}))}
              >
                <option value="" disabled>Select Type</option>
                {ORG_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="city" className="text-sm font-bold text-content-primary">
                City / Location <span className="text-brand-primary">*</span>
              </label>
              <input 
                type="text" 
                id="city" 
                required 
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                placeholder="Delhi, Mumbai, etc."
                value={formData.city}
                onChange={e => setFormData(prev => ({...prev, city: e.target.value}))}
              />
            </div>
          </div>
          
          <div className="mb-6 flex flex-col gap-2">
            <label htmlFor="interest" className="text-sm font-bold text-content-primary">
              Area of Interest <span className="text-brand-primary">*</span>
            </label>
            <input 
              type="text" 
              id="interest" 
              required
              className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
              placeholder="e.g., CSR Funding, Volunteer Drive, Material Donation"
              value={formData.interest}
              onChange={e => setFormData(prev => ({...prev, interest: e.target.value}))}
            />
          </div>
          
          <div className="mb-10 flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-bold text-content-primary">
              Message / Proposal <span className="text-content-muted font-normal ml-1">(Optional)</span>
            </label>
            <textarea 
              id="message" 
              rows={4}
              className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary resize-y"
              placeholder="Briefly describe how you'd like to collaborate..."
              value={formData.message}
              onChange={e => setFormData(prev => ({...prev, message: e.target.value}))}
            />
          </div>
          
          <div className="pt-6 border-t border-border/60">
            <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto px-10" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
            </Button>
            <p className="text-xs text-content-muted mt-4">
              We respect your privacy. Your information will only be used to contact you regarding potential partnerships.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
