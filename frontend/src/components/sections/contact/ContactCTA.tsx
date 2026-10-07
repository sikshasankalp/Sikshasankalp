import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function ContactCTA() {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24 bg-surface-muted">
      <div className="container-default max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-brand-primary mb-6">
          {t('contact.contactCTA.text1')}
        </h2>
        <p className="text-xl md:text-2xl text-content-secondary leading-relaxed font-light mb-10">
          {t('contact.contactCTA.text2')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button to="/programs" variant="interactive">
            {t('contact.contactCTA.text3')}
          </Button>
          <span className="hidden sm:inline text-border text-lg font-light select-none">|</span>
          <Button to="/get-involved" variant="interactive">
            {t('contact.contactCTA.text4')}
          </Button>
        </div>
      </div>
    </section>
  );
}
