import { getTranslations } from 'next-intl/server';
import { getCaseStudies, orEmpty } from '@/lib/wordpress-content';
import { presentSectors, sectorOf } from '@/lib/case-sectors';
import { textOf } from '@/lib/wordpress';
import SubHero from '@/components/subpages/sub-hero';
import SubCta from '@/components/subpages/sub-cta';
import CaseExplorer from './case-explorer';

export default async function CaseStudiesListing({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'sub' });
  const cases = await orEmpty(getCaseStudies, 'case studies');

  const items = cases.map((c) => {
    const industry = c.caseMeta?.industry ?? '';
    return {
      slug: c.slug,
      title: textOf(c.title),
      summary: textOf(c.excerpt ?? ''),
      industry,
      image: c.featuredImage?.node?.sourceUrl,
      tags: c.categories.nodes.map((n) => n.name),
      sector: sectorOf(industry),
    };
  });
  const sectors = presentSectors(items.map((i) => i.industry), locale);

  return (
    <>
      <SubHero
       
        crumbs={[{ label: t('home'), href: '/' }, { label: 'Case Studies' }]}
        status={t('cs_status')}
        title={
          <>
            {t('cs_title_1')}
            <br />
            <em>{t('cs_title_2')}</em>
          </>
        }
        lead={items.length ? t('cs_lead', { count: items.length }) : undefined}
      />
      <section className="sub-section">
        {items.length ? (
          <CaseExplorer
            items={items}
            sectors={sectors}
            labels={{
              search: t('cs_search'),
              filter: t('cs_filter'),
              all: t('all'),
              count: t.raw('cs_count'),
              more: t.raw('cs_more'),
              none: t('cs_none'),
              read: t('cs_read'),
            }}
          />
        ) : (
          <p className="archive-empty">{t('cs_empty')}</p>
        )}
        {locale === 'vi' && items.length > 0 && <p className="library-note">{t('cs_note')}</p>}
      </section>
      <SubCta locale={locale}
       
        title={t('cta_title')}
        desc={t('cta_desc')}
        label={t('cta_btn')}
      />
    </>
  );
}
