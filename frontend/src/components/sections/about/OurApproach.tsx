export function OurApproach() {
  const approaches = [
    "Reaching children where they are",
    "Connecting them with education",
    "Supporting school admission and continuity",
    "Supporting families where necessary",
    "Focusing on dignity, confidence, and long-term opportunity"
  ];

  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 lg:gap-24 items-start">
          <div>
            <h2 className="text-h2 mb-4">Our Approach</h2>
            <p className="text-body-large">
              We believe in holistic intervention. Our methodology ensures that every aspect of a child's educational journey is supported from start to finish.
            </p>
          </div>
          
          <div className="space-y-8">
            {approaches.map((item, index) => (
              <div key={index} className="flex gap-6 border-b border-border/60 pb-6 last:border-0 last:pb-0">
                <span className="text-2xl md:text-3xl font-display text-brand-primary/40 font-bold">
                  0{index + 1}
                </span>
                <p className="text-xl md:text-2xl font-medium text-content-primary leading-snug pt-1">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
