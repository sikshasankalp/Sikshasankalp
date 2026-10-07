import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function InvolvedOtherWays() {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-5xl mx-auto text-center">
        <h2 className="text-h2 mb-10">{t('get-Involved.involvedOtherWays.text1')}</h2>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-background border border-border rounded-xl p-8 flex flex-col items-center text-center hover:border-brand-primary/40 transition-colors">
            <h3 className="text-xl font-bold text-content-primary mb-3">{t('get-Involved.involvedOtherWays.text2')}</h3>
            <p className="text-sm text-content-secondary mb-6 flex-grow">
              {t('get-Involved.involvedOtherWays.text3')}
            </p>
            <Button to="/partner-with-us" variant="interactive" size="sm" className="w-full">
              {t('get-Involved.involvedOtherWays.text4')}
            </Button>
          </div>
          
          <div className="bg-background border border-border rounded-xl p-8 flex flex-col items-center text-center hover:border-brand-primary/40 transition-colors">
            <h3 className="text-xl font-bold text-content-primary mb-3">{t('get-Involved.involvedOtherWays.text5')}</h3>
            <p className="text-sm text-content-secondary mb-6 flex-grow">
              {t('get-Involved.involvedOtherWays.text6')}
            </p>
            <Button to="/donate" variant="accent" size="sm" arrow className="w-full">
              {t('get-Involved.involvedOtherWays.text7')}
            </Button>
          </div>
          
          <div className="bg-background border border-border rounded-xl p-8 flex flex-col items-center text-center hover:border-brand-primary/40 transition-colors">
            <h3 className="text-xl font-bold text-content-primary mb-3">{t('get-Involved.involvedOtherWays.text8')}</h3>
            <p className="text-sm text-content-secondary mb-6 flex-grow">
              {t('get-Involved.involvedOtherWays.text9')}
            </p>
            <Button to="/contact" variant="interactive" size="sm" className="w-full">
              {t('get-Involved.involvedOtherWays.text10')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
