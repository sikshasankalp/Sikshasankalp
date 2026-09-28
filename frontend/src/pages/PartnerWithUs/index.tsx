import { PartnerHero } from '../../components/sections/partner/PartnerHero';
import { PartnerCategories } from '../../components/sections/partner/PartnerCategories';
import { PartnerWays } from '../../components/sections/partner/PartnerWays';
import { PartnerProcess } from '../../components/sections/partner/PartnerProcess';
import { PartnerWhyUs } from '../../components/sections/partner/PartnerWhyUs';
import { PartnerForm } from '../../components/sections/partner/PartnerForm';
import { PartnerCTA } from '../../components/sections/partner/PartnerCTA';

export default function PartnerWithUs() {
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
