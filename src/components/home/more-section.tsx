import { useFormatter, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { HomeData } from './home-data';
import { rich } from './rich';

/** Journal (latest post in this locale) and Careers (live count from the CMS). */
export default function MoreSection({ post, careerCount }: Pick<HomeData, 'post' | 'careerCount'>) {
  const t = useTranslations('home');
  const format = useFormatter();
  return (
    <section className="more section-pad">
      <div className="more-block">
        <span className="mono">INSIDE NEXORA / JOURNAL</span>
        {post ? (
          <Link className="journal-feature" href={`/blog/${post.slug}`}>
            <div className="journal-image">
              {post.image && (
                // eslint-disable-next-line @next/next/no-img-element -- CMS image served by WordPress
                <img src={post.image} alt="" width={1600} height={900} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
              )}
            </div>
            <span className="mono">
              {[post.category, format.dateTime(new Date(post.date), { day: '2-digit', month: 'short', year: 'numeric' })]
                .filter(Boolean)
                .join(' · ')
                .toUpperCase()}
            </span>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <span className="text-link">{t('journal.read')} ↗</span>
          </Link>
        ) : (
          <>
            <h2>{t.rich('journal.heading', rich)}</h2>
            <p>{t('journal.text')}</p>
            <Link className="text-link" href="/blog">
              <span>{t('journal.all')}</span> ↗
            </Link>
          </>
        )}
      </div>
      <div className="more-block">
        <span className="mono">GROW WITH US / CAREERS</span>
        <h2>{t.rich('careers.heading', rich)}</h2>
        <p>{careerCount > 0 ? t('careers.open', { count: careerCount }) : t('careers.none')}</p>
        <Link className="text-link" href="/careers">
          <span>{t('careers.cta')}</span> ↗
        </Link>
      </div>
    </section>
  );
}
