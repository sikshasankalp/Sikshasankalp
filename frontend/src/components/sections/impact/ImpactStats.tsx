import { useState, useEffect } from 'react';
import { fetchImpactMetrics } from '../../../services/api/impact';
import type { ImpactMetric } from '../../../services/api/impact';
import { useLanguage } from "../../../context/LanguageContext";

export function ImpactStats() {
    const { t } = useLanguage();
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);

  useEffect(() => {
    fetchImpactMetrics()
      .then(res => setMetrics(res.data))
      .catch(console.error);
  }, []);

  const displayMetrics = metrics.length > 0 ? metrics : [
    {
      id: 'fallback-1',
      value: '42',
      label: 'Children Supported',
      description: 'in school admission and mainstreaming'
    },
    {
      id: 'fallback-2',
      value: '35',
      label: 'Families Supported',
      description: 'with portable bath tents'
    }
  ];

  return (
    <section className="section-padding bg-brand-primary text-white">
      <div className="container-default max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">{t('impact.impactStats.text1')}</h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
            {t('impact.impactStats.text2')}
                                </p>
        </div>
        
        {displayMetrics.length > 0 && (
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {displayMetrics.map((metric) => (
              <div key={metric.id} className="flex flex-col items-center text-center">
                <span className="text-6xl md:text-8xl font-display font-bold text-white mb-6">{metric.value}</span>
                <h3 className="text-xl md:text-2xl font-bold mb-3">{metric.label}</h3>
                {metric.description && (
                  <p className="text-white/80 text-lg leading-relaxed max-w-sm">
                    {metric.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
