import { useTranslations } from 'next-intl';
import type { HomeData } from './home-data';
import HeroSection from './hero-section';
import IntroSection from './intro-section';
import ConnectionSection from './connection-section';
import WorkSection from './work-section';
import ExpertiseSection from './expertise-section';
import ProcessSection from './process-section';
import ModelsSection from './models-section';
import CompanySection from './company-section';
import MoreSection from './more-section';
import FaqSection from './faq-section';
import ContactSection from './contact-section';
import HomeMotion from './home-motion';
import './home-base.css';
import './home-palette.css';
import './home-motion.css';
import './home-production.css';
import './home-react.css';

const ROOT_ID = 'home-root';

export default function HomePage({ locale, data }: { locale: string; data: HomeData }) {
  const t = useTranslations('home.work');
  return (
    // Keyed by locale: switching language remounts the page so every scene is rebuilt for the new copy.
    <div id={ROOT_ID} className="home" key={locale}>
      <div className="reading-progress" aria-hidden="true" />
      <HeroSection />
      <IntroSection />
      <ConnectionSection />
      <WorkSection data={data} />
      <ExpertiseSection />
      <ProcessSection />
      <ModelsSection />
      <CompanySection />
      <MoreSection post={data.post} careerCount={data.careerCount} />
      <FaqSection />
      <ContactSection />
      <div className="case-cursor mono" aria-hidden="true">
        {t('cursor')}
      </div>
      <HomeMotion rootId={ROOT_ID} />
    </div>
  );
}
