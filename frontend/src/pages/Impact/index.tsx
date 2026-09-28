import { ImpactHero } from '../../components/sections/impact/ImpactHero';
import { ImpactStats } from '../../components/sections/impact/ImpactStats';
import { ImpactEducation } from '../../components/sections/impact/ImpactEducation';
import { ImpactDignity } from '../../components/sections/impact/ImpactDignity';
import { ImpactPrograms } from '../../components/sections/impact/ImpactPrograms';
import { ImpactStories } from '../../components/sections/impact/ImpactStories';
import { ImpactTransparency } from '../../components/sections/impact/ImpactTransparency';
import { ImpactCTA } from '../../components/sections/impact/ImpactCTA';

export default function Impact() {
  return (
    <div className="flex flex-col w-full">
      <ImpactHero />
      <ImpactStats />
      <ImpactEducation />
      <ImpactDignity />
      <ImpactPrograms />
      <ImpactStories />
      <ImpactTransparency />
      <ImpactCTA />
    </div>
  );
}
