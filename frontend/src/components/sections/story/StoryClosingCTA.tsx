import { Button } from '../../buttons/Button';

export function StoryClosingCTA() {
  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">Support the Journey</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          The story of Shiksha Sankalp Foundation is written by the community. Invite yourself into the next chapter by exploring our impact or contributing to the mission.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/programs" variant="outline" size="lg" className="w-full sm:w-auto">
            Explore Programs
          </Button>
          <Button to="/impact" variant="outline" size="lg" className="w-full sm:w-auto">
            See Our Impact
          </Button>
          <Button to="/donate" variant="primary" size="lg" className="w-full sm:w-auto">
            Support the Mission
          </Button>
        </div>
      </div>
    </section>
  );
}
