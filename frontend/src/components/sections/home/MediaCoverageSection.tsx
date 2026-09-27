import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';

const mediaLogos = [
  "Aaj Tak",
  "News18",
  "ABP News",
  "India Today"
];

export function MediaCoverageSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container-default text-center">
        <h2 className="text-h2 mb-10">हमारे काम की मीडिया में झलक</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto">
          {mediaLogos.map((logo, index) => (
            <div key={index} className="aspect-video bg-surface-muted rounded-lg border border-border flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-pointer hover:shadow-soft">
              <span className="font-display font-bold text-content-muted text-lg md:text-xl">{logo}</span>
            </div>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
          <div className="h-[220px] rounded-lg overflow-hidden border border-border shadow-soft relative group cursor-pointer">
             <PlaceholderImage className="w-full h-full transition-transform duration-500 group-hover:scale-105" text="Media Screenshot 1" />
          </div>
          <div className="h-[220px] rounded-lg overflow-hidden border border-border shadow-soft relative group cursor-pointer hidden md:block">
             <PlaceholderImage className="w-full h-full transition-transform duration-500 group-hover:scale-105" text="Media Screenshot 2" />
          </div>
        </div>
        
        <Button to="/media" variant="outline">
          सभी मीडिया कवरेज देखें
        </Button>
      </div>
    </section>
  );
}
