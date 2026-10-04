import { useLanguage } from "../../../context/LanguageContext";

const REASONS = [
  { title: 'Ground-Level Work', desc: 'We do not just advocate; we work directly on the footpaths, slums, and communities where the need is greatest.' },
  { title: 'Education-Focused Mission', desc: 'Every initiative we undertake ultimately connects back to bridging the gap between underprivileged children and mainstream education.' },
  { title: 'Community Engagement', desc: 'We build trust with families and communities, ensuring interventions are welcomed and sustainable.' },
  { title: 'Direct Involvement', desc: 'Our team works directly with the children, ensuring resources reach the intended beneficiaries without dilution.' },
  { title: 'Transparent Documentation', desc: 'We maintain clear records of our work, impact, and operations, providing partners with verifiable accountability.' }
];

export function PartnerWhyUs() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-h2 mb-4">{t('partner.partnerWhyUs.text1')}</h2>
        </div>
        
        <div className="space-y-8">
          {REASONS.map((reason, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-8 border-b border-border/60 pb-8 last:border-0 last:pb-0">
              <h3 className="text-xl font-bold text-content-primary md:w-1/3 shrink-0">{reason.title}</h3>
              <p className="text-body-large text-content-secondary md:w-2/3 leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
