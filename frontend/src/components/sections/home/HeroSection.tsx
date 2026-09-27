import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';

export function HeroSection() {
  return (
    <section className="relative pt-6 pb-12 md:pt-[32px] md:pb-[72px] overflow-hidden">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[1.1fr_1fr] lg:gap-12 xl:gap-[80px] items-start pt-2 lg:pt-4">
          <div className="flex flex-col max-w-[580px] lg:ml-6 xl:ml-10">
            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] xl:text-[48px] leading-[1.15] lg:leading-[1.12] font-semibold tracking-tight text-content-primary mb-[16px] lg:mb-[20px]">
              हर बच्चे को शिक्षा, सम्मान और बेहतर भविष्य का अधिकार
            </h1>
            <p className="text-[18px] lg:text-[20px] leading-[1.45] font-medium text-content-secondary mb-[24px] lg:mb-[32px]">
              वंचित बच्चों को फुटपाथ की दुनिया से निकालकर स्कूल की दुनिया तक पहुँचाना।
            </p>
            <p className="text-[16px] lg:text-[17px] leading-[1.618] text-content-primary/80 mb-[32px] lg:mb-[48px]">
              Shiksha Sankalp Foundation वंचित और जरूरतमंद बच्चों को शिक्षा, मुख्यधारा के स्कूलों और बेहतर अवसरों से जोड़ने के लिए जमीनी स्तर पर काम करता है। हमारा प्रयास केवल शिक्षा तक सीमित नहीं है, बल्कि बच्चों और परिवारों को सम्मान, आत्मविश्वास और बेहतर भविष्य की दिशा में आगे बढ़ाना है।
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <Button to="/our-story" variant="primary" size="lg">
                हमारी कहानी
              </Button>
              <Button to="/programs" variant="outline" size="lg">
                हमारा काम देखें
              </Button>
            </div>
            
            <div className="mt-8 md:mt-10 pt-5 border-t border-border">
              <Button to="/digital-library" variant="ghost" className="text-[15px] font-medium px-0 hover:bg-transparent hover:text-brand-primary">
                Free Digital Shiksha & Library &rarr;
              </Button>
            </div>
          </div>
          
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50">
            <PlaceholderImage className="w-full h-full border-none" text="Hero Image" />
          </div>
        </div>
      </div>
    </section>
  );
}
