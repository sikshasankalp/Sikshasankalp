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

const DEFAULT_HERO_SLIDE = {
  id: 'default-hero-1',
  title: 'Footpath Se School Tak: Siksha Sankalp Badal Raha Hai Bachho Ka Bhavishya',
  description: 'Siksha Sankalp Foundation brings free foundational education and formal school admissions to underprivileged children living on streets.',
  tags: ['Ground Reality', 'School Admission', 'Street to School'],
};

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const css = `
    .HeroCreativeSwiper {
      width: 100% !important;
      height: 100% !important;
      min-height: 460px;
      padding-bottom: 25px !important;
    }
    
    .HeroCreativeSwiper .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 100% !important;
      height: 100%;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 45px -8px rgba(0, 0, 0, 0.28);
      position: relative;
    }

    @media (min-width: 640px) {
      .HeroCreativeSwiper {
        min-height: 500px;
      }
    }

    @media (min-width: 1024px) {
      .HeroCreativeSwiper {
        min-height: 540px;
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
      width: 24px !important;
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
      className="relative w-full h-full min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] select-none flex flex-col"
    >
      <style>{css}</style>

      {hasImages ? (
        <Swiper
          spaceBetween={0}
          autoplay={{
            delay: 4000,
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
              rotate: [0, 80, 0],
            },
            next: {
              origin: 'right center',
              translate: ['5%', 0, -200],
              rotate: [0, -80, 0],
            },
          }}
          modules={[EffectCreative, Pagination, Autoplay]}
        >
          {items.map((item, index) => {
            const tags = item.category
              ? [item.category.replace(/_/g, ' ')]
              : ['Ground Reality', 'School Admission', 'Street to School'];

            return (
              <SwiperSlide key={item.id || index}>
                <div className="relative w-full h-full bg-[#141210] overflow-hidden rounded-[28px]">
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Siksha Sankalp Hero Image'}
                    className="w-full h-full object-cover opacity-50 filter brightness-75 contrast-125"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Clean deep overlay: ensures no background words clash with the title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/30 flex flex-col justify-end p-6 sm:p-8 md:p-10 text-white z-10">
                    <h3 className="font-display font-bold text-white text-lg sm:text-2xl md:text-3xl leading-snug mb-3 drop-shadow-sm">
                      {item.title || DEFAULT_HERO_SLIDE.title}
                    </h3>

                    {item.description && (
                      <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3.5 py-1 rounded-full text-xs sm:text-[13px] font-medium bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-xs"
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
        /* Clean landscape rectangle card filling the available space */
        <div className="w-full h-full min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] rounded-[28px] overflow-hidden bg-gradient-to-b from-[#2a241f] via-[#1c1917] to-[#141210] border border-border shadow-elevated relative flex flex-col justify-end p-6 sm:p-8 md:p-10 text-white">
          <div className="relative z-10 flex flex-col justify-end">
            <h3 className="font-display font-bold text-white text-lg sm:text-2xl md:text-3xl leading-snug mb-3 drop-shadow-sm">
              {DEFAULT_HERO_SLIDE.title}
            </h3>

            <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed mb-4 line-clamp-3">
              {DEFAULT_HERO_SLIDE.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {DEFAULT_HERO_SLIDE.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-3.5 py-1 rounded-full text-xs sm:text-[13px] font-medium bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-xs"
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
