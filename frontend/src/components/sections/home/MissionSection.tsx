import { useLanguage } from "../../../context/LanguageContext";

export function MissionSection() {
    const { t } = useLanguage();
  return (
    <section className="py-16 md:py-20 bg-brand-primary text-white">
      <div className="container-default max-w-3xl mx-auto text-center">
        <h2 className="text-caption text-brand-accent mb-3">{t('home.missionSection.text1')}</h2>
        <h3 className="text-h2 mb-5">{t('home.missionSection.title1')}</h3>
        
        <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl mx-auto">
          {t('home.missionSection.text2')}
                          </p>
        
        <blockquote className="relative">
          <span className="absolute -top-5 -left-4 md:-left-8 text-5xl md:text-6xl text-white/10 font-serif leading-none">"</span>
          <p className="text-2xl md:text-4xl font-display font-bold leading-tight relative z-10">
            {t('home.missionSection.belief')} <span className="text-brand-accent">{t('home.missionSection.highlight')}</span>
          </p>
          <span className="absolute -bottom-8 -right-4 md:-right-8 text-5xl md:text-6xl text-white/10 font-serif leading-none">"</span>
        </blockquote>
      </div>
    </section>
  );
}
