import { useTranslations } from 'next-intl';
import { rich } from './rich';

const TECH = [
  ['INTERFACE', 'React · Next.js · Vue · TypeScript'],
  ['CORE SYSTEMS', '.NET · Node.js · Go · Python'],
  ['MOBILE', 'React Native · Flutter · Swift · Kotlin'],
  ['AI & DATA', 'PyTorch · ONNX · PostgreSQL · Kafka'],
  ['CLOUD & OPERATIONS', 'AWS · Docker · CI/CD · Observability'],
];

/** Toolkit and "people behind the code" chapters. */
export default function CompanySection() {
  const t = useTranslations('home');
  const values = t.raw('about.values') as string[];
  return (
    <>
      <section className="tech section-pad">
        <div className="section-marker mono">
          <span>06 / THE TOOLKIT</span>
          <span>{t('tech.marker')}</span>
        </div>
        <div className="tech-layout">
          <h2>{t.rich('tech.heading', rich)}</h2>
          <div className="tech-groups">
            {TECH.map(([label, list]) => (
              <div key={label}>
                <span className="mono">{label}</span>
                <p>{list}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="about section-pad" id="about">
        <div className="section-marker mono">
          <span>07 / THE PEOPLE BEHIND THE CODE</span>
          <span>BASED IN VIETNAM. BUILT FOR CONNECTION.</span>
        </div>
        <div className="about-layout">
          <div className="about-art" aria-hidden="true">
            <span className="mono">HO CHI MINH CITY / EST. 2025</span>
            <div className="city-lines">
              {Array.from({ length: 8 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <strong>
              Local roots.
              <br />
              <em>Open horizons.</em>
            </strong>
            <span className="mono">10°45′ N · 106°42′ E</span>
          </div>
          <div className="about-copy">
            <h2>{t.rich('about.heading', rich)}</h2>
            <p>{t('about.text')}</p>
            <div className="values">
              {values.map((value, i) => (
                <div key={value}>
                  <span>0{i + 1}</span>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
