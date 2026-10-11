import { Button } from '../../buttons/Button';
import { useState, useEffect } from 'react';
import { fetchGallery } from '../../../services/api/gallery';
import type { GalleryItem } from '../../../services/api/gallery';
import { useLanguage } from "../../../context/LanguageContext";
import { HeroCarousel } from './HeroCarousel';

const CACHED_HERO_KEY = 'siksha_hero_slides_cache';
const DEFAULT_HERO_SLIDE: GalleryItem = {
  id: 'c98e3a72-5219-4edb-907e-9e041ec021c8',
  title: 'Footpath Se School Tak: Siksha Sankalp Badal Raha Hai Bachho Ka Bhavishya',
  description: 'Siksha Sankalp Foundation brings free foundational education and formal school admissions to underprivileged children living on streets.',
  imageUrl: '/logo/logo.jpeg',
  category: 'FOOTPATH_EDUCATION',
  displayLocation: 'HOME_HERO',
  isFeatured: true,
  isPublished: true,
  createdAt: '2026-10-08T20:30:27.278Z',
};

export function HeroSection() {
  const { t } = useLanguage();
  const [heroItems, setHeroItems] = useState<GalleryItem[]>(() => {
    try {
      const cached = localStorage.getItem(CACHED_HERO_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [DEFAULT_HERO_SLIDE];
  });

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
          try {
            localStorage.setItem(CACHED_HERO_KEY, JSON.stringify(validHeroItems));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Failed to load hero images:', err);
      }
    };
    loadHeroImages();
  }, []);

  return (
    <section className="relative pt-4 sm:pt-8 md:pt-10 lg:pt-14 pb-8 sm:pb-12 md:pb-16 overflow-hidden w-full max-w-full">
      <div className="w-full max-w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1.22fr] lg:gap-8 xl:gap-10 items-start w-full min-w-0">
          {/* Left Column: Golden ratio 1.618 typography hierarchy and spacing */}
          <div className="flex flex-col w-full min-w-0 max-w-[540px] lg:ml-2 xl:ml-4">
            <div className="w-full min-w-0">
              {/* Heading: Responsive on mobile, exactly 44px on desktop */}
              <h1 className="text-[22px] xs:text-[25px] sm:text-[34px] md:text-[40px] lg:text-[44px] leading-[1.22] lg:leading-[1.18] font-bold tracking-tight text-content-primary mb-[14px] sm:mb-[18px] lg:mb-[20px] break-words">
                {t('home.heroSection.title1') || "Every child has the right to education, dignity and a better future"}
              </h1>

              {/* Subheading: Reduced by 1px (25px on desktop) */}
              <p className="text-[14px] xs:text-[16px] sm:text-[20px] lg:text-[25px] leading-snug sm:leading-[1.38] font-medium text-content-secondary mb-[14px] sm:mb-[18px] lg:mb-[20px] break-words">
                {t('home.heroSection.desc1') || "Taking underprivileged children from the world of pavements to the world of schools."}
              </p>

              {/* Body Content: Reduced by 2px (14px on desktop) */}
              <p className="text-[12px] xs:text-[12.5px] sm:text-[13.5px] lg:text-[14px] leading-[1.6] lg:leading-[1.618] text-content-secondary mb-[22px] sm:mb-[28px] lg:mb-[32px] break-words">
                {t('home.heroSection.text1') || "Siksha Sankalp Foundation works at the grassroots level to connect underprivileged and needy children with education, mainstream schools and better opportunities. Our efforts are not limited to education only, but to empower children and families with respect, confidence and a better future."}
              </p>
            </div>
            
            <div className="flex items-center gap-2.5 sm:gap-4 w-full">
              <Button 
                to="/our-story" 
                variant="interactive"
                className="flex-1 sm:flex-initial text-xs xs:text-sm px-3 xs:px-5 sm:px-7 min-w-0"
              >
                {t('home.heroSection.btn1') || "Our Story"}
              </Button>
              <span className="hidden sm:inline-block text-border text-2xl font-light select-none">|</span>
              <Button 
                to="/programs" 
                variant="interactive"
                className="flex-1 sm:flex-initial text-xs xs:text-sm px-3 xs:px-5 sm:px-7 min-w-0"
              >
                {t('home.heroSection.btn2') || "See Our Work"}
              </Button>
            </div>

            {/* Divider link placed neatly below the action buttons */}
            <div className="pt-3.5 sm:pt-4 border-t border-border mt-3.5 sm:mt-4 w-full">
              <Button 
                to="/digital-library" 
                variant="ghost" 
                className="text-[12.5px] xs:text-[13px] sm:text-[15px] font-medium px-3 sm:px-0 hover:bg-transparent hover:text-brand-primary w-full sm:w-auto justify-center sm:justify-start"
              >
                {t('home.heroSection.text2') || "Free Digital Siksha & Library →"}
              </Button>
            </div>
          </div>
          
          {/* Right Column: Aligned to the top of the left text box on desktop, clean margin on mobile */}
          <div className="w-full min-w-0 flex justify-center lg:justify-end mt-5 sm:mt-6 lg:mt-0 self-start">
            <HeroCarousel items={heroItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
