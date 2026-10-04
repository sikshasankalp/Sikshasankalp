import { useState, useEffect, useMemo } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { fetchGallery } from '../../../services/api/gallery';
import type { GalleryItem } from '../../../services/api/gallery';
import { useLanguage } from "../../../context/LanguageContext";

const GALLERY_CATEGORIES = [
  'All',
  'Footpath Education',
  'School Admission',
  'Children in School',
  'Educational Support',
  'Learning Activities',
  'Food & Community Support',
  'Family Support',
  'Bath Tent Initiative',
  'Environment & Plantation',
  'School & Educational Activities',
  'Media Coverage',
  'Special Moments'
] as const;

type GalleryCategory = typeof GALLERY_CATEGORIES[number];

export function GalleryGrid() {
    const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'All'>('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);
  const [images, setImages] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await fetchGallery();
        setImages(data);
      } catch (error) {
        console.error('Failed to load gallery', error);
      }
    };
    loadImages();
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter(img => activeCategory === 'All' || img.category === activeCategory);
  }, [images, activeCategory]);

  useEffect(() => {
    if (lightboxImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [lightboxImage]);

  return (
    <section className="section-padding bg-background min-h-[60vh]">
      <div className="container-default max-w-7xl mx-auto">
        
        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {GALLERY_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === category 
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm' 
                  : 'bg-surface text-content-secondary border-border hover:border-brand-primary/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredImages.map((image) => (
              <div 
                key={image.id}
                className="relative aspect-square w-full rounded-lg overflow-hidden bg-surface-muted border border-border cursor-pointer group"
                onClick={() => setLightboxImage(image)}
              >
                {image.imageUrl ? (
                  <img src={image.imageUrl} alt={image.title || 'Gallery Image'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                ) : (
                  <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Image Placeholder" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium px-4 py-2 border border-white/50 rounded backdrop-blur-sm text-sm uppercase tracking-wider">
                    {t('gallery.galleryGrid.text1')}
                                              </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border rounded-xl bg-surface-muted/30">
            <ImageIcon className="w-16 h-16 text-content-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-content-primary mb-2">{t('gallery.galleryGrid.text2')}</h3>
            <p className="text-body text-content-secondary max-w-md mx-auto mb-6">
              {t('gallery.galleryGrid.text3')} <span className="font-semibold text-brand-primary">{activeCategory}</span> {t('gallery.galleryGrid.text4')}
                                          </p>
            {activeCategory !== 'All' && (
              <Button onClick={() => setActiveCategory('All')} variant="outline" size="sm">
                {t('gallery.galleryGrid.text5')}
                                                </Button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10" onClick={() => setLightboxImage(null)}>
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {lightboxImage.imageUrl ? (
              <img src={lightboxImage.imageUrl} alt={lightboxImage.title || 'Full Image'} className="max-w-full max-h-[75vh] object-contain rounded" />
            ) : (
              <div className="w-full max-w-3xl aspect-[16/9] bg-surface-muted rounded overflow-hidden flex flex-col items-center justify-center text-content-muted">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <span className="text-lg font-medium">{t('gallery.galleryGrid.text6')}</span>
                <span className="text-sm mt-2 text-content-secondary">{t('gallery.galleryGrid.text7')} {lightboxImage.category}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
