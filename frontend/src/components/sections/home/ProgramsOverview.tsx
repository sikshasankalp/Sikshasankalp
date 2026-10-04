import { useLanguage } from '../../../context/LanguageContext';
import { BookOpen, GraduationCap, Library, Tent, HeartPulse, Home, TreePine, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const programs = [
  {
    icon: BookOpen,
    title: 'home.programsOverview.title1',
    description: 'home.programsOverview.desc1'
  },
  {
    icon: GraduationCap,
    title: 'home.programsOverview.title2',
    description: 'home.programsOverview.desc2'
  },
  {
    icon: Users,
    title: 'home.programsOverview.title3',
    description: 'home.programsOverview.desc3'
  },
  {
    icon: Library,
    title: 'home.programsOverview.title4',
    description: 'home.programsOverview.desc4'
  },
  {
    icon: Tent,
    title: 'home.programsOverview.title5',
    description: 'home.programsOverview.desc5'
  },
  {
    icon: HeartPulse,
    title: 'home.programsOverview.title6',
    description: 'home.programsOverview.desc6'
  },
  {
    icon: Home,
    title: 'home.programsOverview.title7',
    description: 'home.programsOverview.desc7'
  },
  {
    icon: TreePine,
    title: 'home.programsOverview.title8',
    description: 'home.programsOverview.desc8'
  }
];

export function ProgramsOverview() {
  const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24 bg-surface-muted">
      <div className="container-default">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-h2 mb-3">{t('home.programsOverview.titleMain')}</h2>
          <p className="text-body-large">
            {t('home.programsOverview.descMain')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.map((program, index) => (
            <Link 
              key={index}
              to="/programs" 
              className="card p-5 flex flex-col group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                <program.icon className="w-5 h-5" />
              </div>
              <h3 className="text-h4 mb-1.5 group-hover:text-brand-primary transition-colors">{t(program.title)}</h3>
              <p className="text-body-small mt-auto leading-relaxed">{t(program.description)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
