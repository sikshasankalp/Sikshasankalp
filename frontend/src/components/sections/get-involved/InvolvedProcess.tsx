import { useLanguage } from "../../../context/LanguageContext";

export function InvolvedProcess() {
    const { t } = useLanguage();
  const steps = [
    { title: "Submit", desc: "Share your interest." },
    { title: "Review", desc: "We review your details." },
    { title: "Connect", desc: "Our team reaches out." },
    { title: "Contribute", desc: "Find a suitable role." }
  ];

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">{t('get-Involved.involvedProcess.text1')}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative">
          <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-[1px] border-t border-dashed border-border/80 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-surface-muted text-brand-primary flex items-center justify-center font-bold text-xl border-2 border-brand-primary/20 mb-6 shadow-sm">
                {index + 1}
              </div>
              <h3 className="text-lg font-bold mb-2 text-content-primary">{step.title}</h3>
              <p className="text-content-secondary text-sm max-w-[140px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
