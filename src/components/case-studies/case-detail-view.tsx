import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { CaseStudy } from '@/lib/static-content';
import SubHero from '@/components/subpages/sub-hero';
import SubMeta from '@/components/subpages/sub-meta';
import SubCta from '@/components/subpages/sub-cta';

interface Props { item: CaseStudy; locale: string; }

export default async function CaseDetailView({ item, locale }: Props) {
  const t = await getTranslations({ locale });
  const s = await getTranslations({ locale, namespace: 'sub' });

  return (
    <>
      <SubHero
       
        crumbs={[
          { label: s('home'), href: '/' },
          { label: t('cs_breadcrumb'), href: '/case-studies' },
          { label: item.client || item.industry || s('cs_status_detail') },
        ]}
        status={s('cs_status_detail')}
        title={item.title}
        compact
        lead={item.summary}
      >
        <SubMeta
          items={[
            { label: t('cs_detail_client'), value: item.client },
            { label: t('cs_detail_industry'), value: item.industry },
            { label: s('year'), value: item.year || undefined },
            { label: t('cs_detail_duration'), value: item.duration },
            { label: t('cs_detail_team'), value: item.team },
          ]}
        />
      </SubHero>

      <div className="sub-section sub-detail">
        {item.image && (
          <figure className="sub-cover">
            <img
              src={item.image}
              alt=""
              width={1600}
              height={900}
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </figure>
        )}

        {item.metrics.length > 0 && (
          <section className="sub-metrics" aria-label={t('sub_results')}>
            {item.metrics.map((m, i) => (
              <div key={i}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </section>
        )}

        <article className="sub-article">
          {item.body.map((block, i) => (
            <section key={i}>
              <h2>{block.h}</h2>
              {block.p && <p>{block.p}</p>}
              {block.list && (
                <ul>{block.list.map((x, j) => <li key={j}>{x}</li>)}</ul>
              )}
              {block.figures?.map((f, j) => (
                <figure key={j}>
                  <img
                    src={f.src}
                    alt={f.alt}
                    width={1600}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  {f.caption && <figcaption>{f.caption}</figcaption>}
                </figure>
              ))}
            </section>
          ))}
          {item.services.length > 0 && (
            <div className="sub-article-tags">
              <p className="mono">{s('cs_services')}</p>
              <div className="archive-tags">
                {item.services.map((x) => <span key={x}>{x}</span>)}
              </div>
            </div>
          )}
          <Link href="/case-studies" className="text-link sub-back">
            <span aria-hidden="true">←</span> {s('cs_back')}
          </Link>
        </article>
      </div>

      <SubCta locale={locale}
       
        title={s('cta_title')}
        desc={s('cta_desc')}
        label={s('cta_btn')}
      />
    </>
  );
}
