import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function LibrarySupportCTA() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('library.librarySupportCTA.text1')}</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          {t('library.librarySupportCTA.text2')}
                          </p>
        
        <Button to="/donate" variant="primary" size="lg">
          {t('library.librarySupportCTA.text3')}
                          </Button>
      </div>
    </section>
  );
}
