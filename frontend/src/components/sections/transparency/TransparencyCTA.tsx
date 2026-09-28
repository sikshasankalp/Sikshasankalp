import { Button } from '../../buttons/Button';

export function TransparencyCTA() {
  return (
    <section className="section-padding bg-background border-t border-border">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Join Our Cause</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto text-content-secondary">
          Transparency is just the foundation. If you have any questions about our operations or want to support our mission, we would love to hear from you.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/contact" variant="outline" size="lg" className="w-full sm:w-auto">
            Contact Us
          </Button>
          <Button to="/donate" variant="primary" size="lg" className="w-full sm:w-auto">
            Support Our Mission
          </Button>
        </div>
      </div>
    </section>
  );
}
