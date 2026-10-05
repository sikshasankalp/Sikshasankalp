import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PartnerHero } from '../../components/sections/partner/PartnerHero';
import { PartnerCategories } from '../../components/sections/partner/PartnerCategories';
import { PartnerWays } from '../../components/sections/partner/PartnerWays';
import { PartnerProcess } from '../../components/sections/partner/PartnerProcess';
import { PartnerWhyUs } from '../../components/sections/partner/PartnerWhyUs';
import { PartnerForm } from '../../components/sections/partner/PartnerForm';
import { PartnerCTA } from '../../components/sections/partner/PartnerCTA';

export default function PartnerWithUs() {
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
      <PartnerHero />
      <PartnerCategories />
      <PartnerWays />
      <PartnerProcess />
      <PartnerWhyUs />
      <PartnerForm />
      <PartnerCTA />
    </div>
  );
}
