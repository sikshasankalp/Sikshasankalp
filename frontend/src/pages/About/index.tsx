import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AboutHero } from '../../components/sections/about/AboutHero';
import { WhoWeAre } from '../../components/sections/about/WhoWeAre';
import { OurBelief } from '../../components/sections/about/OurBelief';
import { WhatWeDo } from '../../components/sections/about/WhatWeDo';
import { OurApproach } from '../../components/sections/about/OurApproach';
import { ClosingCTA } from '../../components/sections/about/ClosingCTA';

export default function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace(/^#/, '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

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
