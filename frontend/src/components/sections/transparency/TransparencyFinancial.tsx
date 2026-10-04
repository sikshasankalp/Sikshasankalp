import { useLanguage } from "../../../context/LanguageContext";

export function TransparencyFinancial() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted border-t border-border/50">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('transparency.transparencyFinancial.text1')}</h2>
        <p className="text-body-large leading-relaxed max-w-3xl mx-auto text-content-secondary">
          {t('transparency.transparencyFinancial.text2')}
                          </p>
      </div>
    </section>
  );
}
