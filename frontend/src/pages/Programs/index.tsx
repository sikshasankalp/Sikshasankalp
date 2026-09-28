import { ProgramsHero } from '../../components/sections/programs/ProgramsHero';
import { ProgramsIntro } from '../../components/sections/programs/ProgramsIntro';
import { ProgramsList } from '../../components/sections/programs/ProgramsList';
import { ProgramsSynergy } from '../../components/sections/programs/ProgramsSynergy';
import { ProgramsCTA } from '../../components/sections/programs/ProgramsCTA';

export default function Programs() {
  return (
    <div className="flex flex-col w-full">
      <ProgramsHero />
      <ProgramsIntro />
      <ProgramsList />
      <ProgramsSynergy />
      <ProgramsCTA />
    </div>
  );
}
