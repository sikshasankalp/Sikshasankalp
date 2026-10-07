import { useLanguage } from "../../../context/LanguageContext";

export function OurBelief() {
  const { t } = useLanguage();
  return (
    <section id="mission" className="section-padding bg-brand-primary text-white">
      <div className="container-default max-w-3xl mx-auto text-center">
        <blockquote className="relative px-6 md:px-12">
          <span className="absolute -top-7 left-0 md:-left-4 text-6xl md:text-7xl text-white/50 font-serif leading-none select-none pointer-events-none">
            “
          </span>
          <p className="text-2xl md:text-4xl font-display font-bold leading-tight relative z-10 text-white">
            {t('home.missionSection.highlight')}
          </p>
          <span className="absolute -bottom-10 right-0 md:-right-4 text-6xl md:text-7xl text-white/50 font-serif leading-none select-none pointer-events-none">
            ”
          </span>
        </blockquote>
        
        <p className="text-lg md:text-xl text-brand-sand font-normal leading-relaxed mt-10 max-w-2xl mx-auto">
          {t('about.ourBelief.text1')}
        </p>
      </div>
    </section>
  );
}
