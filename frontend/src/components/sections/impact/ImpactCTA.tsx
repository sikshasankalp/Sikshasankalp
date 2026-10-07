import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function ImpactCTA() {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('impact.impactCTA.text1')}</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          {t('impact.impactCTA.text2')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/programs" variant="interactive">
            {t('impact.impactCTA.text3')}
          </Button>
          <Button to="/get-involved" variant="interactive">
            {t('impact.impactCTA.text4')}
          </Button>
          <Button to="/donate" variant="accent" size="lg" arrow className="w-full sm:w-auto min-w-[180px]">
            {t('impact.impactCTA.text5')}
          </Button>
        </div>
      </div>
    </section>
  );
}
