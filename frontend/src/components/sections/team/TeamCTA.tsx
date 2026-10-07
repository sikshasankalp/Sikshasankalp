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
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button to="/get-involved" variant="accent" size="lg" arrow>
            {t('team.teamCTA.text3')}
          </Button>
          <Button to="/contact" variant="outline" size="lg" arrow>
            {t('team.teamCTA.text4')}
          </Button>
        </div>
      </div>
    </section>
  );
}
