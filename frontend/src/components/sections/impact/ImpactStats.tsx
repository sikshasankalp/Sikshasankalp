export function ImpactStats() {
  return (
    <section className="section-padding bg-brand-primary text-white">
      <div className="container-default max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">Impact at a Glance</h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            These figures represent verified outcomes of our ongoing initiatives. Each number represents a real person or family supported.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          <div className="flex flex-col items-center text-center">
            <span className="text-6xl md:text-8xl font-display font-bold text-white mb-6">42</span>
            <h3 className="text-xl md:text-2xl font-bold mb-3">Children Supported</h3>
            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
              Guided and supported toward school admission and mainstream education.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-6xl md:text-8xl font-display font-bold text-white mb-6">35</span>
            <h3 className="text-xl md:text-2xl font-bold mb-3">Families Supported</h3>
            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
              Provided with portable bath tents, helping improve privacy, hygiene, and dignity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
