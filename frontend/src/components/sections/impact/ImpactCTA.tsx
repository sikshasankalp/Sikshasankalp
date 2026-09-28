import { Button } from '../../buttons/Button';

export function ImpactCTA() {
  return (
    <section className="section-padding bg-surface-muted border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Continue the Journey</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          Every number and every story is made possible by collective effort. Discover how you can contribute to the next chapter of our impact.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/programs" variant="outline" size="lg" className="w-full sm:w-auto">
            Explore Programs
          </Button>
          <Button to="/get-involved" variant="outline" size="lg" className="w-full sm:w-auto">
            Get Involved
          </Button>
          <Button to="/donate" variant="primary" size="lg" className="w-full sm:w-auto">
            Support Our Mission
          </Button>
        </div>
      </div>
    </section>
  );
}
