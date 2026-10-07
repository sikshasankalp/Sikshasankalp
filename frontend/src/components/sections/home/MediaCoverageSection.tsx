import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../buttons/Button';
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper } from 'lucide-react';
import { fetchMedia, type MediaCoverageItem } from '../../../services/api/media';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface ArticleItem {
  id: string;
  title: string;
  publication: string;
  description: string;
  image: string;
  externalUrl: string;
  date?: string;
  tags: string[];
}

const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: 'art-1',
    title: 'Footpath Se School Tak: Siksha Sankalp Badal Raha Hai Bachho Ka Bhavishya',
    publication: 'Aaj Tak',
    description: 'Siksha Sankalp Foundation brings free foundational education and formal school admissions to underprivileged children living on streets.',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop',
    externalUrl: 'https://aajtak.in',
    date: 'Media Special',
    tags: ['Ground Reality', 'School Admission', 'Street to School']
  },
  {
    id: 'art-2',
    title: 'Basti Ke Bachho Ko Digital Siksha: Ek Nayi Umeed Ka Sankalp',
    publication: 'News18',
    description: 'How mobile community digital libraries and interactive tablets are empowering children with literacy and computer confidence.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop',
    externalUrl: 'https://news18.com',
    date: 'Feature Story',
    tags: ['Digital Siksha', 'Community Library', 'Empowerment']
  },
  {
    id: 'art-3',
    title: 'Shiksha Ka Adhikar: Ground Report on Underprivileged Children in Mainstream Schools',
    publication: 'ABP News',
    description: 'Special coverage on how relentless volunteers provide books, uniforms, and family counseling to ensure continuous schooling.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
    externalUrl: 'https://abplive.com',
    date: 'Investigation',
    tags: ['Right To Education', 'Child Welfare', 'Social Change']
  },
  {
    id: 'art-4',
    title: 'Transforming Pavements Into Pathways of Opportunity',
    publication: 'India Today',
    description: 'Grassroots champions at Siksha Sankalp Foundation turn roadside pavement spaces into joyful learning centers for 500+ needy children.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop',
    externalUrl: 'https://indiatoday.in',
    date: 'Inspiration',
    tags: ['Grassroots Action', 'Nutrition & Books', 'Delhi NCR']
  },
  {
    id: 'art-5',
    title: 'Zameen Par Utra Sankalp: Har Bachhe Ke Haath Mein Kitaab',
    publication: 'Amar Ujala',
    description: 'Foundation dwara 150 se adhik bachhon ka nishulk dakhila aur niyamit padhai sunishchit karne par vishesh report.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
    externalUrl: 'https://amarujala.com',
    date: 'Ground Coverage',
    tags: ['Education For All', 'Admission Drive', 'Dignity']
  }
];

const mediaLogos = ['Aaj Tak', 'News18', 'ABP News', 'India Today', 'Amar Ujala'];

export function MediaCoverageSection() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<ArticleItem[]>(DEFAULT_ARTICLES);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const items = await fetchMedia();
        if (items && items.length > 0) {
          const homeSpecific = items.filter(m => m.displayLocation === 'HOME_MEDIA');
          const targetItems = homeSpecific.length > 0 ? homeSpecific : items;
          const mapped: ArticleItem[] = targetItems.map((m: MediaCoverageItem) => ({
            id: m.id,
            title: m.title,
            publication: m.publication || 'Media Coverage',
            description: m.description || 'Special coverage highlighting the grassroots educational initiatives of Siksha Sankalp Foundation.',
            image: m.thumbnailUrl || DEFAULT_ARTICLES[0].image,
            externalUrl: m.externalUrl || '#',
            date: m.publishedAt ? new Date(m.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Featured',
            tags: m.category ? [m.category] : ['Media Article', 'Ground Work']
          }));
          // Ensure loop works smoothly by duplicating if < 4 items
          const finalItems = mapped.length < 4 ? [...mapped, ...DEFAULT_ARTICLES] : mapped;
          setArticles(finalItems);
        }
      } catch (err) {
        console.error('Failed to load media coverage:', err);
      }
    };
    loadMedia();
  }, []);

  // Duplicate if items <= 3 for seamless Swiper 3D coverflow looping
  const loopedArticles = articles.length <= 3 ? [...articles, ...articles] : articles;

  const carouselStyles = `
  .MediaCoverflowCarousel {
    width: 100%;
    padding-top: 24px;
    padding-bottom: 48px !important;
  }
  
  .MediaCoverflowCarousel .swiper-slide {
    width: 86vw;
    max-width: 640px;
    aspect-ratio: 16/10;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s ease;
  }
  
  @media (min-width: 640px) {
    .MediaCoverflowCarousel .swiper-slide {
      aspect-ratio: 16/9;
    }
  }

  .MediaCoverflowCarousel .swiper-pagination-bullet {
    background-color: rgba(200, 90, 39, 0.35) !important;
    width: 8px;
    height: 8px;
    transition: all 0.3s ease;
    opacity: 1 !important;
  }
  
  .MediaCoverflowCarousel .swiper-pagination-bullet-active {
    background-color: #C85A27 !important;
    width: 26px !important;
    border-radius: 9999px !important;
  }
  `;

  return (
    <section className="py-16 md:py-24 bg-background overflow-hidden relative border-b border-border/50">
      <style>{carouselStyles}</style>
      
      <div className="container-default text-center px-4">
        {/* Eyebrow and Headline */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <Newspaper className="w-3.5 h-3.5" />
            Media & News Articles
          </div>
          <h2 className="text-h2 font-display text-content-primary mb-4">
            {t('home.mediaCoverageSection.title1')}
          </h2>
          <p className="text-body text-content-secondary max-w-xl mx-auto">
            Glimpses of Siksha Sankalp Foundation's on-ground educational mission covered across leading national news outlets.
          </p>
        </div>

        {/* Media Outlets Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 max-w-3xl mx-auto mb-8">
          {mediaLogos.map((logo, index) => (
            <div 
              key={index} 
              className="px-4 py-2 bg-surface/70 border border-border/70 rounded-full text-content-secondary font-display font-semibold text-xs sm:text-sm tracking-wide shadow-sm hover:border-brand-primary/40 hover:text-brand-primary transition-colors select-none"
            >
              {logo}
            </div>
          ))}
        </div>

        {/* 3D Coverflow Showcase Carousel */}
        <div className="relative max-w-6xl mx-auto px-0 sm:px-4">
          <Swiper
            spaceBetween={0}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            effect="coverflow"
            grabCursor={true}
            slidesPerView="auto"
            centeredSlides={true}
            loop={true}
            coverflowEffect={{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={{ clickable: true }}
            preventClicks={true}
            preventClicksPropagation={true}
            navigation={{
              nextEl: '.media-swiper-next',
              prevEl: '.media-swiper-prev'
            }}
            className="MediaCoverflowCarousel"
            modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
          >
            {loopedArticles.map((article, index) => (
              <SwiperSlide 
                key={`${article.id}-${index}`}
                className="shadow-elevated bg-[#1A1A1A] group relative rounded-2xl overflow-hidden border border-border/50 text-left cursor-pointer"
              >
                <a
                  href={article.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full relative inset-0"
                  aria-label={`Read article: ${article.title}`}
                >
                  {/* Article Screenshot / Image */}
                  <img
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                  />
                  
                  {/* Dark Gradient Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/25 transition-opacity duration-300"></div>
                  
                  {/* Top Badges & External Link Icon */}
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10">
                    <span className="text-xs font-bold px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white tracking-wider uppercase shadow-sm">
                      {article.publication}
                    </span>
                    {article.date && (
                      <span className="text-[11px] px-2.5 py-0.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-white/80 font-medium hidden sm:inline-block">
                        {article.date}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                    <span 
                      className="p-2.5 sm:p-3 bg-brand-primary border border-white/20 rounded-full text-white transition-all backdrop-blur-md inline-flex items-center justify-center group-hover:scale-110 shadow-lg"
                      title="Read Original Article"
                    >
                      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </span>
                  </div>

                  {/* Bottom Article Details */}
                  <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 flex flex-col gap-2.5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <h3 className="text-lg sm:text-2xl md:text-3xl font-bold font-display text-white drop-shadow-md leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/85 line-clamp-2 leading-relaxed drop-shadow-sm max-w-2xl font-sans">
                      {article.description}
                    </p>
                    
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {article.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] sm:text-xs px-2.5 py-0.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white/90 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="text-[10px] sm:text-xs text-brand-sand/90 font-medium ml-auto flex items-center gap-1 sm:hidden">
                          Read article →
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              </SwiperSlide>
            ))}

            {/* Navigation Arrows */}
            <button 
              type="button"
              aria-label="Previous article" 
              className="media-swiper-prev absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-brand-primary border border-border text-content-primary hover:text-white shadow-elevated flex items-center justify-center transition-all backdrop-blur-md disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              type="button"
              aria-label="Next article" 
              className="media-swiper-next absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-brand-primary border border-border text-content-primary hover:text-white shadow-elevated flex items-center justify-center transition-all backdrop-blur-md disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </Swiper>
        </div>

        {/* View All Button */}
        <div className="mt-8">
          <Button to="/media" variant="accent" size="lg" arrow>
            {t('home.mediaCoverageSection.btn1')}
          </Button>
        </div>
      </div>
    </section>
  );
}
