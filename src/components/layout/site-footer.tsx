import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { localeHref } from '@/lib/seo';
import MotionToggle from './motion-toggle';

export default function SiteFooter() {
  const t = useTranslations('site');
  const home = localeHref(useLocale());
  return (
    <footer className="footer">
      <div className="footer-top">
        <Link className="logo" href="/" aria-label={t('home_label')}>
          {/* eslint-disable-next-line @next/next/no-img-element -- official PNG, fixed size */}
          <img src="/images/nexora-logo.png" width={500} height={104} alt="Nexora Technology" loading="lazy" />
        </Link>
        <p>{t.rich('footer_tag', { br: () => <br /> })}</p>
        <div>
          <a href={`${home}#expertise`}>{t('footer_services')}</a>
          <a href={`${home}#models`}>{t('footer_models')}</a>
          <Link href="/case-studies">{t('footer_cases')}</Link>
          <Link href="/blog">{t('footer_blog')}</Link>
          <Link href="/careers">{t('footer_careers')}</Link>
        </div>
        <a className="back-top mono" href="#main">
          {t('back_top')}
        </a>
      </div>
      <div className="footer-word" aria-hidden="true">
        nexora<span>↗</span>
      </div>
      <div className="footer-bottom mono">
        <span>© {new Date().getFullYear()} NEXORA TECHNOLOGY</span>
        <span>{t('footer_line')}</span>
        <MotionToggle />
      </div>
    </footer>
  );
}
