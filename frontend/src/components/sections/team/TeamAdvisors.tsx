import { User } from 'lucide-react';
import type { TeamMember } from '../../../services/api/team';
import { useLanguage } from "../../../context/LanguageContext";

interface TeamAdvisorsProps {
  members: TeamMember[];
}

export function TeamAdvisors({ members }: TeamAdvisorsProps) {
    const { t } = useLanguage();
  if (!members || members.length === 0) return null;

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <h2 className="text-h2 mb-12 text-center md:text-left">{t('team.teamAdvisors.text1')}</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {members.map((person) => (
            <div key={person.id} className="flex flex-col group border-t border-border pt-6">
              <div className="relative aspect-square w-full mb-6 rounded-lg overflow-hidden bg-surface-muted border border-border/50">
                {person.photoUrl ? (
                  <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-muted transition-transform duration-500 group-hover:scale-105">
                    <User className="w-16 h-16 text-content-muted" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-content-primary mb-1">{person.name}</h3>
                <p className="text-brand-primary font-semibold text-xs uppercase tracking-wider mb-3 leading-snug">
                  {person.designation}
                  {person.department && (
                    <><br/><span className="text-[10px] text-brand-primary/80 tracking-normal capitalize">({person.department})</span></>
                  )}
                </p>
                
                {person.responsibilities && (
                  <div className="mb-3">
                    <p className="text-[10px] font-bold text-content-primary uppercase tracking-wider mb-1">{t('team.teamAdvisors.text2')}</p>
                    <p className="text-body-sm text-content-secondary leading-relaxed">
                      {person.responsibilities}
                    </p>
                  </div>
                )}
                
                {person.bio && (
                  <div className="mb-3">
                    <p className="text-body-sm text-content-secondary leading-relaxed">
                      {person.bio}
                    </p>
                  </div>
                )}

                {person.expertise && (
                  <div>
                    <p className="text-[10px] font-bold text-content-primary uppercase tracking-wider mb-1">{t('team.teamAdvisors.text3')}</p>
                    <p className="text-xs text-content-secondary">
                      {person.expertise}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
