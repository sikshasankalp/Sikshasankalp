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
      width: 100%;
      height: 520px;
      padding-bottom: 45px !important;
    }
    
    .HeroCreativeSwiper .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 310px;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 20px 45px -8px rgba(0, 0, 0, 0.28);
      position: relative;
    }

    @media (min-width: 480px) {
      .HeroCreativeSwiper {
        height: 560px;
      }
      .HeroCreativeSwiper .swiper-slide {
        width: 380px;
      }
    }

    @media (min-width: 768px) {
      .HeroCreativeSwiper {
        height: 600px;
      }
      .HeroCreativeSwiper .swiper-slide {
        width: 460px;
      }
    }

    @media (min-width: 1280px) {
      .HeroCreativeSwiper {
        height: 640px;
      }
      .HeroCreativeSwiper .swiper-slide {
        width: 520px;
      }
    }

    .HeroCreativeSwiper .swiper-pagination-bullet {
      background: #C85A27 !important;
      opacity: 0.35;
      transition: all 0.3s ease;
      width: 9px;
      height: 9px;
    }

    .HeroCreativeSwiper .swiper-pagination-bullet-active {
      opacity: 1 !important;
      width: 26px !important;
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
      className="relative w-full max-w-[540px] sm:max-w-[580px] lg:max-w-[600px] xl:max-w-[650px] mx-auto lg:mx-0 select-none"
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
              translate: ['-6%', 0, -220],
              rotate: [0, 100, 0],
            },
            next: {
              origin: 'right center',
              translate: ['6%', 0, -220],
              rotate: [0, -100, 0],
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
                <div className="relative w-full h-full bg-[#EAE3D6] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title || 'Siksha Sankalp Hero Image'}
                    className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-110"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Dark gradient overlay at bottom with metadata */}
                  <div className="absolute inset-x-0 bottom-0 pt-36 pb-8 px-6 sm:px-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col justify-end text-white z-10">
                    <h3 className="font-display font-extrabold text-white text-lg sm:text-2xl md:text-3xl leading-snug mb-2.5 drop-shadow-md">
                      {item.title || DEFAULT_HERO_SLIDE.title}
                    </h3>

                    {item.description && (
                      <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed mb-4 line-clamp-3 drop-shadow-xs">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
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
        /* Large clean card mockup showing exact bottom overlay structure until images are uploaded in admin */
        <div className="w-full h-[520px] sm:h-[560px] md:h-[600px] lg:h-[640px] rounded-[28px] overflow-hidden bg-gradient-to-b from-[#F2ECE2] via-[#E8DECD] to-[#D5C9B5] border border-border shadow-elevated relative flex flex-col justify-end">
          {/* Subtle background branding */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-40">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-content-primary/40 uppercase tracking-widest">
              Siksha Sankalp
            </span>
            <span className="text-xs sm:text-sm text-content-secondary mt-1">
              Upload photos in Admin Gallery with &quot;HOME_HERO&quot; tag to display live slides
            </span>
          </div>

          {/* Bottom Data Overlay as requested */}
          <div className="relative z-10 pt-36 pb-8 px-6 sm:px-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col justify-end text-white">
            <h3 className="font-display font-extrabold text-white text-lg sm:text-2xl md:text-3xl leading-snug mb-2.5 drop-shadow-md">
              {DEFAULT_HERO_SLIDE.title}
            </h3>

            <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed mb-4 drop-shadow-xs">
              {DEFAULT_HERO_SLIDE.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
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
