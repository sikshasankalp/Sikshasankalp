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

// Real Foundation Hero Slide (Matches the uploaded slide in Admin Console)
const DEFAULT_HERO_SLIDES = [
  {
    id: 'hero-foundation-main',
    title: 'Footpath Se School Tak: Siksha Sankalp Badal Raha Hai Bachho Ka Bhavishya',
    description: 'Siksha Sankalp Foundation brings free foundational education and formal school admissions to underprivileged children living on streets.',
    imageUrl: '/logo/logo.jpeg',
    category: 'FOOTPATH_EDUCATION',
    tags: ['Ground Reality', 'School Admission', 'Street to School'],
  },
];

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const css = `
    .HeroCreativeSwiper {
      width: 100% !important;
      height: 100% !important;
      padding-bottom: 0 !important;
    }
    
    .HeroCreativeSwiper .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 100% !important;
      height: 100% !important;
      border-radius: 24px;
      overflow: hidden;
      position: relative;
    }

    @media (min-width: 640px) {
      .HeroCreativeSwiper .swiper-slide {
        border-radius: 28px;
      }
    }

    .HeroCreativeSwiper .swiper-pagination {
      bottom: 12px !important;
      z-index: 20 !important;
    }

    .HeroCreativeSwiper .swiper-pagination-bullet {
      background: #ffffff !important;
      opacity: 0.5;
      transition: all 0.3s ease;
      width: 7px;
      height: 7px;
    }

    .HeroCreativeSwiper .swiper-pagination-bullet-active {
      opacity: 1 !important;
      background: #C85A27 !important;
      width: 22px !important;
      border-radius: 9999px !important;
    }
  `;

  // Use admin-uploaded HOME_HERO slides if present, otherwise use real foundation default slide
  const activeSlides = items && items.length > 0 ? items : DEFAULT_HERO_SLIDES;
  const loopMode = activeSlides.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="relative w-full max-w-[720px] lg:max-w-none aspect-[16/11.5] sm:aspect-[16/11.5] lg:aspect-[16/11.5] xl:aspect-[16/11] min-h-[300px] sm:min-h-[420px] lg:min-h-[500px] xl:min-h-[520px] max-h-[570px] rounded-[22px] sm:rounded-[28px] overflow-hidden shadow-elevated border border-border/60 select-none"
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={0}
        autoplay={{
          delay: 4500,
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
        {activeSlides.map((slide, index) => {
          const itemSlide = slide as (GalleryItem & { tags?: string[] });
          const tags = itemSlide.tags || (itemSlide.category
            ? [itemSlide.category.replace(/_/g, ' ')]
            : ['Ground Reality', 'Footpath Education']);

          return (
            <SwiperSlide key={slide.id || index}>
              <div className="relative w-full h-full bg-stone-900 overflow-hidden">
                {/* 100% Bright, natural, clear image without heavy dark filters */}
                <img
                  src={slide.imageUrl}
                  alt={slide.title || 'Siksha Sankalp Foundation'}
                  className="w-full h-full object-cover transition-transform duration-700"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Soft bottom readability gradient: leaves top 60% completely bright and clear */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-7 md:p-8 text-white z-10 pointer-events-none">
                  <h3 className="font-display font-bold text-white text-base sm:text-xl md:text-2xl leading-snug mb-2 drop-shadow-md">
                    {slide.title}
                  </h3>

                  {slide.description && (
                    <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 drop-shadow-sm max-w-xl">
                      {slide.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                    {tags.map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="px-2.5 sm:px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/25 shadow-xs"
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
    </motion.div>
  );
};

export default HeroCarousel;
