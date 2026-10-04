import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function ImpactTransparency() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('impact.impactTransparency.text1')}</h2>
        <p className="text-body-large mb-10 leading-relaxed max-w-2xl mx-auto">
          {t('impact.impactTransparency.text2')}
                          </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/gallery" variant="outline" size="lg" className="w-full sm:w-auto">
            {t('impact.impactTransparency.text3')}
                                </Button>
          <Button to="/media" variant="outline" size="lg" className="w-full sm:w-auto">
            {t('impact.impactTransparency.text4')}
                                </Button>
          <Button to="/transparency" variant="outline" size="lg" className="w-full sm:w-auto">
            {t('impact.impactTransparency.text5')}
                                </Button>
        </div>
      </div>
    </section>
  );
}
