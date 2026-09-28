import { Button } from '../../buttons/Button';

export function InvolvedOtherWays() {
  return (
    <section className="section-padding bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-5xl mx-auto text-center">
        <h2 className="text-h2 mb-10">Other Ways to Support</h2>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-background border border-border rounded-xl p-8 flex flex-col items-center text-center hover:border-brand-primary/40 transition-colors">
            <h3 className="text-xl font-bold text-content-primary mb-3">Partner With Us</h3>
            <p className="text-sm text-content-secondary mb-6 flex-grow">
              Collaborate as an organization, school, or corporate partner to amplify our impact.
            </p>
            <Button to="/partner" variant="outline" size="sm" className="w-full">Explore Partnerships</Button>
          </div>
          
          <div className="bg-background border border-border rounded-xl p-8 flex flex-col items-center text-center hover:border-brand-primary/40 transition-colors">
            <h3 className="text-xl font-bold text-content-primary mb-3">Support Our Mission</h3>
            <p className="text-sm text-content-secondary mb-6 flex-grow">
              Contribute financially to help provide education, health, and dignity directly to children.
            </p>
            <Button to="/donate" variant="primary" size="sm" className="w-full">Donate Now</Button>
          </div>
          
          <div className="bg-background border border-border rounded-xl p-8 flex flex-col items-center text-center hover:border-brand-primary/40 transition-colors">
            <h3 className="text-xl font-bold text-content-primary mb-3">Contact Us</h3>
            <p className="text-sm text-content-secondary mb-6 flex-grow">
              Have a general inquiry or want to learn more about a specific program?
            </p>
            <Button to="/contact" variant="outline" size="sm" className="w-full">Get in Touch</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
