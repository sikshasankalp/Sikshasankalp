import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useLanguage } from "../../../context/LanguageContext";

export function PartnerHero() {
    const { t } = useLanguage();
  return (
    <section className="relative pt-4 pb-8 md:pt-[24px] md:pb-[48px] overflow-hidden border-b border-border/50">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[5fr_5fr] lg:gap-12 xl:gap-[80px] items-center pt-2">
          <div className="flex flex-col max-w-[620px] lg:ml-6 xl:ml-10">
            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
              {t('partner.partnerHero.text1')}
                                      </h1>
            <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary mb-[32px]">
              {t('partner.partnerHero.text2')}
                                      </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button to="#partner-form" variant="primary" size="lg" className="w-full sm:w-auto">
                {t('partner.partnerHero.text3')}
                                            </Button>
              <Button to="/programs" variant="outline" size="lg" className="w-full sm:w-auto">
                {t('partner.partnerHero.text4')}
                                            </Button>
            </div>
          </div>
          
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 mt-10 lg:mt-0">
            <PlaceholderImage className="w-full h-full border-none" text="Partnership & Community Action Placeholder" />
          </div>
        </div>
      </div>
    </section>
  );
}
