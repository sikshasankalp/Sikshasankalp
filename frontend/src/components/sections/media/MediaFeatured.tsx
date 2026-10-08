import { ArrowRight, FileText, Eye, ExternalLink } from 'lucide-react';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useLanguage } from "../../../context/LanguageContext";
import { useState, useEffect } from 'react';
import { fetchMedia, type MediaCoverageItem } from '../../../services/api/media';
import { fetchGallery, type GalleryItem } from '../../../services/api/gallery';

interface FeaturedDisplay {
  title: string;
  publication: string;
  description: string;
  thumbnailUrl: string;
  url: string;
  date: string;
  isImage: boolean;
}

export function MediaFeatured() {
  const { t } = useLanguage();
  const [featuredItem, setFeaturedItem] = useState<FeaturedDisplay | null>(null);
  
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const [mediaItems, galleryCoverage] = await Promise.all([
          fetchMedia().catch(() => [] as MediaCoverageItem[]),
          fetchGallery({ displayLocation: 'MEDIA_COVERAGE' }).catch(() => [] as GalleryItem[]),
        ]);

        // Find featured in media first
        const featuredMedia = (mediaItems || []).find((m) => m.isFeatured);
        if (featuredMedia) {
          setFeaturedItem({
            title: featuredMedia.title,
            publication: featuredMedia.publication || featuredMedia.title || 'National Media',
            description: featuredMedia.description || '',
            thumbnailUrl: featuredMedia.thumbnailUrl || featuredMedia.externalUrl || '/logo/logo.jpeg',
            url: featuredMedia.externalUrl || '',
            date: featuredMedia.publishedAt
              ? new Date(featuredMedia.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
              : (featuredMedia.createdAt ? new Date(featuredMedia.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
            isImage: false,
          });
          return;
        }

        // Find featured in gallery coverage next
        const featuredGallery = (galleryCoverage || []).find((g) => g.isFeatured);
        if (featuredGallery) {
          setFeaturedItem({
            title: featuredGallery.title || 'Press Coverage',
            publication: featuredGallery.title || 'Press Coverage',
            description: featuredGallery.description || 'Ground coverage report on Siksha Sankalp Foundation’s mission.',
            thumbnailUrl: featuredGallery.imageUrl,
            url: featuredGallery.imageUrl,
            date: featuredGallery.eventDate
              ? new Date(featuredGallery.eventDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
              : (featuredGallery.createdAt ? new Date(featuredGallery.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
            isImage: true,
          });
          return;
        }

        // Fallback to first available item
        if (mediaItems && mediaItems.length > 0) {
          const first = mediaItems[0];
          setFeaturedItem({
            title: first.title,
            publication: first.publication || first.title || 'National Media',
            description: first.description || '',
            thumbnailUrl: first.thumbnailUrl || first.externalUrl || '/logo/logo.jpeg',
            url: first.externalUrl || '',
            date: first.publishedAt
              ? new Date(first.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
              : (first.createdAt ? new Date(first.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
            isImage: false,
          });
        } else if (galleryCoverage && galleryCoverage.length > 0) {
          const first = galleryCoverage[0];
          setFeaturedItem({
            title: first.title || 'Press Coverage',
            publication: first.title || 'Press Coverage',
            description: first.description || '',
            thumbnailUrl: first.imageUrl,
            url: first.imageUrl,
            date: first.eventDate
              ? new Date(first.eventDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
              : (first.createdAt ? new Date(first.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
            isImage: true,
          });
        }
      } catch (err) {
        console.error('Failed to load featured media', err);
      }
    };
    loadFeatured();
  }, []);

  if (!featuredItem) return null;

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <h2 className="text-h2 mb-8 md:mb-12">{t('media.mediaFeatured.text1')}</h2>
        
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          <a 
            href={featuredItem.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative aspect-video w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 group block shadow-md"
          >
            {featuredItem.thumbnailUrl ? (
              <img 
                src={featuredItem.thumbnailUrl} 
                alt={featuredItem.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                loading="lazy" 
                decoding="async" 
              />
            ) : (
              <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Featured Media Thumbnail" />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
            {featuredItem.isImage && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                <Eye className="w-3.5 h-3.5" /> Newspaper Clipping
              </div>
            )}
          </a>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold tracking-wider uppercase text-brand-primary border border-brand-primary/30 px-3 py-1 rounded">
                {featuredItem.publication}
              </span>
              <span className="text-sm text-content-muted font-medium flex items-center gap-1">
                <FileText className="w-4 h-4" /> {featuredItem.isImage ? 'Press Feature' : 'Article'}
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-display font-bold text-content-primary mb-4 leading-snug">
              {featuredItem.title}
            </h3>
            
            {featuredItem.description && (
              <p className="text-body-large text-content-secondary mb-6 leading-relaxed line-clamp-4">
                {featuredItem.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/60">
              {featuredItem.date && (
                <span className="text-sm text-content-muted font-medium">
                  {featuredItem.date}
                </span>
              )}
              <a 
                href={featuredItem.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-primary font-semibold text-sm uppercase tracking-wider flex items-center hover:text-brand-primary-hover transition-colors ml-auto"
              >
                {featuredItem.isImage ? 'View Full Clipping' : t('media.mediaFeatured.text2')} 
                {featuredItem.isImage ? <ExternalLink className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
