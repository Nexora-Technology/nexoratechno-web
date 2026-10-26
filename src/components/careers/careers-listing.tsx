import { getTranslations } from 'next-intl/server';
import { getCareers, orEmpty } from '@/lib/wordpress-content';
import { textOf } from '@/lib/wordpress';
import type { Career } from '@/lib/static-content';
import SubHero from '@/components/subpages/sub-hero';
import SubCta from '@/components/subpages/sub-cta';
import CareerCard from './career-card';

export const CAREERS_EMAIL = 'email@nexoratechno.com';

export default async function CareersListing({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'sub' });
  const rows = await orEmpty(getCareers, 'careers');

  const careers: Career[] = rows.map((c) => ({
    slug: c.slug,
    title: textOf(c.title),
    dept: c.careerMeta?.department ?? '',
    location: c.careerMeta?.location ?? '',
    type: c.careerMeta?.jobType ?? '',
    level: c.careerMeta?.level ?? '',
    salary: c.careerMeta?.salary ?? '',
    summary: textOf(c.excerpt ?? ''),
    date: c.date,
  }));

  return (
    <>
      <SubHero
       
        crumbs={[{ label: t('home'), href: '/' }, { label: 'Careers' }]}
        status={t('career_status')}
        title={
          <>
            {t('career_title_1')}
            <br />
            <em>{t('career_title_2')}</em>
          </>
        }
        lead={t('career_lead')}
      />
      <section className="sub-section">
        {careers.length ? (
          <div className="sub-roles">
            {careers.map((c) => (
              <CareerCard key={c.slug} career={c} viewLabel={t('career_view')} />
            ))}
          </div>
        ) : (
          <div className="sub-empty">
            <h2>{t('career_empty_title')}</h2>
            <p>
              {t.rich('career_empty_desc', {
                email: () => (
                  <a className="sub-inline-link" href={`mailto:${CAREERS_EMAIL}`}>{CAREERS_EMAIL}</a>
                ),
              })}
            </p>
          </div>
        )}
      </section>
      <SubCta locale={locale}
       
        title={t('career_cta_title')}
        desc={t('career_cta_desc')}
        label={t('career_cta_btn')}
        href={`mailto:${CAREERS_EMAIL}`}
      />
    </>
  );
}
