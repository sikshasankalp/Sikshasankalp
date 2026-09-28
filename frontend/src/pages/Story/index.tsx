import { StoryHero } from '../../components/sections/story/StoryHero';
import { StoryTimeline } from '../../components/sections/story/StoryTimeline';
import { WhereWeStand } from '../../components/sections/story/WhereWeStand';
import { StoryClosingCTA } from '../../components/sections/story/StoryClosingCTA';

export default function Story() {
  return (
    <div className="flex flex-col w-full">
      <StoryHero />
      <StoryTimeline />
      <WhereWeStand />
      <StoryClosingCTA />
    </div>
  );
}
