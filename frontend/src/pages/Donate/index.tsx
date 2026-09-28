import { DonateHero } from '../../components/sections/donate/DonateHero';
import { DonateMain } from '../../components/sections/donate/DonateMain';
import { DonateTrust } from '../../components/sections/donate/DonateTrust';
import { DonateImpact } from '../../components/sections/donate/DonateImpact';

export default function Donate() {
  return (
    <div className="flex flex-col w-full">
      <DonateHero />
      <DonateMain />
      <DonateTrust />
      <DonateImpact />
    </div>
  );
}
