import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useState, useEffect } from 'react';
import { fetchGallery } from '../../../services/api/gallery';
import type { GalleryItem } from '../../../services/api/gallery';
import { useLanguage } from "../../../context/LanguageContext";

export function PhotoStorySection() {
  const { t } = useLanguage();
  const [impactImage, setImpactImage] = useState<GalleryItem | null>(null);
  const [programsImage, setProgramsImage] = useState<GalleryItem | null>(null);
  const [familyImage, setFamilyImage] = useState<GalleryItem | null>(null);

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 h-auto md:h-[450px] lg:h-[500px]">
          {/* Main Large Image */}
          <div className="md:col-span-8 md:row-span-2 h-[280px] md:h-full relative rounded-xl overflow-hidden group">
            {impactImage ? (
              <img 
                src={impactImage.imageUrl} 
                alt={impactImage.title || "Children Learning / Community Work"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" 
              />
            ) : (
              <PlaceholderImage className="w-full h-full" text="Children Learning / Community Work" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5 md:p-6">
              <span className="text-white font-medium text-lg">{t('home.photoStorySection.text1')}</span>
            </div>
          </div>
          
          {/* Small Image 1 */}
          <div className="md:col-span-4 h-[200px] md:h-full relative rounded-xl overflow-hidden group">
            {programsImage ? (
              <img 
                src={programsImage.imageUrl} 
                alt={programsImage.title || "School Admission"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" 
              />
            ) : (
              <PlaceholderImage className="w-full h-full" text="School Admission" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 md:p-5">
              <span className="text-white font-medium">{t('home.photoStorySection.text2')}</span>
            </div>
          </div>
          
          {/* Small Image 2 */}
          <div className="md:col-span-4 h-[200px] md:h-full relative rounded-xl overflow-hidden group">
            {familyImage ? (
              <img 
                src={familyImage.imageUrl} 
                alt={familyImage.title || "Family Support"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" 
              />
            ) : (
              <PlaceholderImage className="w-full h-full" text="Family Support" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 md:p-5">
              <span className="text-white font-medium">{t('home.photoStorySection.text3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
