import { useState } from 'react';
import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

const FORM_OPTIONS = [
  { id: 'teaching', label: 'Teaching' },
  { id: 'volunteering', label: 'General Volunteering' },
  { id: 'photography', label: 'Photography / Videography' },
  { id: 'digital', label: 'Digital Support' },
  { id: 'health', label: 'Health Awareness' },
  { id: 'events', label: 'Events' },
  { id: 'other', label: 'Other' }
];

export function InvolvedForm() {
    const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    skills: '',
    interests: [] as string[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botcheck, setBotcheck] = useState(false);
  
  const handleInterestToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required.';
    
    // Basic Indian mobile number validation (optional +91, 10 digits)
    const mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (!formData.mobile.trim() || !mobileRegex.test(formData.mobile.replace(/\s/g, ''))) {
      return 'Please enter a valid Indian mobile number.';
    }
    
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }

    if (!formData.city.trim()) return 'City is required.';
    if (formData.interests.length === 0) return 'Please select at least one way you would like to help.';

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
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) {
        throw new Error('Form configuration is missing. Please contact support.');
      }

      // Map interests back to labels for the email
      const selectedInterests = formData.interests
        .map(id => FORM_OPTIONS.find(opt => opt.id === id)?.label)
        .filter(Boolean)
        .join(', ');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'New Volunteer Application — Shiksha Sankalp Foundation',
          botcheck,
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          city: formData.city,
          help: selectedInterests,
          skills: formData.skills,
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: '', mobile: '', email: '', city: '', skills: '', interests: [] });
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
      <section className="section-padding bg-surface-muted border-b border-border/50">
        <div className="container-default max-w-3xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
          <h2 className="text-h2 mb-4">{t('get-Involved.involvedForm.text1')}</h2>
          <p className="text-body-large text-content-secondary mb-8">
            {t('get-Involved.involvedForm.text2')}
                              </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            {t('get-Involved.involvedForm.text3')}
                              </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="volunteer" className="section-padding bg-surface-muted border-b border-border/50 scroll-mt-24">
      <div className="container-default max-w-4xl mx-auto">
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h2 className="text-h2 mb-4">{t('get-Involved.involvedForm.text4')}</h2>
          <p className="text-body-large text-content-secondary max-w-2xl">
            {t('get-Involved.involvedForm.text5')}
                                </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-background border border-border/60 rounded-xl p-6 md:p-10 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-error/10 text-error rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} checked={botcheck} onChange={(e) => setBotcheck(e.target.checked)} />
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-content-primary">
                {t('get-Involved.involvedForm.text6')} <span className="text-brand-primary">*</span>
              </label>
              <input 
                type="text" 
                id="name" 
                required 
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                placeholder="Jane Doe"
                value={formData.name}
                onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="mobile" className="text-sm font-bold text-content-primary">
                {t('get-Involved.involvedForm.text7')} <span className="text-brand-primary">*</span>
              </label>
              <input 
                type="tel" 
                id="mobile" 
                required 
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                placeholder="+91 89207 65376"
                value={formData.mobile}
                onChange={e => setFormData(prev => ({...prev, mobile: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-bold text-content-primary">
                {t('get-Involved.involvedForm.text8')} <span className="text-content-muted font-normal ml-1">(Optional)</span>
              </label>
              <input 
                type="email" 
                id="email" 
                className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label htmlFor="city" className="text-sm font-bold text-content-primary">
                {t('get-Involved.involvedForm.text9')} <span className="text-brand-primary">*</span>
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
          
          <div className="mb-10">
            <label className="text-sm font-bold text-content-primary block mb-4">
              {t('get-Involved.involvedForm.text10')} <span className="text-content-muted font-normal ml-1">(Select all that apply)</span>
            </label>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {FORM_OPTIONS.map(option => (
                <label 
                  key={option.id} 
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.interests.includes(option.id) 
                      ? 'border-brand-primary bg-brand-primary/5' 
                      : 'border-border bg-surface hover:border-brand-primary/40'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                    checked={formData.interests.includes(option.id)}
                    onChange={() => handleInterestToggle(option.id)}
                  />
                  <span className="text-sm font-medium text-content-primary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-10 flex flex-col gap-2">
            <label htmlFor="skills" className="text-sm font-bold text-content-primary">
              {t('get-Involved.involvedForm.text11')} <span className="text-content-muted font-normal ml-1">(Optional)</span>
            </label>
            <textarea 
              id="skills" 
              rows={4}
              className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary resize-y"
              placeholder="Tell us a bit about your background and how your skills might align with our work..."
              value={formData.skills}
              onChange={e => setFormData(prev => ({...prev, skills: e.target.value}))}
            />
          </div>
          
          <div className="pt-6 border-t border-border/60">
            <Button type="submit" variant="primary" size="lg" className="w-full md:w-auto px-10" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
            <p className="text-xs text-content-muted mt-4">
              {t('get-Involved.involvedForm.text12')}
                                      </p>
          </div>
        </form>
      </div>
    </section>
  );
}
