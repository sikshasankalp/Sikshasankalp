import { Button } from '../../buttons/Button';
import { useLanguage } from "../../../context/LanguageContext";

export function StoryClosingCTA() {
  const { t } = useLanguage();
  return (
    <section className="section-padding bg-background">
      <div className="container-default max-w-4xl mx-auto text-center">
        <h2 className="text-h2 mb-6">{t('story.storyClosingCTA.text1')}</h2>
        <p className="text-body-large mb-10 max-w-2xl mx-auto">
          {t('story.storyClosingCTA.text2')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
          <Button to="/programs" variant="interactive">
            {t('story.storyClosingCTA.text3')}
          </Button>
          <Button to="/impact" variant="interactive">
            {t('story.storyClosingCTA.text4')}
          </Button>
          <Button to="/donate" variant="accent" size="lg" arrow className="w-full sm:w-auto min-w-[180px]">
            {t('story.storyClosingCTA.text5')}
          </Button>
        </div>
      </div>
    </section>
  );
}
