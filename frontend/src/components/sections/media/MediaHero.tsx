import { useState, useEffect } from 'react';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { useLanguage } from "../../../context/LanguageContext";
import { fetchGallery } from '../../../services/api/gallery';
import { fetchMedia } from '../../../services/api/media';

export function MediaHero() {
  const { t } = useLanguage();
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // 1. Check if there's a dedicated hero image uploaded in Gallery
        const galleryHero = await fetchGallery({ displayLocation: 'MEDIA_HERO' });
        if (galleryHero && galleryHero.length > 0 && galleryHero[0].imageUrl) {
          setHeroImage(galleryHero[0].imageUrl);
          return;
        }

        const galleryCoverage = await fetchGallery({ displayLocation: 'MEDIA_COVERAGE' });
        if (galleryCoverage && galleryCoverage.length > 0 && galleryCoverage[0].imageUrl) {
          setHeroImage(galleryCoverage[0].imageUrl);
          return;
        }

        // 2. Otherwise check if there's any media article with a thumbnail
        const mediaItems = await fetchMedia();
        const itemWithThumb = mediaItems.find(m => m.thumbnailUrl && m.isPublished);
        if (itemWithThumb?.thumbnailUrl) {
          setHeroImage(itemWithThumb.thumbnailUrl);
        }
      } catch (err) {
        console.error('Failed to load media hero image:', err);
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
              {t('media.mediaHero.text1')}
            </h1>
            <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary">
              {t('media.mediaHero.text2')}
            </p>
          </div>
          
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 mt-6 lg:mt-0 shadow-sm">
            {heroImage ? (
              <img
                src={heroImage}
                alt="Media Coverage"
                className="w-full h-full object-cover"
              />
            ) : (
              <PlaceholderImage className="w-full h-full border-none" text="Media Coverage Real Photo" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
