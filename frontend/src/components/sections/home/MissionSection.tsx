import { useLanguage } from "../../../context/LanguageContext";

export function MissionSection() {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-20 bg-brand-primary text-white">
      <div className="container-default max-w-3xl mx-auto text-center">
        <h2 className="text-caption text-brand-sand/80 mb-3">{t('home.missionSection.text1')}</h2>
        <h3 className="text-h2 mb-5">{t('home.missionSection.title1')}</h3>
        
        <p className="text-lg md:text-xl text-brand-sand font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
          {t('home.missionSection.text2')}
        </p>
        
        <blockquote className="relative px-6 md:px-12">
          <span className="absolute -top-7 left-0 md:-left-4 text-6xl md:text-7xl text-white/50 font-serif leading-none select-none pointer-events-none">
            “
          </span>
          <p className="text-2xl md:text-4xl font-display font-bold leading-tight relative z-10 text-white">
            {t('home.missionSection.belief')} <span className="text-brand-sand font-bold">{t('home.missionSection.highlight')}</span>
          </p>
          <span className="absolute -bottom-10 right-0 md:-right-4 text-6xl md:text-7xl text-white/50 font-serif leading-none select-none pointer-events-none">
            ”
          </span>
        </blockquote>
      </div>
    </section>
  );
}
