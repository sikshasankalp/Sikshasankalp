import { useState, useEffect } from 'react';
import { ArrowRight, Tv, Eye, ExternalLink, X } from 'lucide-react';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { fetchMedia, type MediaCoverageItem } from '../../../services/api/media';
import { fetchGallery, type GalleryItem } from '../../../services/api/gallery';
import { useLanguage } from "../../../context/LanguageContext";

interface UnifiedMediaItem {
  id: string;
  title: string;
  publication: string;
  description: string;
  date: string;
  thumbnailUrl: string;
  url: string;
  isImage: boolean;
}

export function MediaGrid() {
  const { t } = useLanguage();
  const [items, setItems] = useState<UnifiedMediaItem[]>([]);
  const [lightboxItem, setLightboxItem] = useState<UnifiedMediaItem | null>(null);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const [mediaData, galleryCoverage, galleryHome] = await Promise.all([
          fetchMedia().catch(() => [] as MediaCoverageItem[]),
          fetchGallery({ displayLocation: 'MEDIA_COVERAGE' }).catch(() => [] as GalleryItem[]),
          fetchGallery({ displayLocation: 'HOME_MEDIA' }).catch(() => [] as GalleryItem[]),
        ]);

        const galleryMap = new Map<string, GalleryItem>();
        [...(galleryCoverage || []), ...(galleryHome || [])].forEach((g) => {
          if (g && g.id) galleryMap.set(g.id, g);
        });

        const mappedMedia: UnifiedMediaItem[] = (mediaData || []).map((m: MediaCoverageItem) => ({
          id: `media-${m.id}`,
          title: m.title,
          publication: m.publication || m.title || 'National Media',
          description: m.description || '',
          date: m.publishedAt
            ? new Date(m.publishedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
            : (m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
          thumbnailUrl: m.thumbnailUrl || m.externalUrl || '/logo/logo.jpeg',
          url: m.externalUrl || '',
          isImage: !m.externalUrl || (m.externalUrl.startsWith('http') && (m.externalUrl.endsWith('.jpg') || m.externalUrl.endsWith('.png') || m.externalUrl.endsWith('.webp'))),
        }));

        const mappedGallery: UnifiedMediaItem[] = Array.from(galleryMap.values()).map((g: GalleryItem) => ({
          id: `gallery-${g.id}`,
          title: g.title || 'Press Coverage',
          publication: g.title || 'Press Coverage',
          description: g.description || '',
          date: g.eventDate
            ? new Date(g.eventDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
            : (g.createdAt ? new Date(g.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : ''),
          thumbnailUrl: g.imageUrl,
          url: g.imageUrl,
          isImage: true,
        }));

        setItems([...mappedMedia, ...mappedGallery]);
      } catch (error) {
        console.error('Failed to load media', error);
      }
    };
    loadMedia();
  }, []);

  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-5xl mx-auto">
        <h2 className="text-h2 mb-12">{t('media.mediaGrid.text1')}</h2>
        
        {items.length > 0 ? (
          <div className="flex flex-col">
            {items.map((item) => (
              <div 
                key={item.id} 
                onClick={() => {
                  if (item.isImage) {
                    setLightboxItem(item);
                  } else if (item.url) {
                    window.open(item.url, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="group cursor-pointer flex flex-col md:flex-row gap-6 md:gap-10 py-8 border-t border-border/60 hover:bg-background/80 transition-all -mx-4 px-4 md:mx-0 md:px-6 rounded-xl"
              >
                <div className="relative aspect-video w-full md:w-[240px] shrink-0 rounded-lg overflow-hidden bg-background border border-border/50 shadow-sm">
                  {item.thumbnailUrl ? (
                    <img 
                      src={item.thumbnailUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      loading="lazy" 
                      decoding="async" 
                    />
                  ) : (
                    <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Thumbnail" />
                  )}
                  {item.isImage && (
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-6 h-6 drop-shadow-md" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-center flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold tracking-wider uppercase text-brand-primary">
                      {item.publication}
                    </span>
                    {item.date && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span className="text-xs text-content-muted font-medium">
                          {item.date}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-content-primary mb-2 group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-sm text-content-secondary line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  )}
                  
                  <div className="mt-auto flex items-center text-sm font-semibold text-brand-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    {item.isImage ? 'View Press Clipping' : t('media.mediaGrid.text2')} 
                    {item.isImage ? <Eye className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-border bg-background rounded-xl shadow-soft">
            <Tv className="w-12 h-12 text-content-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-content-primary mb-2">{t('media.mediaGrid.text3')}</h3>
            <p className="text-body text-content-secondary max-w-md mx-auto">
              {t('media.mediaGrid.text4')}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxItem(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                  {lightboxItem.publication}
                </span>
                <h4 className="text-base font-bold text-white truncate max-w-md sm:max-w-lg mt-0.5">
                  {lightboxItem.title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                  title="Open original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-zinc-900/40">
              <img 
                src={lightboxItem.thumbnailUrl} 
                alt={lightboxItem.title} 
                className="max-h-[72vh] w-auto max-w-full object-contain rounded shadow-lg"
              />
            </div>

            {lightboxItem.description && (
              <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 text-sm text-zinc-300">
                {lightboxItem.description}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
