import { Button } from '../../buttons/Button';

export function TeamCTA() {
  return (
    <section className="section-padding bg-background border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Join the Mission</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          It takes a dedicated community to create lasting change. Find out how you can support our team's efforts on the ground.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/get-involved" variant="outline" size="lg" className="w-full sm:w-auto">
            Get Involved
          </Button>
          <Button to="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
            Partner With Us
          </Button>
        </div>
      </div>
    </section>
  );
}
