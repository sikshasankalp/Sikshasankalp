import { useState } from 'react';
import { Button } from '../../buttons/Button';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    enquiryType: '',
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
      setFormData({ name: '', mobile: '', email: '', enquiryType: '', message: '' });
    }, 1000);
  };

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left: Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-content-primary mb-6">Send a Message</h2>
            
            {isSuccess ? (
              <div className="bg-surface-muted border border-border/60 rounded-xl p-8 text-center h-full flex flex-col justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
                <h3 className="text-xl font-bold mb-4 text-content-primary">Message Sent Successfully</h3>
                <p className="text-body text-content-secondary mb-8">
                  Thank you for reaching out. We have received your message and our team will get back to you soon.
                </p>
                <div>
                  <Button onClick={() => setIsSuccess(false)} variant="outline">
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface-muted/30 border border-border/60 rounded-xl p-6 md:p-8 shadow-sm">
                
                <div className="flex flex-col gap-2 mb-6">
                  <label htmlFor="name" className="text-sm font-bold text-content-primary">
                    Full Name <span className="text-brand-primary">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mb-6">
                  <label htmlFor="enquiryType" className="text-sm font-bold text-content-primary">
                    Subject / Enquiry Type <span className="text-brand-primary">*</span>
                  </label>
                  <select
                    id="enquiryType"
                    required
                    className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary appearance-none"
                    value={formData.enquiryType}
                    onChange={e => setFormData(prev => ({...prev, enquiryType: e.target.value}))}
                  >
                    <option value="" disabled>Select Type</option>
                    {ENQUIRY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-2 mb-8">
                  <label htmlFor="message" className="text-sm font-bold text-content-primary">
                    Message <span className="text-brand-primary">*</span>
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
              <h2 className="text-2xl font-bold text-content-primary mb-6">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <a href="tel:+918920765376" className="flex items-center gap-4 p-4 border border-border/60 rounded-lg hover:border-brand-primary/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10">
                    <Phone className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-bold uppercase tracking-wider mb-0.5">Call Us</p>
                    <p className="text-sm font-medium text-content-primary">+91 89207 65376</p>
                  </div>
                </a>
                
                <a href="https://wa.me/918920765376" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 border border-border/60 rounded-lg hover:border-brand-primary/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center shrink-0 group-hover:bg-green-100">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-bold uppercase tracking-wider mb-0.5">WhatsApp</p>
                    <p className="text-sm font-medium text-content-primary">+91 89207 65376</p>
                  </div>
                </a>
                
                <a href="mailto:sikshasankalpfoundation@gmail.com" className="flex items-center gap-4 p-4 border border-border/60 rounded-lg hover:border-brand-primary/40 transition-colors group sm:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-surface-muted flex items-center justify-center shrink-0 group-hover:bg-brand-primary/10">
                    <Mail className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-content-muted font-bold uppercase tracking-wider mb-0.5">Official Email</p>
                    <p className="text-sm font-medium text-content-primary">sikshasankalpfoundation@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Visit / Location */}
            <div>
              <h2 className="text-xl font-bold text-content-primary mb-4">Visit Us</h2>
              <div className="flex gap-4 p-6 border border-border/60 rounded-lg bg-surface-muted/30">
                <MapPin className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-content-primary font-medium leading-relaxed">
                    Official address and location details will be updated here soon.
                  </p>
                  <p className="text-sm text-content-muted mt-2">
                    (Map integration pending official details)
                  </p>
                </div>
              </div>
            </div>
            
            {/* Social Media */}
            <div>
              <h2 className="text-xl font-bold text-content-primary mb-4">Connect Socially</h2>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold">
                  IG
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold">
                  FB
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold">
                  X
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-content-secondary hover:text-brand-primary hover:border-brand-primary transition-colors text-xs font-bold">
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
