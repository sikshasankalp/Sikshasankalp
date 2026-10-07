import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { AnimatedCounter } from '../../common/AnimatedCounter';
import { fetchImpactMetrics } from '../../../services/api/impact';

interface MetricItem {
  id: string;
  value: number;
  label: string;
  description?: string;
}

const FALLBACK_IMPACTS: MetricItem[] = [
  {
    id: 'fallback-1',
    value: 42,
    label: 'Children supported in school admission / mainstreaming',
  },
  {
    id: 'fallback-2',
    value: 35,
    label: 'Families supported with portable bath tents',
  },
];

export function ImpactSection() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<MetricItem[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchImpactMetrics()
      .then((res) => {
        if (mounted && res?.data && res.data.length > 0) {
          setMetrics(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load live impact metrics, using default fallback:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const displayList = metrics.length > 0 ? metrics : FALLBACK_IMPACTS;

  return (
    <section className="py-16 md:py-24 bg-brand-secondary text-white relative overflow-hidden">
      <div className="container-default">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-h2 font-display">{t('home.impactSection.title1')}</h2>
        </div>

        <div
          className={`grid gap-10 max-w-4xl mx-auto ${
            displayList.length === 1
              ? 'grid-cols-1 place-items-center'
              : displayList.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : displayList.length === 3
              ? 'grid-cols-1 sm:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {displayList.map((impact, index) => (
            <div key={impact.id || index} className="text-center flex flex-col items-center group">
              <div className="text-6xl md:text-8xl font-display font-extrabold text-brand-accent mb-2 tracking-tight transition-transform duration-300 group-hover:scale-105">
                <AnimatedCounter
                  end={impact.value}
                  duration={2200}
                  delay={index * 150}
                  suffix="+"
                />
              </div>
              <span className="text-base md:text-lg font-medium text-white/90 max-w-[280px] leading-snug">
                {impact.label}
              </span>
              {impact.description && (
                <span className="text-xs text-white/60 mt-1 max-w-[240px]">
                  {impact.description}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 pt-6 border-t border-white/10">
          <p className="text-sm text-white/50 italic">
            {t('home.impactSection.note1')}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ImpactSection;
