import { ArrowRight, FileText } from 'lucide-react';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useLanguage } from "../../../context/LanguageContext";
import { useState, useEffect } from 'react';
import { fetchMedia } from '../../../services/api/media';
import type { MediaCoverageItem } from '../../../services/api/media';

export function MediaFeatured() {
  const { t } = useLanguage();
  const [featuredItem, setFeaturedItem] = useState<MediaCoverageItem | null>(null);
  
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const items = await fetchMedia({ featured: true, limit: '1' });
        if (items && items.length > 0) {
          setFeaturedItem(items[0]);
        } else {
          // Fallback to latest item if no featured item exists
          const allItems = await fetchMedia({ limit: '1' });
          if (allItems && allItems.length > 0) {
            setFeaturedItem(allItems[0]);
          }
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
          <a href={featuredItem.externalUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-video w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 group block">
            {featuredItem.thumbnailUrl ? (
              <img src={featuredItem.thumbnailUrl} alt={featuredItem.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
            ) : (
              <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Featured Media Thumbnail" />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
          </a>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold tracking-wider uppercase text-brand-primary border border-brand-primary/30 px-3 py-1 rounded">
                {featuredItem.publication}
              </span>
              <span className="text-sm text-content-muted font-medium flex items-center gap-1">
                <FileText className="w-4 h-4" /> Article
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-display font-bold text-content-primary mb-4 leading-snug">
              {featuredItem.title}
            </h3>
            
            <p className="text-body-large text-content-secondary mb-6 leading-relaxed line-clamp-4">
              {featuredItem.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/60">
              <span className="text-sm text-content-muted font-medium">
                {featuredItem.publishedAt ? new Date(featuredItem.publishedAt).toLocaleDateString() : new Date(featuredItem.createdAt).toLocaleDateString()}
              </span>
              <a href={featuredItem.externalUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary font-semibold text-sm uppercase tracking-wider flex items-center hover:text-brand-primary-hover transition-colors">
                {t('media.mediaFeatured.text2')} <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
