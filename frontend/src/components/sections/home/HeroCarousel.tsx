import React from 'react';
import { motion } from 'framer-motion';
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { GalleryItem } from '../../../services/api/gallery';

import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface HeroCarouselProps {
  items: GalleryItem[];
}

// Fallback preview data shown when no images have been uploaded yet to admin gallery
// (Uses real NGO context and bottom metadata overlay exactly matching user reference)
const DEFAULT_HERO_SLIDE = {
  id: 'default-hero-1',
  title: 'Footpath Se School Tak: Siksha Sankalp Badal Raha Hai Bachho Ka Bhavishya',
  description: 'Siksha Sankalp Foundation brings free foundational education and formal school admissions to underprivileged children living on streets.',
  tags: ['Ground Reality', 'School Admission', 'Street to School'],
};

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const css = `
    .HeroCreativeSwiper {
      width: 100%;
      height: 440px;
      padding-bottom: 40px !important;
    }
    
    .HeroCreativeSwiper .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 290px;
      border-radius: 26px;
      overflow: hidden;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.2);
      position: relative;
    }

    @media (min-width: 480px) {
      .HeroCreativeSwiper .swiper-slide {
        width: 340px;
      }
    }

    @media (min-width: 768px) {
      .HeroCreativeSwiper {
        height: 480px;
      }
      .HeroCreativeSwiper .swiper-slide {
        width: 400px;
      }
    }

    @media (min-width: 1280px) {
      .HeroCreativeSwiper {
        height: 500px;
      }
      .HeroCreativeSwiper .swiper-slide {
        width: 440px;
      }
    }

    .HeroCreativeSwiper .swiper-pagination-bullet {
      background: #C85A27 !important;
      opacity: 0.35;
      transition: all 0.3s ease;
      width: 8px;
      height: 8px;
    }

    .HeroCreativeSwiper .swiper-pagination-bullet-active {
      opacity: 1 !important;
      width: 22px !important;
      border-radius: 9999px !important;
    }
  `;

  const hasImages = items && items.length > 0;
  const loopMode = items && items.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative w-full max-w-full lg:max-w-[500px] xl:max-w-[540px] mx-auto lg:mx-0 lg:-ml-2 xl:-ml-4 select-none"
    >
      <style>{css}</style>

      {hasImages ? (
        <Swiper
          spaceBetween={0}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          effect="creative"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loopMode}
          pagination={{ clickable: true }}
          className="HeroCreativeSwiper"
          creativeEffect={{
            prev: {
              shadow: true,
              origin: 'left center',
              translate: ['-5%', 0, -200],
              rotate: [0, 100, 0],
            },
            next: {
              origin: 'right center',
              translate: ['5%', 0, -200],
              rotate: [0, -100, 0],
            },
          }}
          modules={[EffectCreative, Pagination, Autoplay]}
        >
          {items.map((item, index) => {
            // Extract or infer badges/tags from category or title
            const tags = item.category
              ? [item.category.replace(/_/g, ' ')]
              : ['Street to School', 'Foundational Siksha'];

            return (
              <SwiperSlide key={item.id || index}>
                <div className="relative w-full h-full bg-stone-900 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Siksha Sankalp Hero Image'}
                    className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-110"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Dark gradient overlay at bottom with metadata */}
                  <div className="absolute inset-x-0 bottom-0 pt-28 pb-5 px-5 sm:px-6 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col justify-end text-white z-10">
                    <h3 className="font-display font-bold text-white text-base sm:text-lg md:text-xl leading-tight mb-2 drop-shadow-md">
                      {item.title || 'Footpath Se School Tak: Siksha Sankalp'}
                    </h3>

                    {item.description && (
                      <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3 drop-shadow-xs">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        /* Clean placeholder card showing exact bottom overlay structure until images are uploaded in admin */
        <div className="w-full h-[400px] sm:h-[450px] md:h-[480px] rounded-[26px] overflow-hidden bg-gradient-to-b from-[#EFEAE2] to-[#DED5C7] border border-border shadow-elevated relative flex flex-col justify-end">
          {/* Subtle background branding pattern */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-40">
            <span className="font-display font-bold text-2xl sm:text-3xl text-content-primary/40 uppercase tracking-widest">
              Siksha Sankalp
            </span>
            <span className="text-xs sm:text-sm text-content-secondary mt-1">
              Upload images in Admin Gallery with &quot;HOME_HERO&quot; tag to display live slides
            </span>
          </div>

          {/* Bottom Data Overlay as requested */}
          <div className="relative z-10 pt-24 pb-6 px-5 sm:px-6 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col justify-end text-white">
            <h3 className="font-display font-bold text-white text-base sm:text-lg md:text-xl leading-tight mb-2 drop-shadow-md">
              {DEFAULT_HERO_SLIDE.title}
            </h3>

            <p className="text-white/85 text-xs sm:text-sm leading-relaxed mb-3 drop-shadow-xs">
              {DEFAULT_HERO_SLIDE.description}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {DEFAULT_HERO_SLIDE.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HeroCarousel;
