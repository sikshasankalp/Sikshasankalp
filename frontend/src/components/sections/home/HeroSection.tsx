import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useState, useEffect } from 'react';
import { fetchGallery } from '../../../services/api/gallery';
import type { GalleryItem } from '../../../services/api/gallery';
import { useLanguage } from "../../../context/LanguageContext";

export function HeroSection() {
    const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadHeroImage = async () => {
      try {
        const items = await fetchGallery({ displayLocation: 'HOME_HERO' });
        if (items && items.length > 0) {
          setHeroImage(items[0]);
        }
      } catch (err) {
        console.error('Failed to load hero image:', err);
      }
    };
    loadHeroImage();
  }, []);

  return (
    <section className="relative pt-6 pb-12 md:pt-[32px] md:pb-[72px] overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[1.1fr_1fr] lg:gap-12 xl:gap-[80px] items-start pt-2 lg:pt-4">
          <div className="flex flex-col max-w-[580px] lg:ml-6 xl:ml-10">
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
              <Button to="/our-story" variant="primary" size="lg" arrow>
                {t('home.heroSection.btn1')}
              </Button>
              <Button to="/programs" variant="outline" size="lg" arrow>
                {t('home.heroSection.btn2')}
              </Button>
            </div>
            
            <div className="mt-8 md:mt-10 pt-5 border-t border-border">
              <Button to="/digital-library" variant="ghost" className="text-[15px] font-medium px-0 hover:bg-transparent hover:text-brand-primary">
                {t('home.heroSection.text2')}
                                            </Button>
            </div>
          </div>
          
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50">
            {heroImage ? (
              <img 
                src={heroImage.imageUrl} 
                alt={heroImage.title || "Hero Image"} 
                className="w-full h-full object-cover" loading="eager" decoding="sync" 
              />
            ) : (
              <PlaceholderImage className="w-full h-full border-none" text="Hero Image" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
