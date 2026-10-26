import { useTranslations } from 'next-intl';
import { rich } from './rich';

interface Step {
  name: string;
  desc: string;
  output: string;
}

/** Six steps; on desktop the track is pinned and scrolled horizontally by home-motion. */
export default function ProcessSection() {
  const t = useTranslations('home.process');
  const steps = t.raw('steps') as Step[];
  return (
    <section className="journey" id="process">
      <div className="journey-sticky">
        <div className="section-marker mono">
          <span>04 / HOW WE BUILD</span>
          <span>{t('marker')}</span>
        </div>
        <div className="journey-heading">
          <h2>{t.rich('heading', rich)}</h2>
          <span className="journey-counter mono" aria-hidden="true">
            01 — 06
          </span>
        </div>
        <ol className="process-track" id="process-track">
          {steps.map((s, i) => (
            <li className="process-step" key={s.name}>
              <span className="step-number" aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
              <span className="step-output mono">{s.output}</span>
            </li>
          ))}
        </ol>
        <div className="process-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
