import { Button } from '../../buttons/Button';

export function DonateCTA() {
  return (
    <section className="py-16 md:py-20 bg-surface-muted border-t border-border">
      <div className="container-default text-center max-w-xl mx-auto">
        <h2 className="text-h2 mb-3">एक बच्चे की शिक्षा की यात्रा में आपका सहयोग जुड़ सकता है।</h2>
        <p className="text-body-large mb-8">
          आपका सहयोग Shiksha Sankalp Foundation को शिक्षा, learning resources और जरूरतमंद परिवारों तक सहायता पहुँचाने के प्रयासों को आगे बढ़ाने में मदद कर सकता है।
        </p>
        <Button to="/donate" variant="accent" size="lg" className="w-full sm:w-auto min-w-[200px]">
          Donate Now
        </Button>
      </div>
    </section>
  );
}
