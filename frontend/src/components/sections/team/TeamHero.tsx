import { useState, useEffect } from 'react';
import { useLanguage } from "../../../context/LanguageContext";
import { fetchGallery, type GalleryItem } from '../../../services/api/gallery';
import { PlaceholderImage } from '../../common/PlaceholderImage';

export function TeamHero() {
  const { t } = useLanguage();
  const [teamImage, setTeamImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const items = await fetchGallery({ displayLocation: 'TEAM' });
        if (items && items.length > 0) {
          setTeamImage(items[0]);
        }
      } catch (err) {
        console.error('Failed to load team hero image:', err);
      }
    };
    loadImage();
  }, []);

  return (
    <section className="relative pt-4 pb-8 md:pt-[24px] md:pb-[48px] overflow-hidden border-b border-border/50">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[5fr_5fr] lg:gap-12 xl:gap-[80px] items-center pt-2">
          <div className="flex flex-col max-w-[620px] lg:ml-6 xl:ml-10">
            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
              {t('team.teamHero.text1')}
            </h1>
            <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary">
              {t('team.teamHero.text2')}
            </p>
          </div>

          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 mt-6 lg:mt-0 shadow-sm">
            {teamImage ? (
              <img
                src={teamImage.imageUrl}
                alt={teamImage.title || "Our Dedicated Team"}
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <PlaceholderImage className="w-full h-full border-none" text="Our Dedicated Team Photo" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
