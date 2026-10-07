import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function GetInvolvedSection() {
    const { t } = useLanguage();
  return (
    <section className="py-14 md:py-20 bg-brand-primary text-white">
      <div className="container-default text-center max-w-2xl mx-auto">
        <h2 className="text-h2 mb-4">{t('home.getInvolvedSection.title1')}</h2>
        <p className="text-base md:text-lg text-brand-sand mb-8 leading-relaxed">
          {t('home.getInvolvedSection.text1')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button to="/get-involved" variant="secondary" size="lg" arrow className="w-full sm:w-auto">
            {t('home.getInvolvedSection.text2')}
          </Button>
          <Button to="/partner-with-us" variant="outline-inverse" size="lg" arrow className="w-full sm:w-auto font-medium">
            {t('home.getInvolvedSection.text3')}
          </Button>
        </div>
      </div>
    </section>
  );
}
