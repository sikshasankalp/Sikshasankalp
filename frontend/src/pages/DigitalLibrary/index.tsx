import { LibraryHero } from '../../components/sections/library/LibraryHero';
import { LibraryIntro } from '../../components/sections/library/LibraryIntro';
import { LibraryCategories } from '../../components/sections/library/LibraryCategories';
import { LibraryFeatured } from '../../components/sections/library/LibraryFeatured';
import { LibraryHowItWorks } from '../../components/sections/library/LibraryHowItWorks';
import { LibraryForStudents } from '../../components/sections/library/LibraryForStudents';
import { LibrarySupportCTA } from '../../components/sections/library/LibrarySupportCTA';

export default function DigitalLibrary() {
  return (
    <div className="flex flex-col w-full">
      <LibraryHero />
      <LibraryIntro />
      <LibraryCategories />
      <LibraryFeatured />
      <LibraryHowItWorks />
      <LibraryForStudents />
      <LibrarySupportCTA />
    </div>
  );
}
