import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { fetchGallery, type GalleryItem } from '../../../services/api/gallery';

const mediaLogos = [
  "Aaj Tak",
  "News18",
  "ABP News",
  "India Today"
];

export function MediaCoverageSection() {
  const { t } = useLanguage();
  const [mediaItems, setMediaItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const items = await fetchGallery({ displayLocation: 'HOME_MEDIA' });
        if (items && items.length > 0) {
          setMediaItems(items);
        }
      } catch (err) {
        console.error('Failed to load media coverage images:', err);
      }
    };
    loadMedia();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container-default text-center">
        <h2 className="text-h2 mb-10">{t('home.mediaCoverageSection.title1')}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto">
          {mediaLogos.map((logo, index) => (
            <div key={index} className="aspect-video bg-surface-muted rounded-lg border border-border flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer hover:shadow-soft">
              <span className="font-display font-bold text-content-muted text-lg md:text-xl">{logo}</span>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          <div className="h-[220px] rounded-lg overflow-hidden border border-border shadow-soft relative group cursor-pointer">
            {mediaItems[0] ? (
              <img
                src={mediaItems[0].imageUrl}
                alt={mediaItems[0].title || "Media Coverage 1"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <PlaceholderImage className="w-full h-full transition-transform duration-500 group-hover:scale-105" text="Media Screenshot 1" />
            )}
          </div>
          <div className="h-[220px] rounded-lg overflow-hidden border border-border shadow-soft relative group cursor-pointer hidden md:block">
            {mediaItems[1] ? (
              <img
                src={mediaItems[1].imageUrl}
                alt={mediaItems[1].title || "Media Coverage 2"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <PlaceholderImage className="w-full h-full transition-transform duration-500 group-hover:scale-105" text="Media Screenshot 2" />
            )}
          </div>
        </div>
        
        <Button to="/media" variant="outline">
          {t('home.mediaCoverageSection.btn1')}
        </Button>
      </div>
    </section>
  );
}
