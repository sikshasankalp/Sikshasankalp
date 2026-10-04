import { useLanguage } from "../../../context/LanguageContext";

export function LibraryIntro() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('library.libraryIntro.text1')}</h2>
        <p className="text-body-large leading-relaxed max-w-3xl mx-auto">
          {t('library.libraryIntro.text2')}
                          </p>
      </div>
    </section>
  );
}
