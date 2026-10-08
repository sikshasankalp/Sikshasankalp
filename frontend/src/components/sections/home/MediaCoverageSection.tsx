import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../buttons/Button';
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper, X, Eye, Loader2 } from 'lucide-react';
import { fetchMedia, type MediaCoverageItem } from '../../../services/api/media';
import { fetchGallery, type GalleryItem } from '../../../services/api/gallery';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export interface ArticleItem {
  id: string;
  title: string;
  publication: string;
  description: string;
  image: string;
  externalUrl: string;
  isImageOnly: boolean;
  date?: string;
  tags: string[];
}

export function MediaCoverageSection() {
  const { t } = useLanguage();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState<string>('All');
  const [lightboxImage, setLightboxImage] = useState<ArticleItem | null>(null);

  useEffect(() => {
    const loadAllMedia = async () => {
      setIsLoading(true);
      try {
        const [mediaItems, galleryCoverage, galleryHome] = await Promise.all([
          fetchMedia().catch(() => [] as MediaCoverageItem[]),
          fetchGallery({ displayLocation: 'MEDIA_COVERAGE' }).catch(() => [] as GalleryItem[]),
          fetchGallery({ displayLocation: 'HOME_MEDIA' }).catch(() => [] as GalleryItem[]),
        ]);

        // Deduplicate gallery items by id
        const galleryMap = new Map<string, GalleryItem>();
        [...(galleryCoverage || []), ...(galleryHome || [])].forEach((g) => {
          if (g && g.id) galleryMap.set(g.id, g);
        });
        const uniqueGallery = Array.from(galleryMap.values());

        // Map external articles (from Media Coverage table)
        const mappedMedia: ArticleItem[] = (mediaItems || []).map((m: MediaCoverageItem) => ({
          id: `media-${m.id}`,
          title: m.title,
          publication: m.publication || m.title || 'National Media',
          description: m.description || 'Special news report highlighting the grassroots mission of Siksha Sankalp Foundation.',
          image: m.thumbnailUrl || m.externalUrl || '/logo/logo.jpeg',
          externalUrl: m.externalUrl || '',
          isImageOnly: !m.externalUrl || m.externalUrl.startsWith('http') && (m.externalUrl.endsWith('.jpg') || m.externalUrl.endsWith('.png') || m.externalUrl.endsWith('.webp')),
          date: m.publishedAt
            ? new Date(m.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
            : (m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Press Report'),
          tags: m.category ? [m.category.replace(/_/g, ' ')] : ['Media Article', 'Ground Coverage'],
        }));

        // Map press clippings and news screenshots (from Gallery table with MEDIA_COVERAGE)
        const mappedGallery: ArticleItem[] = uniqueGallery.map((g: GalleryItem) => ({
          id: `gallery-${g.id}`,
          title: g.title || 'Press Coverage',
          publication: g.title || 'Press Coverage',
          description: g.description || 'Ground reality report on underprivileged children connected to schooling by Siksha Sankalp Foundation.',
          image: g.imageUrl,
          externalUrl: g.imageUrl,
          isImageOnly: true,
          date: g.eventDate
            ? new Date(g.eventDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
            : (g.createdAt ? new Date(g.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Press Coverage'),
          tags: g.category ? [g.category.replace(/_/g, ' ')] : ['Press Clipping', 'Footpath Education'],
        }));

        // Combine all real uploaded items
        const combined = [...mappedMedia, ...mappedGallery];
        setArticles(combined);
      } catch (err) {
        console.error('Failed to load media coverage:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllMedia();
  }, []);

  // Filter articles based on selected publication pill
  const filteredArticles = selectedPublication === 'All'
    ? articles
    : articles.filter(a => a.publication.toLowerCase() === selectedPublication.toLowerCase());

  // Distinct publications list extracted dynamically from actual uploaded media
  const dynamicPublications = ['All', ...Array.from(new Set(articles.map(a => a.publication).filter(Boolean)))];

  // Swiper Coverflow requires enough slides to loop smoothly. If few items, loop real items without adding fake ones.
  const loopedArticles = filteredArticles.length > 0 && filteredArticles.length <= 3
    ? [...filteredArticles, ...filteredArticles, ...filteredArticles]
    : filteredArticles;

  const carouselStyles = `
  .MediaCoverflowCarousel {
    width: 100%;
    padding-top: 24px;
    padding-bottom: 48px !important;
  }
  
  .MediaCoverflowCarousel .swiper-slide {
    width: 88vw;
    max-width: 760px;
    aspect-ratio: 16/10;
    border-radius: 24px;
    overflow: hidden;
    transition: all 0.4s ease;
  }
  
  @media (min-width: 640px) {
    .MediaCoverflowCarousel .swiper-slide {
      max-width: 760px;
      aspect-ratio: 16/9;
      border-radius: 26px;
    }
  }

  @media (min-width: 1024px) {
    .MediaCoverflowCarousel .swiper-slide {
      max-width: 780px;
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
            Media & Press Coverage
          </div>
          <h2 className="text-h2 font-display text-content-primary mb-4">
            {t('home.mediaCoverageSection.title1')}
          </h2>
          <p className="text-body text-content-secondary max-w-xl mx-auto">
            Glimpses of Siksha Sankalp Foundation's on-ground educational mission covered across leading national and regional press outlets.
          </p>
        </div>

        {/* Dynamic Media Outlets Filter/Trust Bar (Extracted from real uploaded items) */}
        {dynamicPublications.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto mb-8">
            {dynamicPublications.map((pub) => {
              const isSelected = selectedPublication.toLowerCase() === pub.toLowerCase();
              return (
                <button
                  key={pub}
                  type="button"
                  onClick={() => setSelectedPublication(pub)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-display font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-xs cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary text-white border border-brand-primary shadow-sm scale-105'
                      : 'bg-surface/80 border border-border/70 text-content-secondary hover:border-brand-primary/50 hover:text-brand-primary'
                  }`}
                >
                  {pub}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-content-muted">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary mb-3" />
            <p className="text-sm font-medium">Loading uploaded press coverage...</p>
          </div>
        )}

        {/* 3D Coverflow Showcase Carousel with real uploaded media */}
        {!isLoading && filteredArticles.length > 0 && (
          <div className="relative max-w-7xl mx-auto px-0 sm:px-4">
            <Swiper
              key={`swiper-${selectedPublication}-${loopedArticles.length}`}
              spaceBetween={0}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              effect="coverflow"
              grabCursor={true}
              slidesPerView="auto"
              centeredSlides={true}
              loop={loopedArticles.length >= 3}
              coverflowEffect={{
                rotate: 24,
                stretch: 0,
                depth: 90,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              navigation={{
                nextEl: '.media-swiper-next',
                prevEl: '.media-swiper-prev'
              }}
              className="MediaCoverflowCarousel"
              modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
            >
              {loopedArticles.map((article, index) => {
                const handleClick = (e: React.MouseEvent) => {
                  if (article.isImageOnly) {
                    e.preventDefault();
                    setLightboxImage(article);
                  }
                };

                return (
                  <SwiperSlide 
                    key={`${article.id}-${index}`}
                    className="shadow-elevated bg-[#1A1A1A] group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border/50 text-left cursor-pointer"
                  >
                    <a
                      href={article.externalUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleClick}
                      className="block w-full h-full relative inset-0"
                      aria-label={`View media coverage: ${article.title}`}
                    >
                      {/* Real Press Screenshot / Photo - 100% Bright & Crisp */}
                      <img
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                      />
                      
                      {/* Soft Bottom Readability Gradient: Top 65% is completely bright and clearly visible */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-35% to-transparent pointer-events-none transition-opacity duration-300"></div>
                      
                      {/* Top Badges & Action Icon */}
                      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10">
                        <span className="text-xs font-bold px-3 py-1 bg-black/70 backdrop-blur-md border border-white/20 rounded-full text-white tracking-wider uppercase shadow-sm">
                          {article.publication}
                        </span>
                        {article.date && (
                          <span className="text-[11px] px-2.5 py-0.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-white/90 font-medium hidden sm:inline-block">
                            {article.date}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                        <span 
                          className="p-2.5 sm:p-3 bg-brand-primary border border-white/20 rounded-full text-white transition-all backdrop-blur-md inline-flex items-center justify-center group-hover:scale-110 shadow-lg"
                          title={article.isImageOnly ? "Zoom Press Clipping" : "Read Full Article"}
                        >
                          {article.isImageOnly ? (
                            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          ) : (
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          )}
                        </span>
                      </div>

                      {/* Bottom Article Details */}
                      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 flex flex-col gap-2 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300 z-10">
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold font-display text-white drop-shadow-md leading-tight line-clamp-2">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-xs sm:text-sm text-white/85 line-clamp-2 leading-relaxed drop-shadow-sm max-w-2xl font-sans">
                            {article.description}
                          </p>
                        )}
                        
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
                            <span className="text-[10px] sm:text-xs text-amber-300 font-medium ml-auto flex items-center gap-1">
                              {article.isImageOnly ? 'View clipping →' : 'Read article →'}
                            </span>
                          </div>
                        )}
                      </div>
                    </a>
                  </SwiperSlide>
                );
              })}

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
        )}

        {/* Empty State */}
        {!isLoading && filteredArticles.length === 0 && (
          <div className="py-16 text-center text-content-muted">
            <p className="text-base font-medium">No media coverage found for this selection.</p>
          </div>
        )}

        {/* CTA Button to Full Media Page */}
        <div className="mt-8 md:mt-12">
          <Button to="/media" variant="interactive" size="lg">
            {t('home.mediaCoverageSection.btn1')}
          </Button>
        </div>
      </div>

      {/* Lightbox Modal for Full Newspaper Clipping Zoom */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[92vh] flex flex-col items-center bg-[#181614] border border-white/20 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="overflow-auto max-h-[78vh] w-full flex items-center justify-center rounded-xl bg-black/50">
              <img
                src={lightboxImage.image}
                alt={lightboxImage.title}
                className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>

            <div className="mt-4 text-center text-white w-full">
              <div className="inline-block px-3 py-1 bg-brand-primary/20 border border-brand-primary/40 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                {lightboxImage.publication}
              </div>
              <h4 className="font-bold text-lg sm:text-xl text-white">{lightboxImage.title}</h4>
              {lightboxImage.description && (
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto mt-1 leading-relaxed">
                  {lightboxImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default MediaCoverageSection;
