import { useState, useEffect } from 'react';
import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useLanguage } from "../../../context/LanguageContext";
import { fetchGallery } from '../../../services/api/gallery';
import type { GalleryItem } from '../../../services/api/gallery';

export function StoryTeaser() {
  const { t } = useLanguage();
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const items = await fetchGallery({ displayLocation: 'STORY_MAIN' });
        if (items && items.length > 0) {
          setImages(items);
        }
      } catch (err) {
        console.error('Failed to load story images:', err);
      }
    };
    loadImages();
  }, []);

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds transition

    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  return (
    <section className="py-14 md:py-24 bg-background">
      <div className="container-default">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div 
            className="order-2 lg:order-1 relative h-[380px] md:h-[480px] w-full rounded-xl overflow-hidden shadow-soft lg:sticky lg:top-32"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {images.length > 0 ? (
              <>
                {images.map((img, idx) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt={img.title || 'Story Image'}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                  />
                ))}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <PlaceholderImage className="w-full h-full" text="Foundation Story Image" />
            )}
          </div>
          
          <div className="order-1 lg:order-2 lg:pt-8 lg:pl-4">
            <h2 className="text-h2 mb-5">{t('home.storyTeaser.title1')}</h2>
            
            <div className="space-y-4 text-body-large mb-8 max-w-lg">
              <p>
                {t('home.storyTeaser.desc1')}
              </p>
              <p>
                {t('home.storyTeaser.text1')}
              </p>
            </div>
            
            <Button to="/our-story" variant="accent" size="lg" arrow>
              {t('home.storyTeaser.btn1')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
