import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchGallery } from '../../../services/api/gallery';
import type { GalleryItem } from '../../../services/api/gallery';
import { useLanguage } from "../../../context/LanguageContext";
import { X, ZoomIn, ArrowRight } from 'lucide-react';

export function PhotoStorySection() {
  const { t } = useLanguage();
  const [impactImage, setImpactImage] = useState<GalleryItem | null>(null);
  const [programsImage, setProgramsImage] = useState<GalleryItem | null>(null);
  const [familyImage, setFamilyImage] = useState<GalleryItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const [impactItems, programsItems, familyItems] = await Promise.all([
          fetchGallery({ displayLocation: 'HOME_IMPACT' }),
          fetchGallery({ displayLocation: 'HOME_PROGRAMS' }),
          fetchGallery({ displayLocation: 'HOME_FAMILY' })
        ]);
        
        if (impactItems && impactItems.length > 0) {
          setImpactImage(impactItems[0]);
        }
        if (programsItems && programsItems.length > 0) {
          setProgramsImage(programsItems[0]);
        }
        if (familyItems && familyItems.length > 0) {
          setFamilyImage(familyItems[0]);
        }
      } catch (err) {
        console.error('Failed to load PhotoStory images:', err);
      }
    };
    loadImages();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-surface-muted">
      <div className="container-default">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-h2 mb-3">{t('home.photoStorySection.title1')}</h2>
        </div>
        
        {/* Editorial composition: 1 large, 2 small */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[500px] lg:h-[540px]">
          {/* Main Large Image */}
          <div 
            onClick={() => impactImage && setLightboxImage(impactImage)}
            className="md:col-span-8 md:row-span-2 h-[300px] md:h-full relative rounded-2xl overflow-hidden group bg-neutral-950 shadow-md flex items-center justify-center cursor-pointer"
          >
            {impactImage ? (
              <>
                {/* Ambient glow from image */}
                <img 
                  src={impactImage.imageUrl} 
                  alt="" 
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-40 pointer-events-none" 
                />
                {/* Uncropped crisp foreground photo */}
                <img 
                  src={impactImage.imageUrl} 
                  alt={impactImage.title || "Children Learning / Community Work"} 
                  className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" 
                  loading="lazy" 
                  decoding="async" 
                />
              </>
            ) : (
              <PlaceholderImage className="w-full h-full" text="Children Learning / Community Work" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-5 md:p-6 z-20 pointer-events-none">
              <span className="text-white font-medium text-lg drop-shadow">{t('home.photoStorySection.text1')}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white/80 text-xs flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <ZoomIn className="w-3.5 h-3.5" /> View Full
              </span>
            </div>
          </div>
          
          {/* Small Image 1 */}
          <div 
            onClick={() => programsImage && setLightboxImage(programsImage)}
            className="md:col-span-4 h-[240px] md:h-full relative rounded-2xl overflow-hidden group bg-neutral-950 shadow-md flex items-center justify-center cursor-pointer"
          >
            {programsImage ? (
              <>
                <img 
                  src={programsImage.imageUrl} 
                  alt="" 
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-40 pointer-events-none" 
                />
                <img 
                  src={programsImage.imageUrl} 
                  alt={programsImage.title || "School Admission"} 
                  className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]" 
                  loading="lazy" 
                  decoding="async" 
                />
              </>
            ) : (
              <PlaceholderImage className="w-full h-full" text="School Admission" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-4 md:p-5 z-20 pointer-events-none">
              <span className="text-white font-medium drop-shadow">{t('home.photoStorySection.text2')}</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white/80 text-xs flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <ZoomIn className="w-3.5 h-3.5" /> View Full
              </span>
            </div>
          </div>
          
          {/* Small Image 2: Links to Full Gallery with "See All" */}
          <Link 
            to="/gallery"
            className="md:col-span-4 h-[240px] md:h-full relative rounded-2xl overflow-hidden group bg-neutral-950 shadow-md flex items-center justify-center cursor-pointer block"
            title="View all gallery photos"
          >
            {familyImage ? (
              <>
                <img 
                  src={familyImage.imageUrl} 
                  alt="" 
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-40 pointer-events-none" 
                />
                <img 
                  src={familyImage.imageUrl} 
                  alt={familyImage.title || "Family Support"} 
                  className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" 
                  loading="lazy" 
                  decoding="async" 
                />
              </>
            ) : (
              <PlaceholderImage className="w-full h-full" text="Family Support" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex items-end justify-between p-4 md:p-5 z-20">
              <span className="text-white font-medium drop-shadow">{t('home.photoStorySection.text3')}</span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-full shadow-lg group-hover:bg-brand-primary-hover group-hover:scale-105 transition-all">
                See All <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-md" 
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); setLightboxImage(null); }}
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>
          <div 
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center" 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxImage.imageUrl} 
              alt={lightboxImage.title || 'Full Photo'} 
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl" 
            />
            {lightboxImage.title && (
              <p className="mt-3 text-white/90 text-sm md:text-base font-medium text-center">
                {lightboxImage.title}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
