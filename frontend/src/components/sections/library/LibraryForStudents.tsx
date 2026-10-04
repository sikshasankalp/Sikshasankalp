import { useLanguage } from "../../../context/LanguageContext";

export function LibraryForStudents() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('library.libraryForStudents.text1')}</h2>
        <p className="text-body-large leading-relaxed max-w-2xl mx-auto mb-8">
          {t('library.libraryForStudents.text2')}
                          </p>
        <p className="text-xl md:text-2xl font-display font-medium text-brand-primary">
          {t('library.libraryForStudents.text3')}
                          </p>
      </div>
    </section>
  );
}
