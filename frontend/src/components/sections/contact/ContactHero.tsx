import { useLanguage } from "../../../context/LanguageContext";

export function ContactHero() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h1 className="text-h1 mb-6">{t('contact.contactHero.text1')}</h1>
        <p className="text-body-large leading-relaxed max-w-3xl mx-auto">
          {t('contact.contactHero.text2')}
                          </p>
      </div>
    </section>
  );
}
