import { Button } from '../../buttons/Button';
import { useState, useEffect } from 'react';
import { fetchGallery } from '../../../services/api/gallery';
import type { GalleryItem } from '../../../services/api/gallery';
import { useLanguage } from "../../../context/LanguageContext";
import { HeroCarousel } from './HeroCarousel';

export function HeroSection() {
  const { t } = useLanguage();
  const [heroItems, setHeroItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        let items = await fetchGallery({ displayLocation: 'HOME_HERO' });
        if (!items || items.length === 0) {
          items = await fetchGallery({ isFeatured: 'true' });
        }
        if (!items || items.length === 0) {
          items = await fetchGallery();
        }
        if (items && items.length > 0) {
          setHeroItems(items);
        }
      } catch (err) {
        console.error('Failed to load hero images:', err);
      }
    };
    loadHeroImages();
  }, []);

  return (
    <section className="relative pt-3 sm:pt-4 md:pt-6 pb-12 md:pb-[72px] overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[1.05fr_1fr] lg:gap-8 xl:gap-12 items-stretch pt-1 lg:pt-2">
          {/* Left Column: Main hero content and primary actions */}
          <div className="flex flex-col justify-between max-w-[580px] lg:ml-4 xl:ml-8 pb-5 lg:pb-6">
            <div>
              <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
                {t('home.heroSection.title1')}
              </h1>
              <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary mb-[24px] lg:mb-[32px]">
                {t('home.heroSection.desc1')}
              </p>
              <p className="text-[16px] lg:text-[17px] leading-[1.618] text-content-primary/80 mb-[32px] lg:mb-[40px]">
                {t('home.heroSection.text1')}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button to="/our-story" variant="interactive">
                {t('home.heroSection.btn1')}
              </Button>
              <span className="hidden sm:inline-block text-border text-2xl font-light select-none">|</span>
              <Button to="/programs" variant="interactive">
                {t('home.heroSection.btn2')}
              </Button>
            </div>
          </div>
          
          {/* Right Column: Image carousel ending flush at the row's bottom edge */}
          <div className="w-full h-full flex flex-col">
            <HeroCarousel items={heroItems} />
          </div>
        </div>

        {/* Divider line placed directly at the bottom level of the carousel card */}
        <div className="max-w-[580px] lg:ml-4 xl:ml-8 pt-4 border-t border-border mt-0">
          <Button to="/digital-library" variant="ghost" className="text-[15px] font-medium px-0 hover:bg-transparent hover:text-brand-primary">
            {t('home.heroSection.text2')}
          </Button>
        </div>
      </div>
    </section>
  );
}
