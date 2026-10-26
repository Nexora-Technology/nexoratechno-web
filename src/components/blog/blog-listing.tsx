import { getTranslations } from 'next-intl/server';
import { getBlogPosts, orEmpty } from '@/lib/wordpress-content';
import { postsForLocale } from '@/lib/blog-language';
import { textOf } from '@/lib/wordpress';
import SubHero from '@/components/subpages/sub-hero';
import SubCta from '@/components/subpages/sub-cta';
import { formatDate } from '@/components/subpages/format';
import BlogCard, { type BlogItem } from './blog-card';
import BlogFeaturedCard from './blog-featured-card';

export default async function BlogListing({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'sub' });
  const all = await orEmpty(getBlogPosts, 'blog posts');

  const items: BlogItem[] = postsForLocale(all, locale)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p) => ({
      slug: p.slug,
      title: textOf(p.title),
      excerpt: textOf(p.excerpt ?? ''),
      category: p.categories.nodes[0]?.name ?? '',
      date: formatDate(p.date, locale),
      image: p.featuredImage?.node?.sourceUrl,
    }));
  const [featured, ...rest] = items;

  return (
    <>
      <SubHero
       
        crumbs={[{ label: t('home'), href: '/' }, { label: 'Blog' }]}
        status={t('blog_status')}
        title={
          <>
            {t('blog_title_1')}
            <br />
            <em>{t('blog_title_2')}</em>
          </>
        }
        lead={t('blog_lead')}
      />
      <section className="sub-section">
        {featured ? (
          <>
            <BlogFeaturedCard
              post={featured}
              label={t('blog_latest')}
              readLabel={t('blog_read_article')}
             
            />
            {rest.length > 0 && (
              <>
                <div className="section-marker mono sub-marker">
                  <span>{t('blog_all')}</span>
                  <span>{String(rest.length).padStart(2, '0')}</span>
                </div>
                <div className="archive-grid">
                  {rest.map((p) => (
                    <BlogCard key={p.slug} post={p} readLabel={t('blog_read_article')} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <p className="archive-empty">{t('blog_none')}</p>
        )}
      </section>
      <SubCta locale={locale} title={t('blog_cta_title')} desc={t('blog_cta_desc')} label={t('cta_btn')} />
    </>
  );
}
