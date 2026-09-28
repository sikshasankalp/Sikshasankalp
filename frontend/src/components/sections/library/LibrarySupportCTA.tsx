import { Button } from '../../buttons/Button';

export function LibrarySupportCTA() {
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Keep the Library Free</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          Providing high-quality educational resources without financial barriers is only possible through collective support. Help us expand this library and further our broader educational mission.
        </p>
        
        <Button to="/donate" variant="primary" size="lg">
          Support Our Mission
        </Button>
      </div>
    </section>
  );
}
