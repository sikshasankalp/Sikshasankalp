import { useLanguage } from "../../../context/LanguageContext";

export function MissionSection() {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24 bg-[#181614] text-white border-y border-[#2b2520] relative overflow-hidden">
      {/* Subtle warm ambient glow in background for depth */}
      <div className="absolute inset-0 bg-radial from-[#C85A27]/10 via-transparent to-transparent pointer-events-none opacity-60" />

      <div className="container-default max-w-3xl mx-auto text-center relative z-10">
        <div className="inline-flex flex-col items-center mb-5">
          <span className="text-xs sm:text-sm tracking-[0.2em] font-bold uppercase text-brand-primary">
            {t('home.missionSection.text1')}
          </span>
          <div className="w-12 sm:w-14 h-[2px] bg-brand-primary/60 rounded-full mt-2.5"></div>
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-5">
          {t('home.missionSection.title1')}
        </h3>
        
        <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
          {t('home.missionSection.text2')}
        </p>
        
        <blockquote className="relative px-6 md:px-12">
          <span className="absolute -top-7 left-0 md:-left-4 text-6xl md:text-7xl text-stone-700 font-serif leading-none select-none pointer-events-none">
            “
          </span>
          <p className="text-2xl md:text-4xl font-display font-bold leading-tight relative z-10 text-white">
            {t('home.missionSection.belief')}{' '}
            <span className="text-[#E07A48] font-bold">
              {t('home.missionSection.highlight')}
            </span>
          </p>
          <span className="absolute -bottom-10 right-0 md:-right-4 text-6xl md:text-7xl text-stone-700 font-serif leading-none select-none pointer-events-none">
            ”
          </span>
        </blockquote>
      </div>
    </section>
  );
}
