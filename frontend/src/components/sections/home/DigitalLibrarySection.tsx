import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { BookText, FileText, MonitorPlay, FileArchive, Laptop, BookOpenCheck, LibraryBig } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";

const resources = [
  { icon: BookText, label: "NCERT Books" },
  { icon: FileText, label: "Notes & Study Material" },
  { icon: MonitorPlay, label: "Educational Videos" },
  { icon: FileArchive, label: "PDFs" },
  { icon: Laptop, label: "Computer & Digital Learning Resources" },
  { icon: BookOpenCheck, label: "Competitive Exam Material" },
  { icon: LibraryBig, label: "Free Educational Resources" },
];

export function DigitalLibrarySection() {
    const { t } = useLanguage();
  return (
    <section className="py-16 md:py-24 bg-background border-y border-border">
      <div className="container-default">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold mb-3">
              <LibraryBig className="w-3.5 h-3.5" />
              <span>{t('home.digitalLibrarySection.text1')}</span>
            </div>
            
            <h2 className="text-h2 mb-4">{t('home.digitalLibrarySection.text2')}</h2>
            
            <p className="text-body-large mb-6">
              {t('home.digitalLibrarySection.desc1')}
            </p>
            
            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {resources.map((resource, index) => (
                <li key={index} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-surface-muted flex items-center justify-center text-brand-primary shrink-0 mt-0.5">
                    <resource.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-content-secondary leading-tight mt-0.5">{resource.label}</span>
                </li>
              ))}
            </ul>
            
            <Button to="/digital-library" variant="primary">
              {t('home.digitalLibrarySection.text3')}
                                      </Button>
          </div>
          
          <div className="relative h-[380px] lg:h-[480px] w-full rounded-2xl overflow-hidden shadow-soft">
            <PlaceholderImage className="w-full h-full" text="Digital Learning / Laptop / Student Image" />
          </div>
        </div>
      </div>
    </section>
  );
}
