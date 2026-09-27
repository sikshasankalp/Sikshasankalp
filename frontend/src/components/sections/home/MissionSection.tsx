export function MissionSection() {
  return (
    <section className="py-16 md:py-20 bg-brand-primary text-white">
      <div className="container-default max-w-3xl mx-auto text-center">
        <h2 className="text-caption text-brand-accent mb-3">Our Mission</h2>
        <h3 className="text-h2 mb-5">शिक्षा से शुरुआत, अवसरों तक सफर</h3>
        
        <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl mx-auto">
          Shiksha Sankalp Foundation works to connect underprivileged children with education, mainstream schooling and opportunities for a better future.
        </p>
        
        <blockquote className="relative">
          <span className="absolute -top-5 -left-4 md:-left-8 text-5xl md:text-6xl text-white/10 font-serif leading-none">"</span>
          <p className="text-2xl md:text-4xl font-display font-bold leading-tight relative z-10">
            हम मानते हैं कि किसी बच्चे का भविष्य उसकी आर्थिक स्थिति या उसके वर्तमान रहने के स्थान से तय नहीं होना चाहिए। <span className="text-brand-accent">हर बच्चा अवसर का हकदार है।</span>
          </p>
          <span className="absolute -bottom-8 -right-4 md:-right-8 text-5xl md:text-6xl text-white/10 font-serif leading-none">"</span>
        </blockquote>
      </div>
    </section>
  );
}
