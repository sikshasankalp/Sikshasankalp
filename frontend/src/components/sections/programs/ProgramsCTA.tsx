import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function ProgramsCTA() {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('programs.programsCTA.text1')}</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          {t('programs.programsCTA.text2')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/impact" variant="accent" size="lg" arrow>
            {t('programs.programsCTA.text3')}
          </Button>
          <Button to="/get-involved" variant="outline" size="lg" arrow>
            {t('programs.programsCTA.text4')}
          </Button>
          <Button to="/donate" variant="accent" size="lg" arrow className="w-full sm:w-auto min-w-[180px]">
            {t('programs.programsCTA.text5')}
          </Button>
        </div>
      </div>
    </section>
  );
}
