import { Button } from '../../buttons/Button';

export function ClosingCTA() {
  return (
    <section className="section-padding bg-background border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Join Us in Making a Difference</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          Together, we can create a world where every child has the opportunity to learn, grow, and build a life of dignity.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/programs" variant="outline" size="lg" className="w-full sm:w-auto">
            Explore Our Programs
          </Button>
          <Button to="/donate" variant="primary" size="lg" className="w-full sm:w-auto">
            Support Our Mission
          </Button>
        </div>
        <div className="mt-8">
          <Button to="/impact" variant="ghost" className="text-content-secondary hover:text-brand-primary">
            Learn About Our Work &rarr;
          </Button>
        </div>
      </div>
    </section>
  );
}
