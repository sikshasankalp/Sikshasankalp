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
        <div className="grid lg:grid-cols-[1.1fr_1fr] lg:gap-8 xl:gap-12 items-center pt-1 lg:pt-2">
          <div className="flex flex-col max-w-[580px] lg:ml-4 xl:ml-8">
            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
              {t('home.heroSection.title1')}
            </h1>
            <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary mb-[24px] lg:mb-[32px]">
              {t('home.heroSection.desc1')}
            </p>
            <p className="text-[16px] lg:text-[17px] leading-[1.618] text-content-primary/80 mb-[32px] lg:mb-[48px]">
              {t('home.heroSection.text1')}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button to="/our-story" variant="interactive">
                {t('home.heroSection.btn1')}
              </Button>
              <span className="hidden sm:inline-block text-border text-2xl font-light select-none">|</span>
              <Button to="/programs" variant="interactive">
                {t('home.heroSection.btn2')}
              </Button>
            </div>
            
            <div className="mt-8 md:mt-10 pt-5 border-t border-border">
              <Button to="/digital-library" variant="ghost" className="text-[15px] font-medium px-0 hover:bg-transparent hover:text-brand-primary">
                {t('home.heroSection.text2')}
              </Button>
            </div>
          </div>
          
          <div className="w-full flex justify-center lg:justify-start">
            <HeroCarousel items={heroItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
