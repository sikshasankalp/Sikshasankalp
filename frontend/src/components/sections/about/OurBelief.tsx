import { useLanguage } from "../../../context/LanguageContext";

export function OurBelief() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-brand-primary text-white">
      <div className="container-default max-w-3xl mx-auto text-center">
        <blockquote className="relative">
          <span className="absolute -top-5 -left-4 md:-left-8 text-5xl md:text-6xl text-white/10 font-serif leading-none">"</span>
          <p className="text-2xl md:text-4xl font-display font-bold leading-tight relative z-10">
            {t('home.missionSection.highlight')}
          </p>
          <span className="absolute -bottom-8 -right-4 md:-right-8 text-5xl md:text-6xl text-white/10 font-serif leading-none">"</span>
        </blockquote>
        
        <p className="text-lg md:text-xl text-white/90 leading-relaxed mt-10 max-w-2xl mx-auto">
          {t('about.ourBelief.text1')}
                          </p>
      </div>
    </section>
  );
}
