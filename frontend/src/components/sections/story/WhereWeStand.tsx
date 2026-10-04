import { useLanguage } from "../../../context/LanguageContext";

export function WhereWeStand() {
    const { t } = useLanguage();
  const pillars = [
    "Education",
    "School Mainstreaming",
    "Family Support",
    "Dignity",
    "Health",
    "Digital Learning",
    "Better Opportunities"
  ];

  return (
    <section className="section-padding bg-surface-muted border-y border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-h2 mb-6">{t('story.whereWeStand.text1')}</h2>
            <p className="text-body-large leading-relaxed">
              {t('story.whereWeStand.text2')}
                                      </p>
          </div>
          <div>
            <ul className="space-y-4 border-l-2 border-brand-primary/20 pl-6 md:pl-8">
              {pillars.map((pillar, index) => (
                <li key={index} className="text-xl md:text-2xl font-display font-medium text-content-primary">
                  {pillar}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
