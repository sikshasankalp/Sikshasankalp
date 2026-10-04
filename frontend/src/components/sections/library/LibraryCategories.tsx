import { Book, FileText, MonitorPlay, File, Laptop, GraduationCap, LibraryBig, ArrowRight } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";

// Mock data structure ready for future API
export interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

export function LibraryCategories() {
    const { t } = useLanguage();
  const categories: ResourceCategory[] = [
    { id: 'ncert', title: 'NCERT Books', description: 'Complete official curriculum textbooks for all grades.', icon: Book },
    { id: 'notes', title: 'Notes & Study Material', description: 'Curated notes and summaries to help with daily studies.', icon: FileText },
    { id: 'videos', title: 'Educational Videos', description: 'Visual learning materials and recorded lectures.', icon: MonitorPlay },
    { id: 'pdfs', title: 'PDFs', description: 'Downloadable worksheets, guides, and assignments.', icon: File },
    { id: 'digital', title: 'Computer & Digital Learning', description: 'Resources for building digital literacy and computer skills.', icon: Laptop },
    { id: 'exams', title: 'Competitive Exam Material', description: 'Preparation resources for various competitive examinations.', icon: GraduationCap },
    { id: 'other', title: 'Free Educational Resources', description: 'General reading materials, storybooks, and supplementary learning.', icon: LibraryBig },
  ];

  return (
    <section id="categories" className="section-padding bg-background border-t border-border/50">
      <div className="container-default max-w-6xl">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-h2 mb-4">{t('library.libraryCategories.text1')}</h2>
          <p className="text-body-large max-w-2xl mx-auto">
            {t('library.libraryCategories.text2')}
                                </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="flex flex-col border-t-2 border-border pt-6 group">
                <Icon className="w-8 h-8 text-brand-primary mb-5" />
                <h3 className="text-h4 mb-3 text-content-primary">{category.title}</h3>
                <p className="text-body text-content-secondary mb-6 flex-grow leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-auto">
                  <button className="text-brand-primary font-semibold text-sm uppercase tracking-wider flex items-center group-hover:text-brand-primary-hover transition-colors">
                    {t('library.libraryCategories.text3')} <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
