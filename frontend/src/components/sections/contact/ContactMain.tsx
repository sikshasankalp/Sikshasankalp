import { useState } from 'react';
import { Button } from '../../buttons/Button';
import { SmoothInput } from '../../common/SmoothInput';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";
import { API_URL } from '../../../config/env';

const ENQUIRY_TYPES = [
  'General Enquiry',
  'Volunteer',
  'Partnership',
  'Donation',
  'Media',
  'Education / Program',
  'Other'
];

export function ContactMain() {
    const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    enquiryType: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [botcheck, setBotcheck] = useState(false);

  const validateForm = () => {
    if (!formData.name.trim()) return 'Full Name is required.';
    
    const mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if (!formData.mobile.trim() || !mobileRegex.test(formData.mobile.replace(/\s/g, ''))) {
      return 'Please enter a valid Indian mobile number.';
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }

    if (!formData.enquiryType) return 'Enquiry Type is required.';
    if (!formData.message.trim()) return 'Message is required.';

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
      // 1. Save directly to Database so Admin sees it in /admin/messages
      try {
        await fetch(`${API_URL}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            mobile: formData.mobile.trim(),
            email: formData.email.trim() || undefined,
            subject: formData.enquiryType,
            message: formData.message.trim()
          })
        });
      } catch (dbErr) {
        console.warn('Backend contact save error:', dbErr);
      }

      // 2. Also send notification via Web3Forms (if key present)
      const accessKey = import.meta.env.VITE_WEB3FORMS_CONTACT_ACCESS_KEY;
      if (accessKey) {
        try {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: accessKey,
              subject: 'New Contact Inquiry — Siksha Sankalp Foundation',
              botcheck,
              name: formData.name,
              mobile: formData.mobile,
              email: formData.email,
              enquiryType: formData.enquiryType,
              message: formData.message,
            })
          });
        } catch (wErr) {
          console.warn('Web3Forms notification error:', wErr);
        }
      }

      setIsSuccess(true);
      setFormData({ name: '', mobile: '', email: '', enquiryType: '', message: '' });
    } catch (err: any) {
      console.error('Form submission error:', err);
      setError(err?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-content-primary mb-6">{t('contact.contactMain.text1')}</h2>
            
            {isSuccess ? (
              <div className="bg-surface-muted border border-border/60 rounded-xl p-8 text-center h-full flex flex-col justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
                <h3 className="text-xl font-bold mb-4 text-content-primary">{t('contact.contactMain.text2')}</h3>
                <p className="text-body text-content-secondary mb-8">
                  {t('contact.contactMain.text3')}
                                                  </p>
                <div>
                  <Button onClick={() => setIsSuccess(false)} variant="outline">
                    {t('contact.contactMain.text4')}
                                                        </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface-muted/30 border border-border/60 rounded-xl p-6 md:p-8 shadow-sm">
                
                {error && (
                  <div className="mb-6 p-4 bg-error/10 text-error rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}
                
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} checked={botcheck} onChange={(e) => setBotcheck(e.target.checked)} />
                
                <div className="flex flex-col gap-2 mb-6">
                  <label htmlFor="name" className="text-sm font-bold text-content-primary">
                    {t('contact.contactMain.text5')} <span className="text-brand-primary">*</span>
                  </label>
                  <SmoothInput 
                    type="text" 
                    id="name" 
                    required 
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="mobile" className="text-sm font-bold text-content-primary">
                      {t('contact.contactMain.text6')} <span className="text-brand-primary">*</span>
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
                    <label htmlFor="email" className="text-sm font-bold text-content-primary">
                      {t('contact.contactMain.text7')} <span className="text-content-muted font-normal ml-1">(Optional)</span>
                    </label>
                    <SmoothInput 
                      type="email" 
                      id="email" 
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mb-6">
                  <label htmlFor="enquiryType" className="text-sm font-bold text-content-primary">
                    {t('contact.contactMain.text8')} <span className="text-brand-primary">*</span>
                  </label>
                  <select
                    id="enquiryType"
                    required
                    className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary appearance-none"
                    value={formData.enquiryType}
                    onChange={e => setFormData(prev => ({...prev, enquiryType: e.target.value}))}
                  >
                    <option value="" disabled>{t('contact.contactMain.text9')}</option>
                    {ENQUIRY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2 mb-8">
                  <label htmlFor="message" className="text-sm font-bold text-content-primary">
                    {t('contact.contactMain.text10')} <span className="text-brand-primary">*</span>
                  </label>
                  <textarea 
                    id="message" 
                    required
                    rows={5}
                    className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary resize-y"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={e => setFormData(prev => ({...prev, message: e.target.value}))}
                  />
                </div>
                
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
          
          {/* Right: Contact Info & Map */}
          <div className="flex flex-col gap-10">
            
            {/* Quick Contact Actions */}
            <div>
              <h2 className="text-2xl font-bold text-content-primary mb-6">{t('contact.contactMain.text11')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <a href="tel:+918920765376" className="flex items-center gap-4 p-4 border border-border/60 rounded-lg hover:border-brand-primary/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10">
                    <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-bold uppercase tracking-wider mb-0.5">{t('contact.contactMain.text12')}</p>
                    <p className="text-sm font-medium text-content-primary">+91 89207 65376</p>
                  </div>
                </a>
                
                <a href="https://wa.me/918920765376" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-border/60 rounded-lg hover:border-brand-primary/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center shrink-0 group-hover:bg-green-100">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-bold uppercase tracking-wider mb-0.5">{t('contact.contactMain.text13')}</p>
                    <p className="text-sm font-medium text-content-primary">+91 89207 65376</p>
                  </div>
                </a>
                
                <a href="mailto:sikshasankalpfoundation@gmail.com" className="flex items-center gap-4 p-4 border border-border/60 rounded-lg hover:border-brand-primary/40 transition-colors group sm:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10">
                    <Mail className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-bold uppercase tracking-wider mb-0.5">{t('contact.contactMain.text14')}</p>
                    <p className="text-sm font-medium text-content-primary">{t('contact.contactMain.text15')}</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Visit / Location */}
            <div>
              <h2 className="text-xl font-bold text-content-primary mb-4">{t('contact.contactMain.text16')}</h2>
              <div className="flex flex-col gap-4 p-6 border border-border/60 rounded-xl bg-surface-muted/30 shadow-sm">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-2">
                      Open Learning Center (Ground Classes)
                    </div>
                    <p className="text-content-primary font-medium leading-relaxed">
                      {t('contact.contactMain.text17')}
                    </p>
                    <a
                      href="https://maps.app.goo.gl/VpdPkZ4Rb9J5AZqQ6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:underline mt-3"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>

                {/* Embedded Map */}
                <div className="w-full h-48 rounded-lg overflow-hidden border border-border/70 mt-1 shadow-inner">
                  <iframe
                    title="Siksha Sankalp Open Learning Center Location"
                    src="https://maps.google.com/maps?q=28.548793,77.248806&hl=en&z=16&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h2 className="text-xl font-bold text-content-primary mb-4">{t('contact.contactMain.text18')}</h2>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.facebook.com/share/1d1BBukLKV/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold" aria-label="Facebook">
                  FB
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold" aria-label="X">
                  X
                </a>
                <a href="https://www.instagram.com/siksha_sankalp_foundation" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold" aria-label="Instagram">
                  IG
                </a>
                <a href="https://youtube.com/@kksirkrishankumar?si=g_334Lrxlb0e0Khs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold" aria-label="YouTube">
                  YT
                </a>
                <a href="https://www.linkedin.com/in/krishan-kumar-94303b130?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold" aria-label="LinkedIn">
                  IN
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
