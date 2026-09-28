const PARTNER_CATEGORIES = [
  { id: 'csr', title: 'CSR Partners', desc: 'Direct your CSR mandate toward high-impact, verifiable ground-level education and health programs.' },
  { id: 'schools', title: 'Schools', desc: 'Help us bridge the gap by integrating underprivileged students into mainstream classrooms and sharing learning resources.' },
  { id: 'colleges', title: 'Colleges & Universities', desc: 'Collaborate on volunteer programs, digital literacy drives, and student mentorship initiatives.' },
  { id: 'corporate', title: 'Corporate Organisations', desc: 'Engage your workforce in meaningful volunteering or support our digital library and resource drives.' },
  { id: 'ngo', title: 'NGOs & Community Orgs', desc: 'Share knowledge, resources, and ground efforts to amplify collective impact in communities.' },
  { id: 'networks', title: 'Professional Networks', desc: 'Lend industry expertise in technology, law, healthcare, or education to strengthen our foundation.' },
  { id: 'individuals', title: 'Individual Supporters', desc: 'Sponsor a child\'s education, contribute to the digital library, or provide essential supplies.' }
] as const;

export function PartnerCategories() {
  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <h2 className="text-h2 mb-12 text-center md:text-left">Who Can Partner With Us</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {PARTNER_CATEGORIES.map((category) => (
            <div key={category.id} className="flex flex-col border-t-2 border-border pt-6">
              <h3 className="text-xl font-bold text-content-primary mb-3">{category.title}</h3>
              <p className="text-body text-content-secondary leading-relaxed">
                {category.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
