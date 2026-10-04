import { BookOpen, Users, Camera, Laptop, HeartPulse, Calendar, PlusCircle } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";

const INVOLVEMENT_OPTIONS = [
  { id: 'teaching', label: 'Teaching', icon: BookOpen, desc: 'Assist in foundational education, remedial classes, or school bridge learning for children.' },
  { id: 'volunteering', label: 'General Volunteering', icon: Users, desc: 'Help with day-to-day operations, distribution drives, and community outreach.' },
  { id: 'photography', label: 'Photography / Videography', icon: Camera, desc: 'Document our field activities and help us share our story with the world.' },
  { id: 'digital', label: 'Digital Support', icon: Laptop, desc: 'Assist with our digital library, website, social media, or basic computer literacy classes.' },
  { id: 'health', label: 'Health Awareness', icon: HeartPulse, desc: 'Support health checkups, hygiene workshops, and the bath tent initiative.' },
  { id: 'events', label: 'Events', icon: Calendar, desc: 'Help organize and manage awareness events and community gatherings.' },
  { id: 'other', label: 'Other', icon: PlusCircle, desc: 'Have a unique skill? Let us know how you would like to contribute.' }
] as const;

export function InvolvedWays() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <h2 className="text-h2 mb-12 text-center md:text-left">{t('get-Involved.involvedWays.text1')}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
          {INVOLVEMENT_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <div key={option.id} className="flex flex-col border-t-2 border-border pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-6 h-6 text-brand-primary" />
                  <h3 className="text-xl font-bold text-content-primary">{option.label}</h3>
                </div>
                <p className="text-body text-content-secondary leading-relaxed">
                  {option.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
