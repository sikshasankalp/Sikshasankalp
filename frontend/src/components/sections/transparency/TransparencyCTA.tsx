import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function TransparencyCTA() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('transparency.transparencyCTA.text1')}</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto text-content-secondary">
          {t('transparency.transparencyCTA.text2')}
                          </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/contact" variant="outline" size="lg" className="w-full sm:w-auto">
            {t('transparency.transparencyCTA.text3')}
                                </Button>
          <Button to="/donate" variant="primary" size="lg" className="w-full sm:w-auto">
            {t('transparency.transparencyCTA.text4')}
                                </Button>
        </div>
      </div>
    </section>
  );
}
