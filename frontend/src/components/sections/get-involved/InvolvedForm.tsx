import { useState } from 'react';
import { Button } from '../../buttons/Button';

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
  
  const handleInterestToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call delay to show state
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', mobile: '', email: '', city: '', skills: '', interests: [] });
    }, 1000);
  };

  if (isSuccess) {
    return (
      <section className="section-padding bg-surface-muted border-b border-border/50">
        <div className="container-default max-w-3xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
          <h2 className="text-h2 mb-4">Thank You for Reaching Out!</h2>
          <p className="text-body-large text-content-secondary mb-8">
            Your information has been securely submitted. Our team will review your details and get in touch with you shortly.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            Submit Another Response
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto">
        <div className="mb-10 md:mb-16 text-center md:text-left">
          <h2 className="text-h2 mb-4">Volunteer Application</h2>
          <p className="text-body-large text-content-secondary max-w-2xl">
            Fill out the form below to let us know how you'd like to help. We'll connect with you to find the perfect role.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-background border border-border/60 rounded-xl p-6 md:p-10 shadow-sm">
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-bold text-content-primary">
                Full Name <span className="text-brand-primary">*</span>
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
                Mobile Number <span className="text-brand-primary">*</span>
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
                Email Address <span className="text-content-muted font-normal ml-1">(Optional)</span>
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
          
          <div className="mb-10">
            <label className="text-sm font-bold text-content-primary block mb-4">
              How would you like to help? <span className="text-content-muted font-normal ml-1">(Select all that apply)</span>
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
              Relevant Skills or Experience <span className="text-content-muted font-normal ml-1">(Optional)</span>
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
              By submitting this form, you agree to let us contact you regarding volunteer opportunities. We respect your privacy and will never share your data.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
