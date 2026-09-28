import { useState, useEffect } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';

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

interface GalleryImage {
  id: string;
  url: string; // Will store high-res Cloudinary URL
  thumbnailUrl: string; // Will store optimized Cloudinary URL
  category: GalleryCategory;
  altText: string;
}

// Using placeholder items to demonstrate the grid architecture as requested.
// Set to false to test the empty state.
const SHOW_PLACEHOLDERS = true;

const mockImages: GalleryImage[] = SHOW_PLACEHOLDERS ? [
  { id: '1', url: '', thumbnailUrl: '', category: 'Footpath Education', altText: 'Placeholder' },
  { id: '2', url: '', thumbnailUrl: '', category: 'School Admission', altText: 'Placeholder' },
  { id: '3', url: '', thumbnailUrl: '', category: 'Children in School', altText: 'Placeholder' },
  { id: '4', url: '', thumbnailUrl: '', category: 'Educational Support', altText: 'Placeholder' },
  { id: '5', url: '', thumbnailUrl: '', category: 'Environment & Plantation', altText: 'Placeholder' },
  { id: '6', url: '', thumbnailUrl: '', category: 'Bath Tent Initiative', altText: 'Placeholder' },
  { id: '7', url: '', thumbnailUrl: '', category: 'Footpath Education', altText: 'Placeholder' },
  { id: '8', url: '', thumbnailUrl: '', category: 'Special Moments', altText: 'Placeholder' },
] : [];

export function GalleryGrid() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const filteredImages = mockImages.filter(img => activeCategory === 'All' || img.category === activeCategory);

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
                {image.thumbnailUrl ? (
                  <img src={image.thumbnailUrl} alt={image.altText} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Image Placeholder" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium px-4 py-2 border border-white/50 rounded backdrop-blur-sm text-sm uppercase tracking-wider">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border rounded-xl bg-surface-muted/30">
            <ImageIcon className="w-16 h-16 text-content-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-content-primary mb-2">No Images Available</h3>
            <p className="text-body text-content-secondary max-w-md mx-auto mb-6">
              Images for the category <span className="font-semibold text-brand-primary">{activeCategory}</span> will be uploaded here soon through the admin panel.
            </p>
            {activeCategory !== 'All' && (
              <Button onClick={() => setActiveCategory('All')} variant="outline" size="sm">
                View All Categories
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
            {lightboxImage.url ? (
              <img src={lightboxImage.url} alt={lightboxImage.altText} className="max-w-full max-h-[75vh] object-contain rounded" />
            ) : (
              <div className="w-full max-w-3xl aspect-[16/9] bg-surface-muted rounded overflow-hidden flex flex-col items-center justify-center text-content-muted">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <span className="text-lg font-medium">Cloudinary Full-Res Placeholder</span>
                <span className="text-sm mt-2 text-content-secondary">Category: {lightboxImage.category}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
