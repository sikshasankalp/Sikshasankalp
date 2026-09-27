import { Button } from '../../buttons/Button';
import { PlaceholderImage } from '../../common/PlaceholderImage';

export function StoryTeaser() {
  return (
    <section className="py-14 md:py-24 bg-background">
      <div className="container-default">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="order-2 lg:order-1 relative h-[380px] md:h-[480px] w-full rounded-xl overflow-hidden shadow-soft lg:sticky lg:top-32">
            <PlaceholderImage className="w-full h-full" text="Foundation Story Image" />
          </div>
          
          <div className="order-1 lg:order-2 lg:pt-8 lg:pl-4">
            <h2 className="text-h2 mb-5">एक सफर, एक संकल्प</h2>
            
            <div className="space-y-4 text-body-large mb-8 max-w-lg">
              <p>
                मुंबई से दिल्ली तक के सफर में कृष्ण कुमार ने संघर्ष को करीब से देखा। फुटपाथ पर रहने वाले बच्चों के साथ समय बिताते हुए एक सवाल लगातार सामने आया — क्या इन बच्चों को शिक्षा और बेहतर अवसरों से जोड़ा जा सकता है?
              </p>
              <p>
                14 फरवरी के Street Child Drive से शुरू हुआ यह प्रयास धीरे-धीरे बच्चों को पढ़ाने, स्कूलों से जोड़ने और परिवारों के साथ काम करने की दिशा में आगे बढ़ा। इसी संकल्प ने Shiksha Sankalp Foundation की नींव रखी।
              </p>
            </div>
            
            <Button to="/our-story" variant="outline">
              पूरी कहानी पढ़ें
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
