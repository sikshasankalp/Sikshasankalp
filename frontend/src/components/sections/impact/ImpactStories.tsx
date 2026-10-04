import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useLanguage } from "../../../context/LanguageContext";

export function ImpactStories() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted border-y border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <h2 className="text-h2 mb-12">{t('impact.impactStories.text1')}</h2>
        
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 bg-background rounded-xl border border-border overflow-hidden p-6 md:p-10">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50">
            <PlaceholderImage className="w-full h-full border-none" text="Beneficiary Real Photo" />
          </div>
          
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-sm font-display text-brand-primary uppercase tracking-wider font-bold mb-2">{t('impact.impactStories.text2')}</h3>
              <h4 className="text-2xl font-bold text-content-primary">{t('impact.impactStories.text3')}</h4>
            </div>
            
            <div className="space-y-4 text-body-large text-content-secondary">
              <p><strong>{t('impact.impactStories.text4')}</strong> {t('impact.impactStories.text5')}</p>
              <p><strong>{t('impact.impactStories.text6')}</strong> {t('impact.impactStories.text7')}</p>
              <p><strong>{t('impact.impactStories.text8')}</strong> {t('impact.impactStories.text9')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
