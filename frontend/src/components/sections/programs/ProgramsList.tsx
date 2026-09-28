import { 
  BookOpen, 
  GraduationCap, 
  BookMarked, 
  MonitorPlay, 
  Tent, 
  HeartPulse, 
  Users, 
  TreePine 
} from 'lucide-react';
import { PlaceholderImage } from '../../common/PlaceholderImage';

export function ProgramsList() {
  return (
    <section className="section-padding bg-background">
      <div className="container-default">
        {/* Featured Program */}
        <div className="mb-20">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center bg-brand-primary text-white p-8 md:p-12 lg:p-16 rounded-2xl">
            <div className="flex flex-col">
              <MonitorPlay className="w-10 h-10 mb-6 text-brand-accent" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Free Digital Shiksha & Library
              </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                A major initiative providing free access to NCERT books, notes, study material, educational videos, PDFs, computer/digital learning resources, and competitive-exam material to bridge the digital divide.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/20">
              <PlaceholderImage className="w-full h-full border-none bg-black/20" text="Digital Shiksha Real Photo" />
            </div>
          </div>
        </div>

        {/* Other Programs - Editorial Layout */}
        <div className="grid md:grid-cols-12 gap-y-16 gap-x-8 lg:gap-x-12">
          {/* Core Education Group - 3 items */}
          <div className="md:col-span-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
            <div className="flex flex-col border-t border-border pt-6">
              <BookOpen className="w-8 h-8 mb-4 text-brand-primary" />
              <h3 className="text-h4 mb-3">Education & Footpath Learning</h3>
              <p className="text-body text-content-secondary">
                Reaching children where they are and creating access to basic learning and education right on the streets.
              </p>
            </div>
            <div className="flex flex-col border-t border-border pt-6">
              <GraduationCap className="w-8 h-8 mb-4 text-brand-primary" />
              <h3 className="text-h4 mb-3">School Admission & Support</h3>
              <p className="text-body text-content-secondary">
                Helping children connect with mainstream schools and supporting their entire transition process.
              </p>
            </div>
            <div className="flex flex-col border-t border-border pt-6">
              <BookMarked className="w-8 h-8 mb-4 text-brand-primary" />
              <h3 className="text-h4 mb-3">Educational Support</h3>
              <p className="text-body text-content-secondary">
                Providing learning materials, study support, guidance, and resources that help children continue learning.
              </p>
            </div>
          </div>

          {/* Support Group - 4 items */}
          <div className="md:col-span-12 border-t border-border/50 pt-16">
            <h3 className="text-2xl font-display font-bold mb-10 text-content-primary">Holistic Support & Wellbeing</h3>
            <div className="grid sm:grid-cols-2 gap-12 lg:gap-16">
              <div className="flex gap-6">
                <Tent className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <h4 className="text-lg font-bold mb-2 text-content-primary">Bath Tent & Dignity Support</h4>
                  <p className="text-body text-content-secondary">
                    Supporting families with portable bath tents and helping improve privacy, hygiene, and dignity.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <HeartPulse className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <h4 className="text-lg font-bold mb-2 text-content-primary">Health & Hygiene</h4>
                  <p className="text-body text-content-secondary">
                    Health awareness, hygiene education, and relevant child/family support for a healthier life.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <Users className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <h4 className="text-lg font-bold mb-2 text-content-primary">Family & Essential Support</h4>
                  <p className="text-body text-content-secondary">
                    Practical support for families when it directly helps children's education, wellbeing, and stability.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <TreePine className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <h4 className="text-lg font-bold mb-2 text-content-primary">Environment & Plantation</h4>
                  <p className="text-body text-content-secondary">
                    Plantation and environmental activities involving children and the community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
