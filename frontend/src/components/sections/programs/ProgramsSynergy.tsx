import { useLanguage } from "../../../context/LanguageContext";

export function ProgramsSynergy() {
    const { t } = useLanguage();
  const steps = [
    "Reaching children on the streets",
    "Providing fundamental education",
    "School mainstreaming & admission",
    "Holistic family & dignity support",
    "Fostering long-term opportunity"
  ];

  return (
    <section className="section-padding bg-surface-muted border-y border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">{t('programs.programsSynergy.text1')}</h2>
          <p className="text-body-large max-w-3xl mx-auto">
            {t('programs.programsSynergy.text2')}
                                </p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-border z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-row md:flex-col items-center md:items-center text-left md:text-center relative z-10 w-full md:w-1/5">
              <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg shrink-0 mr-4 md:mr-0 md:mb-4 border-4 border-surface-muted shadow-sm">
                {index + 1}
              </div>
              <p className="text-base font-medium text-content-primary md:max-w-[140px]">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
