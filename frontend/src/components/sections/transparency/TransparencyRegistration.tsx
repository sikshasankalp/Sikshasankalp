import { ShieldCheck } from 'lucide-react';

export function TransparencyRegistration() {
  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto">
        <h2 className="text-h2 mb-10 text-center md:text-left">Official Registration</h2>
        
        <div className="bg-surface-muted border border-border rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-content-primary mb-2">Shiksha Sankalp Foundation</h3>
              <p className="text-body text-content-secondary mb-1">
                <span className="font-semibold text-content-primary">Registration Type:</span> Registered Trust
              </p>
              <p className="text-body text-content-secondary">
                <span className="font-semibold text-content-primary">Declaration Registration No:</span> IN-UP97748090951454Y
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:text-right pt-6 md:pt-0 border-t border-border/60 md:border-t-0 md:border-l md:pl-8 w-full md:w-auto">
            <p className="text-sm text-content-muted font-medium uppercase tracking-wider mb-1">Registration Date</p>
            <p className="text-xl font-bold text-content-primary">03 June 2026</p>
          </div>
        </div>
      </div>
    </section>
  );
}
