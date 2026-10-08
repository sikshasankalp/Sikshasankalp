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
        // Strictly fetch only slides intended for HOME_HERO
        const items = await fetchGallery({ displayLocation: 'HOME_HERO' });
        // Ensure no MEDIA_COVERAGE items ever leak into the Hero Carousel
        const validHeroItems = (items || []).filter(
          (item) => item.displayLocation === 'HOME_HERO' && item.category !== 'MEDIA_COVERAGE'
        );
        if (validHeroItems.length > 0) {
          setHeroItems(validHeroItems);
        } else {
          setHeroItems([]);
        }
      } catch (err) {
        console.error('Failed to load hero images:', err);
      }
    };
    loadHeroImages();
  }, []);

  return (
    <section className="relative pt-4 sm:pt-8 md:pt-10 lg:pt-14 pb-8 sm:pb-12 md:pb-16 overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1.22fr] lg:gap-8 xl:gap-10 items-start">
          {/* Left Column: Golden ratio 1.618 typography hierarchy and spacing */}
          <div className="flex flex-col max-w-[540px] lg:ml-2 xl:ml-4">
            <div>
              {/* Heading: Responsive on mobile, exactly 44px on desktop */}
              <h1 className="text-[26px] sm:text-[34px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.18] font-bold tracking-tight text-content-primary mb-[14px] sm:mb-[18px] lg:mb-[20px]">
                {t('home.heroSection.title1') || "Every child has the right to education, dignity and a better future"}
              </h1>

              {/* Subheading: Responsive on mobile, exactly 26px on desktop */}
              <p className="text-[17px] sm:text-[21px] lg:text-[26px] leading-[1.38] font-medium text-content-secondary mb-[14px] sm:mb-[18px] lg:mb-[20px]">
                {t('home.heroSection.desc1') || "Taking underprivileged children from the world of pavements to the world of schools."}
              </p>

              {/* Body Content: 16px with exact 1.618 golden ratio line-height & 32px margin on desktop */}
              <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.618] text-content-secondary mb-[22px] sm:mb-[28px] lg:mb-[32px]">
                {t('home.heroSection.text1') || "Siksha Sankalp Foundation works at the grassroots level to connect underprivileged and needy children with education, mainstream schools and better opportunities. Our efforts are not limited to education only, but to empower children and families with respect, confidence and a better future."}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Button to="/our-story" variant="interactive">
                {t('home.heroSection.btn1') || "Our Story"}
              </Button>
              <span className="hidden sm:inline-block text-border text-2xl font-light select-none">|</span>
              <Button to="/programs" variant="interactive">
                {t('home.heroSection.btn2') || "See Our Work"}
              </Button>
            </div>

            {/* Divider link placed neatly below the action buttons */}
            <div className="pt-3.5 sm:pt-4 border-t border-border mt-3.5 sm:mt-4">
              <Button to="/digital-library" variant="ghost" className="text-[13px] sm:text-[15px] font-medium px-0 hover:bg-transparent hover:text-brand-primary">
                {t('home.heroSection.text2') || "Free Digital Siksha & Library →"}
              </Button>
            </div>
          </div>
          
          {/* Right Column: Aligned to the top of the left text box on desktop, clean margin on mobile */}
          <div className="w-full flex justify-center lg:justify-end mt-5 sm:mt-6 lg:mt-0 self-start">
            <HeroCarousel items={heroItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
