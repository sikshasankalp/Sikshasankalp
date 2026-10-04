import { useLanguage } from "../../../context/LanguageContext";

export function MediaWhyItMatters() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background border-t border-border/50">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('media.mediaWhyItMatters.text1')}</h2>
        <p className="text-body-large leading-relaxed max-w-3xl mx-auto">
          {t('media.mediaWhyItMatters.text2')}
                          </p>
      </div>
    </section>
  );
}
