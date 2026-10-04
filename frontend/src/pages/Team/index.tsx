import { TeamHero } from '../../components/sections/team/TeamHero';
import { TeamLeadership } from '../../components/sections/team/TeamLeadership';
import { TeamAdvisors } from '../../components/sections/team/TeamAdvisors';
import { TeamSynergy } from '../../components/sections/team/TeamSynergy';
import { TeamCTA } from '../../components/sections/team/TeamCTA';
import { useState, useEffect } from 'react';
import { fetchTeam } from '../../services/api/team';
import type { TeamMember } from '../../services/api/team';
import { useLanguage } from "../../context/LanguageContext";

export default function Team() {
    const { t } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchTeam({ limit: 100 })
      .then(res => {
        setMembers(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load team members.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col w-full min-h-screen">
        <TeamHero />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col w-full min-h-screen">
        <TeamHero />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Split logic based on original design: first two are leaders, rest are advisors
  const leaders = members.slice(0, 2);
  const advisors = members.slice(2);

  return (
    <div className="flex flex-col w-full">
      <TeamHero />
      {members.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-content-secondary text-lg">{t('team.index.text1')}</p>
        </div>
      ) : (
        <>
          <TeamLeadership members={leaders} />
          <TeamAdvisors members={advisors} />
        </>
      )}
      <TeamSynergy />
      <TeamCTA />
    </div>
  );
}
