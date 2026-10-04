import { User } from 'lucide-react';
import type { TeamMember } from '../../../services/api/team';
import { useLanguage } from "../../../context/LanguageContext";

interface TeamLeadershipProps {
  members: TeamMember[];
}

export function TeamLeadership({ members }: TeamLeadershipProps) {
    const { t } = useLanguage();
  if (!members || members.length === 0) return null;

  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <h2 className="text-h2 mb-12 text-center md:text-left">{t('team.teamLeadership.text1')}</h2>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {members.map((member) => (
            <div key={member.id} className="flex flex-col group">
              <div className="relative aspect-[3/4] w-full max-w-[320px] mb-6 rounded-lg overflow-hidden bg-background border border-border/50 mx-auto md:mx-0">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-muted transition-transform duration-500 group-hover:scale-105">
                    <User className="w-16 h-16 text-content-muted" />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left max-w-[360px] mx-auto md:mx-0">
                <h3 className="text-2xl font-bold text-content-primary mb-1">{member.name}</h3>
                <p className="text-brand-primary font-semibold text-sm uppercase tracking-wider mb-4 leading-snug">
                  {member.designation}
                  {member.department && (
                    <><br/><span className="text-xs text-brand-primary/80 tracking-normal capitalize">({member.department})</span></>
                  )}
                </p>
                {member.responsibilities && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-content-primary uppercase tracking-wider mb-1">{t('team.teamLeadership.text2')}</p>
                    <p className="text-body-large text-content-secondary leading-relaxed">
                      {member.responsibilities}
                    </p>
                  </div>
                )}
                {member.bio && (
                  <div className="mb-4">
                    <p className="text-body text-content-secondary leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                )}
                {member.expertise && (
                  <div>
                    <p className="text-xs font-bold text-content-primary uppercase tracking-wider mb-1">{t('team.teamLeadership.text3')}</p>
                    <p className="text-body-sm text-content-secondary">
                      {member.expertise}
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
