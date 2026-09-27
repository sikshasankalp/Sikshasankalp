const impacts = [
  {
    number: "42",
    label: "Children supported in school admission / mainstreaming"
  },
  {
    number: "35",
    label: "Families supported with portable bath tents"
  }
];

export function ImpactSection() {
  return (
    <section className="py-14 md:py-20 bg-brand-secondary text-white">
      <div className="container-default">
        <div className="text-center mb-12">
          <h2 className="text-h2">हमारा प्रभाव</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
          {impacts.map((impact, index) => (
            <div key={index} className="text-center flex flex-col items-center">
              <span className="text-6xl md:text-8xl font-display font-bold text-brand-accent mb-2">
                {impact.number}
              </span>
              <span className="text-base md:text-lg font-medium text-white/90 max-w-[280px] leading-snug">
                {impact.label}
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 pt-6 border-t border-white/10">
          <p className="text-sm text-white/50 italic">
            * आंकड़े समय के साथ हमारे कार्य के अनुसार अपडेट किए जाएंगे।
          </p>
        </div>
      </div>
    </section>
  );
}
