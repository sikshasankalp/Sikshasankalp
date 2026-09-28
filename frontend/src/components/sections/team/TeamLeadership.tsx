import { PlaceholderImage } from '../../common/PlaceholderImage';

export function TeamLeadership() {
  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <h2 className="text-h2 mb-12 text-center md:text-left">Leadership</h2>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Founder */}
          <div className="flex flex-col group">
            <div className="relative aspect-[3/4] w-full max-w-[320px] mb-6 rounded-lg overflow-hidden bg-background border border-border/50 mx-auto md:mx-0">
              <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Sanjay Kumar Portrait Placeholder" />
            </div>
            <div className="text-center md:text-left max-w-[360px] mx-auto md:mx-0">
              <h3 className="text-2xl font-bold text-content-primary mb-1">Sanjay Kumar</h3>
              <p className="text-brand-primary font-semibold text-sm uppercase tracking-wider mb-4 leading-snug">Founder & Managing Trustee</p>
              <p className="text-body-large text-content-secondary leading-relaxed">
                Focuses on legal governance, trust deed compliance, official authorizations, and broad board oversight to ensure the foundation remains secure and transparent.
              </p>
            </div>
          </div>

          {/* Co-Founder */}
          <div className="flex flex-col group">
            <div className="relative aspect-[3/4] w-full max-w-[320px] mb-6 rounded-lg overflow-hidden bg-background border border-border/50 mx-auto md:mx-0">
              <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Krishna Kumar Portrait Placeholder" />
            </div>
            <div className="text-center md:text-left max-w-[360px] mx-auto md:mx-0">
              <h3 className="text-2xl font-bold text-content-primary mb-1">Krishna Kumar</h3>
              <p className="text-brand-primary font-semibold text-sm uppercase tracking-wider mb-4 leading-snug">Co-Founder & Executive Director <br/><span className="text-xs text-brand-primary/80 tracking-normal capitalize">(On-Ground Lead)</span></p>
              <p className="text-body-large text-content-secondary leading-relaxed">
                Drives ground education work, active teaching, school admissions, community support, and day-to-day field operations directly with the children and families.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
