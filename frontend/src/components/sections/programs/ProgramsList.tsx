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
import { useLanguage } from "../../../context/LanguageContext";

export function ProgramsList() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background">
      <div className="container-default">
        {/* Featured Program */}
        <div className="mb-20">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-center bg-brand-primary text-white p-8 md:p-12 lg:p-16 rounded-2xl">
            <div className="flex flex-col">
              <MonitorPlay className="w-10 h-10 mb-6 text-brand-accent" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {t('programs.programsList.text1')}
                                            </h2>
              <p className="text-lg text-white/90 leading-relaxed mb-6">
                {t('programs.programsList.text2')}
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
              <h3 className="text-h4 mb-3">{t('programs.programsList.text3')}</h3>
              <p className="text-body text-content-secondary">
                {t('programs.programsList.text4')}
                                            </p>
            </div>
            <div className="flex flex-col border-t border-border pt-6">
              <GraduationCap className="w-8 h-8 mb-4 text-brand-primary" />
              <h3 className="text-h4 mb-3">{t('programs.programsList.text5')}</h3>
              <p className="text-body text-content-secondary">
                {t('programs.programsList.text6')}
                                            </p>
            </div>
            <div className="flex flex-col border-t border-border pt-6">
              <BookMarked className="w-8 h-8 mb-4 text-brand-primary" />
              <h3 className="text-h4 mb-3">{t('programs.programsList.text7')}</h3>
              <p className="text-body text-content-secondary">
                {t('programs.programsList.text8')}
                                            </p>
            </div>
          </div>

          {/* Support Group - 4 items */}
          <div className="md:col-span-12 border-t border-border/50 pt-16">
            <h3 className="text-2xl font-display font-bold mb-10 text-content-primary">{t('programs.programsList.text9')}</h3>
            <div className="grid sm:grid-cols-2 gap-12 lg:gap-16">
              <div className="flex gap-6">
                <Tent className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <h4 className="text-lg font-bold mb-2 text-content-primary">{t('programs.programsList.text10')}</h4>
                  <p className="text-body text-content-secondary">
                    {t('programs.programsList.text11')}
                                                        </p>
                </div>
              </div>
              <div className="flex gap-6">
                <HeartPulse className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <h4 className="text-lg font-bold mb-2 text-content-primary">{t('programs.programsList.text12')}</h4>
                  <p className="text-body text-content-secondary">
                    {t('programs.programsList.text13')}
                                                        </p>
                </div>
              </div>
              <div className="flex gap-6">
                <Users className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <h4 className="text-lg font-bold mb-2 text-content-primary">{t('programs.programsList.text14')}</h4>
                  <p className="text-body text-content-secondary">
                    {t('programs.programsList.text15')}
                                                        </p>
                </div>
              </div>
              <div className="flex gap-6">
                <TreePine className="w-8 h-8 text-brand-primary shrink-0" />
                <div>
                  <h4 className="text-lg font-bold mb-2 text-content-primary">{t('programs.programsList.text16')}</h4>
                  <p className="text-body text-content-secondary">
                    {t('programs.programsList.text17')}
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
