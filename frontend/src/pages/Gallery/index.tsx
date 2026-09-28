import { GalleryHero } from '../../components/sections/gallery/GalleryHero';
import { GalleryGrid } from '../../components/sections/gallery/GalleryGrid';

export default function Gallery() {
  return (
    <div className="flex flex-col w-full">
      <GalleryHero />
      <GalleryGrid />
    </div>
  );
}
