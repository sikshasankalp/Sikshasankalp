const IMPACT_AREAS = [
  'Foundational Education & Learning',
  'School Admission & Transition Support',
  'Essential Educational Materials',
  'Free Digital Shiksha & Library Access',
  'Health Checkups & Hygiene Initiatives',
  'Direct Family & Community Support'
];

export function DonateImpact() {
  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-10">What Your Support Enables</h2>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {IMPACT_AREAS.map((area, index) => (
            <div key={index} className="flex items-center text-content-secondary font-medium bg-surface-muted px-4 py-2 rounded-full border border-border/60">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-3 opacity-50"></span>
              {area}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
