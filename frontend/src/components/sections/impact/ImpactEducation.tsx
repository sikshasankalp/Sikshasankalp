import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useLanguage } from "../../../context/LanguageContext";

export function ImpactEducation() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="flex flex-col">
            <h2 className="text-h2 mb-6">{t('impact.impactEducation.text1')}</h2>
            <div className="space-y-6 text-body-large text-content-secondary leading-relaxed">
              <p>
                {t('impact.impactEducation.text2')}
                                            </p>
              <p>
                {t('impact.impactEducation.text3')}
                                            </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50">
            <PlaceholderImage className="w-full h-full border-none" text="Education Impact Real Photo" />
          </div>
        </div>
      </div>
    </section>
  );
}
