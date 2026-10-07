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
    id: 'seed-metric-1',
    value: 42,
    label: 'Children Supported',
    description: 'Guided and supported toward school admission and mainstream education.',
  },
  {
    id: 'seed-metric-2',
    value: 35,
    label: 'Families Supported',
    description: 'Provided with portable bath tents, helping improve privacy, hygiene, and dignity.',
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

  const getNumberSizeClass = (count: number) => {
    if (count <= 2) return 'text-6xl md:text-7xl lg:text-8xl';
    if (count === 3) return 'text-5xl md:text-6xl lg:text-7xl';
    return 'text-4xl md:text-5xl lg:text-6xl';
  };

  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-md';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-4xl gap-10 md:gap-16';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-3 max-w-5xl gap-8 md:gap-10';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl gap-8';
  };

  return (
    <section className="py-16 md:py-24 bg-brand-secondary text-white relative overflow-hidden">
      <div className="container-default">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-h2 font-display">{t('home.impactSection.title1')}</h2>
        </div>

        <div className={`grid mx-auto ${getGridClass(displayList.length)}`}>
          {displayList.map((impact, index) => (
            <div 
              key={impact.id || index} 
              className="text-center flex flex-col items-center group p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.03]"
            >
              <div className={`${getNumberSizeClass(displayList.length)} font-display font-extrabold text-brand-accent mb-3 tracking-tight transition-transform duration-300 group-hover:scale-105`}>
                <AnimatedCounter
                  end={impact.value}
                  duration={2200}
                  delay={index * 150}
                  suffix="+"
                />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug">
                {impact.label}
              </h3>
              {impact.description && (
                <p className="text-sm text-white/70 leading-relaxed max-w-xs">
                  {impact.description}
                </p>
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
