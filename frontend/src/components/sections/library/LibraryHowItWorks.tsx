import { useLanguage } from "../../../context/LanguageContext";

export function LibraryHowItWorks() {
    const { t } = useLanguage();
  const steps = [
    { title: "Discover", desc: "Explore the different categories." },
    { title: "Choose", desc: "Find the material you need." },
    { title: "Access", desc: "Download or view for free." },
    { title: "Learn", desc: "Study and grow." }
  ];

  return (
    <section className="section-padding bg-brand-primary text-white">
      <div className="container-default max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">{t('library.libraryHowItWorks.text1')}</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative">
          <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-[1px] bg-white/20 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-brand-primary text-brand-accent flex items-center justify-center font-bold text-xl border-2 border-brand-accent mb-6 shadow-sm">
                {index + 1}
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-white/80 text-sm max-w-[140px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
