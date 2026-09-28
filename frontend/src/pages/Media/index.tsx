import { MediaHero } from '../../components/sections/media/MediaHero';
import { MediaFeatured } from '../../components/sections/media/MediaFeatured';
import { MediaGrid } from '../../components/sections/media/MediaGrid';
import { MediaWhyItMatters } from '../../components/sections/media/MediaWhyItMatters';
import { MediaCTA } from '../../components/sections/media/MediaCTA';

export default function Media() {
  return (
    <div className="flex flex-col w-full">
      <MediaHero />
      <MediaFeatured />
      <MediaGrid />
      <MediaWhyItMatters />
      <MediaCTA />
    </div>
  );
}
