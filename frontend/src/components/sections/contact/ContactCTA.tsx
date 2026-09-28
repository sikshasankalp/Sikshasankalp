import { Button } from '../../buttons/Button';

export function ContactCTA() {
  return (
    <section className="py-16 md:py-24 bg-surface-muted">
      <div className="container-default max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-brand-primary mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl md:text-2xl text-content-secondary leading-relaxed font-light mb-10">
          Discover how our programs are changing lives, or find out how you can contribute to the mission.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button to="/programs" variant="primary" size="lg">
            Explore Our Work
          </Button>
          <Button to="/get-involved" variant="outline" size="lg">
            Get Involved
          </Button>
        </div>
      </div>
    </section>
  );
}
