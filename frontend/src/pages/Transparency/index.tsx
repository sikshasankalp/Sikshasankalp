import { TransparencyHero } from '../../components/sections/transparency/TransparencyHero';
import { TransparencyRegistration } from '../../components/sections/transparency/TransparencyRegistration';
import { TransparencyCompliance } from '../../components/sections/transparency/TransparencyCompliance';
import { TransparencyReports } from '../../components/sections/transparency/TransparencyReports';
import { TransparencyFinancial } from '../../components/sections/transparency/TransparencyFinancial';
import { TransparencyCTA } from '../../components/sections/transparency/TransparencyCTA';

export default function Transparency() {
  return (
    <div className="flex flex-col w-full">
      <TransparencyHero />
      <TransparencyRegistration />
      <TransparencyCompliance />
      <TransparencyReports />
      <TransparencyFinancial />
      <TransparencyCTA />
    </div>
  );
}
