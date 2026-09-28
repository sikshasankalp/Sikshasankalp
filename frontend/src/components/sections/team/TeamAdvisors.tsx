import { PlaceholderImage } from '../../common/PlaceholderImage';

export function TeamAdvisors() {
  const advisors = [
    {
      name: 'Dr. Komal',
      title: 'Health & Child Welfare Advisor',
      responsibility: 'Guides health checkups, hygiene awareness, and child/family welfare programs.',
      imageId: 'dr-komal'
    },
    {
      name: 'Umesh Kumar',
      title: 'Chief Educational Mentor',
      responsibility: 'Provides curriculum guidance, structures remedial and bridge learning, and oversees school mainstreaming efforts.',
      imageId: 'umesh-kumar'
    },
    {
      name: 'Rajiv Gera',
      title: 'Senior Mentor & Life-Skills Educator',
      responsibility: 'Focuses on remedial education, life skills, ethics, and general learning-space guidance.',
      imageId: 'rajiv-gera'
    },
    {
      name: 'Javed Khan (CA)',
      title: 'Head of Finance & Compliance',
      responsibility: 'Maintains strict financial oversight, auditing, GST, and comprehensive NGO compliance.',
      imageId: 'javed-khan'
    }
  ];

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <h2 className="text-h2 mb-12 text-center md:text-left">Advisors & Mentors</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {advisors.map((person, index) => (
            <div key={index} className="flex flex-col group border-t border-border pt-6">
              <div className="relative aspect-square w-full mb-6 rounded-lg overflow-hidden bg-surface-muted border border-border/50">
                <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text={`${person.name} Portrait Placeholder`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-content-primary mb-1">{person.name}</h3>
                <p className="text-brand-primary font-semibold text-xs uppercase tracking-wider mb-3 leading-snug">{person.title}</p>
                <p className="text-body text-content-secondary leading-relaxed">
                  {person.responsibility}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
