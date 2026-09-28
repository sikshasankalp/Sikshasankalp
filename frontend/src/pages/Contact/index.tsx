import { ContactHero } from '../../components/sections/contact/ContactHero';
import { ContactMain } from '../../components/sections/contact/ContactMain';
import { ContactCTA } from '../../components/sections/contact/ContactCTA';

export default function Contact() {
  return (
    <div className="flex flex-col w-full">
      <ContactHero />
      <ContactMain />
      <ContactCTA />
    </div>
  );
}
