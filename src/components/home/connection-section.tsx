import { useTranslations } from 'next-intl';
import { rich } from './rich';

/** "Think. Connect. Build." chapter; the 12-piece sculpture is moved into `.stage-canvas` while active. */
export default function ConnectionSection() {
  const t = useTranslations('home.stage');
  return (
    <section className="connection" id="connection" aria-label={t('label')}>
      <div className="connection-stage">
        <div className="stage-grid" aria-hidden="true" />
        <div className="stage-halo" aria-hidden="true" />
        <div className="stage-header mono">
          <span>THE NEXORA PRINCIPLE</span>
          <span>{t('cue')}</span>
        </div>
        <div className="stage-copy">
          <span className="stage-kicker mono">{t('kicker')}</span>
          <h2>
            <span className="stage-line">Think.</span>
            <span className="stage-line">Connect.</span>
            <span className="stage-line">Build.</span>
          </h2>
          <p>{t.rich('sub', rich)}</p>
        </div>
        <div className="stage-visual">
          <div className="stage-fallback" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="stage-canvas" data-scene-slot="stage" />
        </div>
        <span className="stage-watermark" aria-hidden="true">
          CONNECTED.
        </span>
        <div className="stage-footer mono" aria-hidden="true">
          <span className="stage-phase">01 / THINK</span>
          <div className="stage-meter">
            <span />
          </div>
          <span className="stage-percent">000%</span>
        </div>
      </div>
    </section>
  );
}
