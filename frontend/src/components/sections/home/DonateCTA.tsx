import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function DonateCTA() {
    const { t } = useLanguage();
  return (
    <section className="py-16 md:py-20 bg-surface-muted border-t border-border">
      <div className="container-default text-center max-w-xl mx-auto">
        <h2 className="text-h2 mb-3">{t('home.donateCTA.title1')}</h2>
        <p className="text-body-large mb-8">
          {t('home.donateCTA.text1')}
                          </p>
        <Button to="/donate" variant="accent" size="lg" className="w-full sm:w-auto min-w-[200px]">
          {t('home.donateCTA.text2')}
                          </Button>
      </div>
    </section>
  );
}
