import { PlaceholderImage } from '../../common/PlaceholderImage';

export function MediaHero() {
  return (
    <section className="relative pt-4 pb-8 md:pt-[24px] md:pb-[48px] overflow-hidden border-b border-border/50">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[4fr_6fr] lg:gap-12 xl:gap-[80px] items-center pt-2">
          <div className="flex flex-col max-w-[580px] lg:ml-6 xl:ml-10">
            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
              Media Coverage
            </h1>
            <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary">
              Documenting the external coverage and independent reporting of Shiksha Sankalp Foundation's work on the ground.
            </p>
          </div>
          
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 mt-6 lg:mt-0">
            <PlaceholderImage className="w-full h-full border-none" text="Media Coverage Real Photo" />
          </div>
        </div>
      </div>
    </section>
  );
}
