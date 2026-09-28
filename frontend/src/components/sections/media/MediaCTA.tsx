import { Button } from '../../buttons/Button';

export function MediaCTA() {
  return (
    <section className="section-padding bg-surface-muted border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Explore the Realities</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          Beyond external coverage, you can directly explore the verified outcomes of our work and find ways to participate in our mission.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/programs" variant="outline" size="lg" className="w-full sm:w-auto">
            Our Work
          </Button>
          <Button to="/impact" variant="outline" size="lg" className="w-full sm:w-auto">
            View Impact
          </Button>
          <Button to="/donate" variant="primary" size="lg" className="w-full sm:w-auto">
            Support Our Mission
          </Button>
        </div>
      </div>
    </section>
  );
}
