import { Button } from '../../buttons/Button';

export function PartnerCTA() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-default max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-brand-primary mb-6">
          Ready to make an impact together?
        </h2>
        <p className="text-xl md:text-2xl text-content-secondary leading-relaxed font-light mb-10">
          The challenges are immense, but so is the potential for change when we combine our strengths. Let's talk about what we can achieve.
        </p>
        <Button to="#partner-form" variant="primary" size="lg">
          Start a Conversation
        </Button>
      </div>
    </section>
  );
}
