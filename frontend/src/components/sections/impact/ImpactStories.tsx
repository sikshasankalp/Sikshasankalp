import { PlaceholderImage } from '../../common/PlaceholderImage';

export function ImpactStories() {
  return (
    <section className="section-padding bg-surface-muted border-y border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <h2 className="text-h2 mb-12">Real Stories</h2>
        
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16 bg-background rounded-xl border border-border overflow-hidden p-6 md:p-10">
          <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50">
            <PlaceholderImage className="w-full h-full border-none" text="Beneficiary Real Photo" />
          </div>
          
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-sm font-display text-brand-primary uppercase tracking-wider font-bold mb-2">Child / Person Name Placeholder</h3>
              <h4 className="text-2xl font-bold text-content-primary">Story Title Placeholder</h4>
            </div>
            
            <div className="space-y-4 text-body-large text-content-secondary">
              <p><strong>The Situation:</strong> [Placeholder detailing the initial challenges, living conditions, or educational barriers faced by the individual.]</p>
              <p><strong>Support Received:</strong> [Placeholder describing the specific interventions provided by the foundation, such as school admission support or basic needs assistance.]</p>
              <p><strong>The Outcome:</strong> [Placeholder detailing the verifiable result and positive change in the individual's life.]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
