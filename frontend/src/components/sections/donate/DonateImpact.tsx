import { useEffect, useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { fetchBenefits } from "../../../services/api/benefit";

const DEFAULT_BENEFITS = [
  'Foundational Education & Learning',
  'School Admission & Transition Support',
  'Essential Educational Materials',
  'Free Digital Siksha & Library Access',
  'Health Checkups & Hygiene Initiatives',
  'Direct Family & Community Support'
];

export function DonateImpact() {
  const { t } = useLanguage();
  const [benefits, setBenefits] = useState<string[]>(DEFAULT_BENEFITS);

  useEffect(() => {
    let mounted = true;
    fetchBenefits()
      .then((data) => {
        if (mounted && data && data.length > 0) {
          setBenefits(data.map((b) => b.title));
        }
      })
      .catch((err) => {
        console.warn('Could not load live benefits, using defaults:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-content-primary text-center mb-6 sm:mb-8">
          {t('donate.donateImpact.text1')}
        </h2>

        {/* Benefits Card - Clean single rounded card with bullet points as in user reference */}
        <div className="max-w-md sm:max-w-lg mx-auto bg-[#F6F1E8] border border-[#E8DFCFC0] rounded-[28px] sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-soft">
          <div className="flex flex-col gap-5 sm:gap-6 md:gap-7">
            {benefits.map((area, index) => (
              <div
                key={index}
                className="flex items-start gap-3.5 sm:gap-4"
              >
                <span className="w-2 h-2 rounded-full bg-[#C87055] shrink-0 mt-1.5" />
                <span className="text-[15px] sm:text-base md:text-[17px] font-semibold text-content-primary/90 leading-snug">
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
