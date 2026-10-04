import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";

const WAYS_TO_COLLABORATE = [
  'CSR & Education Initiatives',
  'Educational Resources',
  'Digital Learning',
  'Skill & Mentorship Support',
  'Health & Hygiene Initiatives',
  'Community Events',
  'Volunteering',
  'Technology & Digital Support',
  'Media & Storytelling'
];

export function PartnerWays() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h2 mb-4">{t('partner.partnerWays.text1')}</h2>
          <p className="text-body-large text-content-secondary max-w-2xl mx-auto">
            {t('partner.partnerWays.text2')}
                                </p>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {WAYS_TO_COLLABORATE.map((way, index) => (
            <div key={index} className="flex items-start gap-3 bg-background border border-border/60 p-5 rounded-lg shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <span className="text-content-primary font-medium">{way}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
