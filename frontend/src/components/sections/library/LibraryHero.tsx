import { useState, useEffect } from 'react';
import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { fetchGallery } from '../../../services/api/gallery';
import { useLanguage } from "../../../context/LanguageContext";

export function LibraryHero() {
  const { t } = useLanguage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery({ displayLocation: 'DIGITAL_LIBRARY' })
      .then(res => {
        if (res.length > 0) {
          setImageUrl(res[0].imageUrl);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <section className="relative pt-4 pb-8 md:pt-[24px] md:pb-[48px] overflow-hidden border-b border-border/50">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[4fr_6fr] lg:gap-12 xl:gap-[80px] items-center pt-2">
          <div className="flex flex-col max-w-[580px] lg:ml-6 xl:ml-10">
            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
              {t('library.libraryHero.text1')}
            </h1>
            <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary mb-[32px]">
              {t('library.libraryHero.text2')}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button to="#categories" variant="outline" size="lg" arrow>
                {t('library.libraryHero.text3')}
              </Button>
              <Button to="/donate" variant="accent" size="lg" arrow>
                {t('library.libraryHero.text4')}
              </Button>
            </div>
          </div>
          
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 mt-6 lg:mt-0">
            {imageUrl ? (
              <img src={imageUrl} alt="Digital Learning" className="w-full h-full object-cover" loading="eager" decoding="sync" />
            ) : (
              <PlaceholderImage className="w-full h-full border-none" text="Digital Learning Real Photo" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
