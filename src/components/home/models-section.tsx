import { useTranslations } from 'next-intl';
import { rich } from './rich';
import ModelComparison from './model-comparison';

interface Model {
  name: string;
  tag: string;
  desc: string;
  fit: string;
  cost: string;
  manage: string;
}

export default function ModelsSection() {
  const t = useTranslations('home.models');
  const models = t.raw('items') as Model[];
  return (
    <>
      <section className="models section-pad" id="models">
        <div className="section-marker mono">
          <span>05 / WAYS TO WORK TOGETHER</span>
          <span>{t('marker')}</span>
        </div>
        <div className="section-heading">
          <h2>{t.rich('heading', rich)}</h2>
          <p>{t('text')}</p>
        </div>
        <div className="model-grid">
          {models.map((m, i) => (
            <article className="model" key={m.name}>
              <span className="mono">
                0{i + 1} / {m.tag}
              </span>
              <div className="model-symbol" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <h3>{m.name}</h3>
              <p>{m.desc}</p>
              <dl>
                <dt>{t('fit')}</dt>
                <dd>{m.fit}</dd>
                <dt>{t('billing')}</dt>
                <dd>{m.cost}</dd>
                <dt>{t('manage')}</dt>
                <dd>{m.manage}</dd>
              </dl>
              <a className="text-link" href="#contact">
                {t('cta')} ↗
              </a>
            </article>
          ))}
        </div>
      </section>
      <ModelComparison />
    </>
  );
}
