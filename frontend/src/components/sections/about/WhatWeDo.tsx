import { useLanguage } from "../../../context/LanguageContext";

export function WhatWeDo() {
    const { t } = useLanguage();
  const areasOfWork = [
    {
      title: 'Education & Footpath Learning',
      description: 'Bringing learning directly to children on the streets, building foundational skills before transitioning them to formal schools.'
    },
    {
      title: 'School Admission & Support',
      description: 'Facilitating enrollment in mainstream schools and providing the necessary support to ensure continuous attendance.'
    },
    {
      title: 'Educational Support',
      description: 'Offering tutoring, mentoring, and resources to help students succeed academically and overcome learning gaps.'
    },
    {
      title: 'Free Digital Shiksha & Library',
      description: 'Providing access to digital learning tools and a well-equipped library to bridge the digital divide.'
    },
    {
      title: 'Bath Tent & Dignity Support',
      description: 'Ensuring basic hygiene and dignity by providing safe bathing facilities for children living on the streets.'
    },
    {
      title: 'Health & Hygiene',
      description: 'Conducting health check-ups and promoting hygiene practices to keep children healthy and active.'
    },
    {
      title: 'Family & Essential Support',
      description: 'Working with families to provide essential resources, counseling, and support to create a stable home environment.'
    },
    {
      title: 'Environment & Plantation',
      description: 'Teaching children about environmental responsibility through tree plantation drives and nature awareness programs.'
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-default">
        <div className="max-w-3xl mb-12 md:mb-16">
          <h2 className="text-h2 mb-4">{t('about.whatWeDo.text1')}</h2>
          <p className="text-body-large">
            {t('about.whatWeDo.text2')}
                                </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {areasOfWork.map((area, index) => (
            <div key={index} className="flex flex-col border-t border-border pt-6">
              <h3 className="text-h4 mb-3 text-content-primary">{area.title}</h3>
              <p className="text-body text-content-secondary">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
