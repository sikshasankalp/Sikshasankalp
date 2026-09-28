import { FileText } from 'lucide-react';

export function TransparencyReports() {
  const reportCategories = [
    'Annual Reports',
    'Activity Reports',
    'Financial Reports',
    'Other Publications'
  ];

  return (
    <section className="section-padding bg-background border-t border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <h2 className="text-h2 mb-4">Reports & Documentation</h2>
        <p className="text-body-large text-content-secondary mb-12 max-w-2xl">
          Detailed operational and financial reports will be published in this section at the conclusion of relevant reporting periods.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportCategories.map((category, index) => (
            <div key={index} className="flex flex-col items-center text-center p-8 border border-dashed border-border/80 rounded-lg bg-surface-muted/30">
              <FileText className="w-10 h-10 text-content-muted mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-content-primary mb-2">{category}</h3>
              <p className="text-sm text-content-secondary">
                Documents will be available here soon.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
