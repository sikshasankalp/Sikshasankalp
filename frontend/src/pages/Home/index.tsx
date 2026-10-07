import { HeroSection } from '../../components/sections/home/HeroSection';
import { NeedsTicker } from '../../components/common/NeedsTicker';
import { MissionSection } from '../../components/sections/home/MissionSection';
import { StoryTeaser } from '../../components/sections/home/StoryTeaser';
import { ProgramsOverview } from '../../components/sections/home/ProgramsOverview';
import { ImpactSection } from '../../components/sections/home/ImpactSection';
import { DigitalLibrarySection } from '../../components/sections/home/DigitalLibrarySection';
import { PhotoStorySection } from '../../components/sections/home/PhotoStorySection';
import { MediaCoverageSection } from '../../components/sections/home/MediaCoverageSection';
import { GetInvolvedSection } from '../../components/sections/home/GetInvolvedSection';
import { DonateCTA } from '../../components/sections/home/DonateCTA';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <NeedsTicker />
      <HeroSection />
      <MissionSection />
      <StoryTeaser />
      <ProgramsOverview />
      <ImpactSection />
      <DigitalLibrarySection />
      <PhotoStorySection />
      <MediaCoverageSection />
      <GetInvolvedSection />
      <DonateCTA />
    </div>
  );
}
