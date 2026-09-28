import { PlaceholderImage } from '../../common/PlaceholderImage';

export function StoryTimeline() {
  const steps = [
    {
      title: "The Beginning",
      content: "Krishna Kumar’s journey from Mumbai to Delhi laid the groundwork for his connection with social work and education. These experiences shaped his understanding of the stark realities faced by many communities.",
    },
    {
      title: "Seeing the Children",
      content: "Walking through the city, he began noticing children living and attempting to study on the streets and footpaths. It became impossible to ignore the immense gap between these children and formal education.",
    },
    {
      title: "Taking the First Step",
      content: "Realizing that observation was not enough, he made the decision to start teaching children directly. By working with them on the ground, the early seeds of a structured educational initiative were planted.",
    },
    {
      title: "14 February — Street Child Drive",
      content: "An important milestone in the journey. The Street Child Drive focused on reaching children directly where they lived, connecting with them, and bridging the divide between their daily struggles and the promise of education.",
    },
    {
      title: "From the Streets to School",
      content: "The mission evolved from informal teaching to helping children move toward formal schooling. This involved navigating school admissions, providing continued educational support, and ensuring children felt confident in a classroom setting.",
    },
    {
      title: "From an Initiative to a Foundation",
      content: "What started as an individual effort to teach children on the streets eventually grew. The collective efforts, support, and growing impact led to the formal establishment of Shiksha Sankalp Foundation.",
    }
  ];

  return (
    <section className="section-padding bg-background relative">
      <div className="container-default max-w-5xl mx-auto">
        <div className="space-y-20 md:space-y-32">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="grid md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-center">
                <div className={`flex flex-col ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                  <span className="text-sm font-display text-brand-primary/60 tracking-wider font-bold mb-3 uppercase">
                    Chapter 0{index + 1}
                  </span>
                  <h2 className="text-h2 mb-4">{step.title}</h2>
                  <p className="text-body-large text-content-secondary leading-relaxed">
                    {step.content}
                  </p>
                </div>
                <div className={`relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                  <PlaceholderImage className="w-full h-full border-none" text="Story Event Real Photo" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
