import { useLanguage } from "../../../context/LanguageContext";

export function WhoWeAre() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-4xl">
        <h2 className="text-h2 mb-6 md:mb-8 text-center">
          {t('about.whoWeAre.text1')}
                          </h2>
        <div className="space-y-6 text-body-large text-content-secondary leading-relaxed">
          <p>
            {t('about.whoWeAre.text2')}
                                </p>
          <p>
            {t('about.whoWeAre.text3')}
                                </p>
        </div>
      </div>
    </section>
  );
}
