import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function TeamCTA() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('team.teamCTA.text1')}</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          {t('team.teamCTA.text2')}
                          </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/get-involved" variant="outline" size="lg" className="w-full sm:w-auto">
            {t('team.teamCTA.text3')}
                                </Button>
          <Button to="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
            {t('team.teamCTA.text4')}
                                </Button>
        </div>
      </div>
    </section>
  );
}
