import { PlaceholderImage } from '../../common/PlaceholderImage';

export function ImpactEducation() {
  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-center">
          <div className="flex flex-col">
            <h2 className="text-h2 mb-6">Education & School Mainstreaming</h2>
            <div className="space-y-6 text-body-large text-content-secondary leading-relaxed">
              <p>
                The foundation’s core mission has always been connecting children with mainstream education. The 42 children we have supported toward school admission represent countless hours of community outreach, family counseling, and foundational learning on the streets.
              </p>
              <p>
                Our approach ensures that these children are not merely enrolled, but are genuinely prepared and continually supported to succeed in a formal classroom environment.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50">
            <PlaceholderImage className="w-full h-full border-none" text="Education Impact Real Photo" />
          </div>
        </div>
      </div>
    </section>
  );
}
