import { useLanguage } from "../../../context/LanguageContext";

export function ImpactDignity() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('impact.impactDignity.text1')}</h2>
        <div className="space-y-6 text-body-large text-content-secondary leading-relaxed text-left md:text-center max-w-3xl mx-auto">
          <p>
            {t('impact.impactDignity.text2')}
                                </p>
          <p>
            {t('impact.impactDignity.text3')}
                                </p>
        </div>
      </div>
    </section>
  );
}
