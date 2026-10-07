import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function ClosingCTA() {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-background border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('about.closingCTA.text1')}</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          {t('about.closingCTA.text2')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/programs" variant="accent" size="lg" arrow>
            {t('about.closingCTA.text3')}
          </Button>
          <Button to="/donate" variant="accent" size="lg" arrow className="w-full sm:w-auto min-w-[180px]">
            {t('about.closingCTA.text4')}
          </Button>
        </div>
        <div className="mt-8">
          <Button to="/impact" variant="outline" size="lg" arrow>
            {t('about.closingCTA.text5')}
          </Button>
        </div>
      </div>
    </section>
  );
}
