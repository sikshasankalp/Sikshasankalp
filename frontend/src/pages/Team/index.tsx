import { TeamHero } from '../../components/sections/team/TeamHero';
import { TeamLeadership } from '../../components/sections/team/TeamLeadership';
import { TeamAdvisors } from '../../components/sections/team/TeamAdvisors';
import { TeamSynergy } from '../../components/sections/team/TeamSynergy';
import { TeamCTA } from '../../components/sections/team/TeamCTA';

export default function Team() {
  return (
    <div className="flex flex-col w-full">
      <TeamHero />
      <TeamLeadership />
      <TeamAdvisors />
      <TeamSynergy />
      <TeamCTA />
    </div>
  );
}
