import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { InvolvedHero } from '../../components/sections/get-involved/InvolvedHero';
import { InvolvedWays } from '../../components/sections/get-involved/InvolvedWays';
import { InvolvedForm } from '../../components/sections/get-involved/InvolvedForm';
import { InvolvedProcess } from '../../components/sections/get-involved/InvolvedProcess';
import { InvolvedOtherWays } from '../../components/sections/get-involved/InvolvedOtherWays';
import { InvolvedCTA } from '../../components/sections/get-involved/InvolvedCTA';

export default function GetInvolved() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const elem = document.getElementById(targetId);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="flex flex-col w-full">
      <InvolvedHero />
      <InvolvedWays />
      <InvolvedForm />
      <InvolvedProcess />
      <InvolvedOtherWays />
      <InvolvedCTA />
    </div>
  );
}
