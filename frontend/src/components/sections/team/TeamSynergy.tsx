import { useLanguage } from "../../../context/LanguageContext";

export function TeamSynergy() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('team.teamSynergy.text1')}</h2>
        <p className="text-body-large leading-relaxed max-w-3xl mx-auto">
          {t('team.teamSynergy.text2')}
                          </p>
      </div>
    </section>
  );
}
