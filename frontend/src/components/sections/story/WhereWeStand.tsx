export function WhereWeStand() {
  const pillars = [
    "Education",
    "School Mainstreaming",
    "Family Support",
    "Dignity",
    "Health",
    "Digital Learning",
    "Better Opportunities"
  ];

  return (
    <section className="section-padding bg-surface-muted border-y border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-h2 mb-6">Where We Stand Today</h2>
            <p className="text-body-large leading-relaxed">
              Our original purpose remains the heart of our mission. From those first moments on the footpaths to our current efforts, we have grown to address the diverse barriers a child might face. Today, our work spans a comprehensive support system designed to ensure long-term success and dignity.
            </p>
          </div>
          <div>
            <ul className="space-y-4 border-l-2 border-brand-primary/20 pl-6 md:pl-8">
              {pillars.map((pillar, index) => (
                <li key={index} className="text-xl md:text-2xl font-display font-medium text-content-primary">
                  {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
