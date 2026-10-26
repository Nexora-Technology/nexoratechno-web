import { useTranslations } from 'next-intl';
import { rich } from './rich';

interface Service {
  name: string;
  desc: string;
  tags: string[];
}

export default function ExpertiseSection() {
  const t = useTranslations('home.expertise');
  const services = t.raw('services') as Service[];
  return (
    <section className="expertise section-pad" id="expertise">
      <div className="section-marker mono">
        <span>03 / OUR EXPERTISE</span>
        <span>{t('marker')}</span>
      </div>
      <div className="expertise-layout">
        <div className="sticky-title">
          <h2>{t.rich('heading', rich)}</h2>
          <p>{t('text')}</p>
          <a className="text-link" href="#contact">
            <span>{t('cta')}</span> ↗
          </a>
          <div className="wire-sphere" aria-hidden="true">
            {Array.from({ length: 6 }, (_, i) => (
              <i key={i} />
            ))}
            <span>n.</span>
          </div>
        </div>
        <div className="service-list" id="services-list">
          {services.map((s, i) => (
            <details key={s.name} open={i === 0}>
              <summary>
                <span className="service-number">0{i + 1}</span>
                <h3>{s.name}</h3>
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="service-body">
                <p>{s.desc}</p>
                <div className="service-tags">
                  {s.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
