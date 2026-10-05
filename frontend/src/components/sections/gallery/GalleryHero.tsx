import { useState, useEffect } from 'react';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useLanguage } from "../../../context/LanguageContext";
import { fetchGallery, type GalleryItem } from '../../../services/api/gallery';

export function GalleryHero() {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const items = await fetchGallery({ displayLocation: 'GALLERY' });
        if (items && items.length > 0) {
          setHeroImage(items[0]);
        }
      } catch (err) {
        console.error('Failed to load gallery hero image:', err);
      }
    };
    loadImage();
  }, []);

  return (
    <section className="relative pt-4 pb-8 md:pt-[24px] md:pb-[48px] overflow-hidden border-b border-border/50">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[4fr_6fr] lg:gap-12 xl:gap-[80px] items-center pt-2">
          <div className="flex flex-col max-w-[580px] lg:ml-6 xl:ml-10">
            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
              {t('gallery.galleryHero.text1')}
            </h1>
            <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary">
              {t('gallery.galleryHero.text2')}
            </p>
          </div>
          
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 mt-6 lg:mt-0">
            {heroImage ? (
              <img
                src={heroImage.imageUrl}
                alt={heroImage.title || "Gallery"}
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <PlaceholderImage className="w-full h-full border-none" text="Gallery Featured Real Photo" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
