import { useState, useEffect } from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { fetchGallery, type GalleryItem } from '../../../services/api/gallery';

export function DonateHero() {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const items = await fetchGallery({ displayLocation: 'DONATE' });
        if (items && items.length > 0) {
          setHeroImage(items[0]);
        }
      } catch (err) {
        console.error('Failed to load donate hero image:', err);
      }
    };
    loadImage();
  }, []);

  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h1 className="text-h1 mb-6">{t('donate.donateHero.text1')}</h1>
        <p className="text-body-large leading-relaxed text-content-secondary max-w-2xl mx-auto mb-6">
          {t('donate.donateHero.text2')}
        </p>
        {heroImage && (
          <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-2xl overflow-hidden shadow-lg border border-border/50 mt-6 mx-auto">
            <img
              src={heroImage.imageUrl}
              alt={heroImage.title || "Support Education"}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
}
