import { PlaceholderImage } from '../../common/PlaceholderImage';

export function PhotoStorySection() {
  return (
    <section className="py-16 md:py-24 bg-surface-muted">
      <div className="container-default">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-h2 mb-3">काम सिर्फ तस्वीरों में नहीं, जमीन पर होता है</h2>
        </div>
        
        {/* Editorial composition: 1 large, 2 small */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 h-auto md:h-[450px] lg:h-[500px]">
          {/* Main Large Image */}
          <div className="md:col-span-8 md:row-span-2 h-[280px] md:h-full relative rounded-xl overflow-hidden group">
            <PlaceholderImage className="w-full h-full" text="Children Learning / Community Work" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5 md:p-6">
              <span className="text-white font-medium text-lg">Footpath Education & Learning</span>
            </div>
          </div>
          
          {/* Small Image 1 */}
          <div className="md:col-span-4 h-[200px] md:h-full relative rounded-xl overflow-hidden group">
            <PlaceholderImage className="w-full h-full" text="School Admission" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 md:p-5">
              <span className="text-white font-medium">School Admission</span>
            </div>
          </div>
          
          {/* Small Image 2 */}
          <div className="md:col-span-4 h-[200px] md:h-full relative rounded-xl overflow-hidden group">
            <PlaceholderImage className="w-full h-full" text="Family Support" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4 md:p-5">
              <span className="text-white font-medium">Family & Essential Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
