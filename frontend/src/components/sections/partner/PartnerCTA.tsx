import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function PartnerCTA() {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-default max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-brand-primary mb-6">
          {t('partner.partnerCTA.text1')}
        </h2>
        <p className="text-xl md:text-2xl text-content-secondary leading-relaxed font-light mb-10">
          {t('partner.partnerCTA.text2')}
        </p>
        <Button to="#partner-form" variant="accent" size="lg" arrow>
          {t('partner.partnerCTA.text3')}
        </Button>
      </div>
    </section>
  );
}
