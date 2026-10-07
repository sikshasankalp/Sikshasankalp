import { useLanguage } from "../../../context/LanguageContext";

const IMPACT_AREAS = [
  'Foundational Education & Learning',
  'School Admission & Transition Support',
  'Essential Educational Materials',
  'Free Digital Siksha & Library Access',
  'Health Checkups & Hygiene Initiatives',
  'Direct Family & Community Support'
];

export function DonateImpact() {
  const { t } = useLanguage();

  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-content-primary text-center mb-6 sm:mb-8">
          {t('donate.donateImpact.text1')}
        </h2>

        {/* Benefits Card */}
        <div className="max-w-md sm:max-w-lg mx-auto bg-[#FAF6F0] border border-border/80 rounded-[28px] sm:rounded-3xl p-3.5 sm:p-6 md:p-7 shadow-soft">
          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            {IMPACT_AREAS.map((area, index) => (
              <div
                key={index}
                className="w-full flex items-center gap-3 sm:gap-3.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-[#F3EDE3] border border-[#E6DDD0] hover:border-brand-primary/30 hover:bg-[#EFE7DC] transition-all duration-200"
              >
                <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0 opacity-80" />
                <span className="text-xs sm:text-sm md:text-base font-semibold text-content-primary leading-snug">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
