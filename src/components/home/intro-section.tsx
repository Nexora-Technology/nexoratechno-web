import { useTranslations } from 'next-intl';
import { RevealWords } from './rich';

export default function IntroSection() {
  const t = useTranslations('home.intro');
  const [first, second, accent] = t.raw('statement') as string[];
  return (
    <section className="intro section-pad" id="intro">
      <div className="section-marker mono">
        <span>01 / THE MINDSET</span>
        <span>{t('marker')}</span>
      </div>
      <div className="intro-layout">
        <span className="asterisk" aria-hidden="true">
          ✳
        </span>
        <div>
          <h2 className="statement">
            <RevealWords text={first} />
            <br />
            <RevealWords text={second} />
            <br />
            <span>
              <RevealWords text={accent} />
            </span>
          </h2>
          <div className="intro-copy">
            <p>{t('p1')}</p>
            <p>{t('p2')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
