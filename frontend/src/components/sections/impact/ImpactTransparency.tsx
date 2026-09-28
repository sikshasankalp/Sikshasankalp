import { Button } from '../../buttons/Button';

export function ImpactTransparency() {
  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Transparency & Evidence</h2>
        <p className="text-body-large mb-10 leading-relaxed max-w-2xl mx-auto">
          We believe in complete transparency. Our work is documented and shared openly to maintain the trust of our supporters and the communities we serve. Explore our visual evidence, financial transparency, and media coverage to learn more about our ongoing efforts on the ground.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/gallery" variant="outline" size="lg" className="w-full sm:w-auto">
            View Gallery
          </Button>
          <Button to="/media" variant="outline" size="lg" className="w-full sm:w-auto">
            Media Coverage
          </Button>
          <Button to="/transparency" variant="outline" size="lg" className="w-full sm:w-auto">
            Transparency Reports
          </Button>
        </div>
      </div>
    </section>
  );
}
