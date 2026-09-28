import { AboutHero } from '../../components/sections/about/AboutHero';
import { WhoWeAre } from '../../components/sections/about/WhoWeAre';
import { OurBelief } from '../../components/sections/about/OurBelief';
import { WhatWeDo } from '../../components/sections/about/WhatWeDo';
import { OurApproach } from '../../components/sections/about/OurApproach';
import { ClosingCTA } from '../../components/sections/about/ClosingCTA';

export default function About() {
  return (
    <div className="flex flex-col w-full">
      <AboutHero />
      <WhoWeAre />
      <OurBelief />
      <WhatWeDo />
      <OurApproach />
      <ClosingCTA />
    </div>
  );
}
