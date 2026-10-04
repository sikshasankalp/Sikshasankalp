import { useLanguage } from "../../../context/LanguageContext";

export function PartnerProcess() {
    const { t } = useLanguage();
  const steps = [
    { title: "Share Interest", desc: "Reach out via our form." },
    { title: "Discuss Goals", desc: "Align capabilities." },
    { title: "Identify Area", desc: "Find the right overlap." },
    { title: "Plan", desc: "Structure the initiative." },
    { title: "Collaborate", desc: "Track mutual impact." }
  ];

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">{t('partner.partnerProcess.text1')}</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-center relative">
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[1px] border-t border-dashed border-border/80 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-surface-muted text-brand-primary flex items-center justify-center font-bold text-xl border-2 border-brand-primary/20 mb-6 shadow-sm">
                {index + 1}
              </div>
              <h3 className="text-lg font-bold mb-2 text-content-primary">{step.title}</h3>
              <p className="text-content-secondary text-sm max-w-[150px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
