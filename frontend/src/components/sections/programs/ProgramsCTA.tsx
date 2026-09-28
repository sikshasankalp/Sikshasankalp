import { Button } from '../../buttons/Button';

export function ProgramsCTA() {
  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Be a Part of Their Future</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          Every program we run is fueled by the support of our community. Discover the real impact of these initiatives or find ways to contribute to the mission.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/impact" variant="outline" size="lg" className="w-full sm:w-auto">
            Explore Our Impact
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
