import { useLanguage } from "../../../context/LanguageContext";
import { 
  BookOpen, School, GraduationCap, Laptop, 
  Tent, HeartPulse, HeartHandshake, Sprout 
} from 'lucide-react';

export function WhatWeDo() {
  const { t } = useLanguage();

  const areasOfWork = [
    {
      icon: BookOpen,
      title: 'Education & Footpath Learning',
      description: 'Bringing learning directly to children on the streets, building foundational skills before transitioning them to formal schools.',
      colorClass: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    },
    {
      icon: School,
      title: 'School Admission & Support',
      description: 'Facilitating enrollment in mainstream schools and providing the necessary support to ensure continuous attendance.',
      colorClass: 'bg-orange-500/10 text-orange-600 border border-orange-500/20',
    },
    {
      icon: GraduationCap,
      title: 'Educational Support',
      description: 'Offering tutoring, mentoring, and resources to help students succeed academically and overcome learning gaps.',
      colorClass: 'bg-rose-500/10 text-rose-600 border border-rose-500/20',
    },
    {
      icon: Laptop,
      title: 'Free Digital Siksha & Library',
      description: 'Providing access to digital learning tools and a well-equipped library to bridge the digital divide.',
      colorClass: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    },
    {
      icon: Tent,
      title: 'Bath Tent & Dignity Support',
      description: 'Ensuring basic hygiene and dignity by providing safe bathing facilities for children living on the streets.',
      colorClass: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
    },
    {
      icon: HeartPulse,
      title: 'Health & Hygiene',
      description: 'Conducting health check-ups and promoting hygiene practices to keep children healthy and active.',
      colorClass: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
    },
    {
      icon: HeartHandshake,
      title: 'Family & Essential Support',
      description: 'Working with families to provide essential resources, counseling, and support to create a stable home environment.',
      colorClass: 'bg-red-500/10 text-red-600 border border-red-500/20',
    },
    {
      icon: Sprout,
      title: 'Environment & Plantation',
      description: 'Teaching children about environmental responsibility through tree plantation drives and nature awareness programs.',
      colorClass: 'bg-green-600/10 text-green-700 border border-green-600/20',
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
          {areasOfWork.map((area, index) => {
            const Icon = area.icon;
            return (
              <div 
                key={index} 
                className="flex items-start gap-4 sm:gap-5 border-t border-border/80 pt-6 group transition-all"
              >
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-xs ${area.colorClass}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-content-primary group-hover:text-brand-primary transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-body text-content-secondary leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default WhatWeDo;
