import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { BlogPost } from '@/lib/static-content';
import SubHero from '@/components/subpages/sub-hero';
import SubMeta from '@/components/subpages/sub-meta';
import SubCta from '@/components/subpages/sub-cta';
import { formatDate, readMinutes } from '@/components/subpages/format';

interface Props { post: BlogPost; locale: string; }

export default async function BlogDetailView({ post, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'sub' });

  return (
    <>
      <SubHero
       
        crumbs={[
          { label: t('home'), href: '/' },
          { label: 'Blog', href: '/blog' },
          ...(post.category ? [{ label: post.category }] : []),
        ]}
        status={post.category || 'BLOG'}
        title={post.title}
        compact
        lead={post.summary}
      >
        <SubMeta
          items={[
            { label: t('published'), value: formatDate(post.date, locale) },
            { label: t('reading'), value: t('min_read', { n: readMinutes(post.wpContent) }) },
            { label: t('author'), value: post.author },
          ]}
        />
      </SubHero>

      <div className="sub-section sub-detail">
        {post.image && (
          <figure className="sub-cover">
            <img
              src={post.image}
              alt=""
              width={1600}
              height={900}
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </figure>
        )}
        <article className="sub-article">
          <div dangerouslySetInnerHTML={{ __html: post.wpContent }} />
          <Link href="/blog" className="text-link sub-back">
            <span aria-hidden="true">←</span> {t('blog_back')}
          </Link>
        </article>
      </div>

      <SubCta locale={locale} title={t('blog_cta_title')} desc={t('blog_cta_desc')} label={t('cta_btn')} />
    </>
  );
}
