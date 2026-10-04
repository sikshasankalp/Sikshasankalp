import { useLanguage } from "../../../context/LanguageContext";

export function ImpactPrograms() {
    const { t } = useLanguage();
  const programs = [
    { title: "Digital Shiksha & Library", description: "Providing critical access to digital learning tools and study materials to bridge the technological divide." },
    { title: "Health & Hygiene", description: "Promoting physical wellbeing through health awareness, ensuring children are healthy enough to learn." },
    { title: "Family & Essential Support", description: "Stabilizing the home environment so that families can prioritize their children's long-term education." },
  ];

  return (
    <section className="section-padding bg-background border-t border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <h2 className="text-h2 mb-12 text-center">{t('impact.impactPrograms.text1')}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="flex flex-col border-t border-border pt-6">
              <h3 className="text-h4 mb-3">{program.title}</h3>
              <p className="text-body text-content-secondary leading-relaxed">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
