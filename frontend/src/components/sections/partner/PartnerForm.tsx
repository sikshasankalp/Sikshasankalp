import { useState } from 'react';
import { Button } from '../../buttons/Button';
import { SmoothInput } from '../../common/SmoothInput';
import { useLanguage } from "../../../context/LanguageContext";

const ORG_TYPES = [
  'CSR / Corporate',
  'School',
  'College / University',
  'NGO / Foundation',
  'Professional Network',
  'Individual / Other'
];

export function PartnerForm() {
    const { t } = useLanguage();
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
  const [error, setError] = useState<string | null>(null);
  const [botcheck, setBotcheck] = useState(false);

  const validateForm = () => {
    if (!formData.orgName.trim()) return 'Organisation Name is required.';
    if (!formData.contactPerson.trim()) return 'Contact Person is required.';
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid official email address.';
    }

    const mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (!formData.mobile.trim() || !mobileRegex.test(formData.mobile.replace(/\s/g, ''))) {
      return 'Please enter a valid Indian mobile number.';
    }

    if (!formData.orgType) return 'Organisation Type is required.';
    if (!formData.city.trim()) return 'City / Location is required.';
    if (!formData.interest.trim()) return 'Area of Interest is required.';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_PARTNER_ACCESS_KEY;
      if (!accessKey) {
        throw new Error('Form configuration is missing. Please contact support.');
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'New Partnership Enquiry — Siksha Sankalp Foundation',
          botcheck,
          orgName: formData.orgName,
          contactPerson: formData.contactPerson,
          email: formData.email,
          mobile: formData.mobile,
          orgType: formData.orgType,
          city: formData.city,
          interest: formData.interest,
          message: formData.message,
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
        setFormData({ orgName: '', contactPerson: '', email: '', mobile: '', orgType: '', city: '', interest: '', message: '' });
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="partner-form" className="section-padding bg-background border-b border-border/50">
        <div className="container-default max-w-3xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
          <h2 className="text-h2 mb-4">{t('partner.partnerForm.text1')}</h2>
          <p className="text-body-large text-content-secondary mb-8">
            {t('partner.partnerForm.text2')}
                              </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            {t('partner.partnerForm.text3')}
                              </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="partner-form" className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto">
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h2 className="text-h2 mb-4">{t('partner.partnerForm.text4')}</h2>
          <p className="text-body-large text-content-secondary max-w-2xl">
            {t('partner.partnerForm.text5')}
                                </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-surface-muted/30 border border-border/60 rounded-xl p-6 md:p-10 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-error/10 text-error rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} checked={botcheck} onChange={(e) => setBotcheck(e.target.checked)} />

          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="orgName" className="text-sm font-bold text-content-primary">
                {t('partner.partnerForm.text6')} <span className="text-brand-primary">*</span>
              </label>
              <SmoothInput 
                type="text" 
                id="orgName" 
                required 
                placeholder="Company, School, or Foundation Name"
                value={formData.orgName}
                onChange={e => setFormData(prev => ({...prev, orgName: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="contactPerson" className="text-sm font-bold text-content-primary">
                {t('partner.partnerForm.text7')} <span className="text-brand-primary">*</span>
              </label>
              <SmoothInput 
                type="text" 
                id="contactPerson" 
                required 
                placeholder="Full Name"
                value={formData.contactPerson}
                onChange={e => setFormData(prev => ({...prev, contactPerson: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-bold text-content-primary">
                {t('partner.partnerForm.text8')} <span className="text-brand-primary">*</span>
              </label>
              <SmoothInput 
                type="email" 
                id="email" 
                required
                placeholder="name@organization.com"
                value={formData.email}
                onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile" className="text-sm font-bold text-content-primary">
                {t('partner.partnerForm.text9')} <span className="text-brand-primary">*</span>
              </label>
              <SmoothInput 
                type="tel" 
                id="mobile" 
                required 
                placeholder="+91 89207 65376"
                value={formData.mobile}
                onChange={e => setFormData(prev => ({...prev, mobile: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="orgType" className="text-sm font-bold text-content-primary">
                {t('partner.partnerForm.text10')} <span className="text-brand-primary">*</span>
              </label>
              <select
                id="orgType"
                required
                className="px-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all text-content-primary appearance-none shadow-sm"
                value={formData.orgType}
                onChange={e => setFormData(prev => ({...prev, orgType: e.target.value}))}
              >
                <option value="" disabled>{t('partner.partnerForm.text11')}</option>
                {ORG_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="city" className="text-sm font-bold text-content-primary">
                {t('partner.partnerForm.text12')} <span className="text-brand-primary">*</span>
              </label>
              <SmoothInput 
                type="text" 
                id="city" 
                required 
                placeholder="Delhi, Mumbai, etc."
                value={formData.city}
                onChange={e => setFormData(prev => ({...prev, city: e.target.value}))}
              />
            </div>
          </div>
          
          <div className="mb-6 flex flex-col gap-2">
            <label htmlFor="interest" className="text-sm font-bold text-content-primary">
              {t('partner.partnerForm.text13')} <span className="text-brand-primary">*</span>
            </label>
            <SmoothInput 
              type="text" 
              id="interest" 
              required
              placeholder="e.g., CSR Funding, Volunteer Drive, Material Donation"
              value={formData.interest}
              onChange={e => setFormData(prev => ({...prev, interest: e.target.value}))}
            />
          </div>
          
          <div className="mb-10 flex flex-col gap-2">
            <label htmlFor="message" className="text-sm font-bold text-content-primary">
              {t('partner.partnerForm.text14')} <span className="text-content-muted font-normal ml-1">(Optional)</span>
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
              {t('partner.partnerForm.text15')}
                                      </p>
          </div>
        </form>
      </div>
    </section>
  );
}
