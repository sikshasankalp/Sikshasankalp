import { useLanguage } from "../../../context/LanguageContext";

export function TeamHero() {
    const { t } = useLanguage();
  return (
    <section className="relative pt-8 pb-12 md:pt-[48px] md:pb-[64px] overflow-hidden border-b border-border/50 bg-surface-muted/30">
      <div className="w-full px-4 md:px-8 lg:px-12 text-center max-w-3xl mx-auto">
        <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
          {t('team.teamHero.text1')}
                          </h1>
        <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary">
          {t('team.teamHero.text2')}
                          </p>
      </div>
    </section>
  );
}
