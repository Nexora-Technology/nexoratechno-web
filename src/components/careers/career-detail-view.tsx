import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import type { Career } from '@/lib/static-content';
import SubHero from '@/components/subpages/sub-hero';
import SubMeta from '@/components/subpages/sub-meta';
import SubCta from '@/components/subpages/sub-cta';
import { formatDate } from '@/components/subpages/format';

const APPLY_EMAIL = 'careers@nexoratechno.com';

interface Props { career: Career; locale: string; }

export default async function CareerDetailView({ career, locale }: Props) {
  const t = await getTranslations({ locale });
  const s = await getTranslations({ locale, namespace: 'sub' });
  const apply = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`Application: ${career.title}`)}`;

  return (
    <>
      <SubHero
       
        crumbs={[
          { label: s('home'), href: '/' },
          { label: t('career_breadcrumb'), href: '/careers' },
          { label: career.dept || career.title },
        ]}
        status={s('career_status')}
        title={career.title}
        compact
        lead={career.summary}
      >
        <SubMeta
          items={[
            { label: t('career_detail_loc'), value: career.location },
            { label: t('career_detail_type'), value: career.type },
            { label: t('career_detail_level'), value: career.level },
            { label: t('career_detail_salary'), value: career.salary },
            { label: t('career_detail_posted'), value: formatDate(career.date, locale) },
          ]}
        />
      </SubHero>
      <div className="sub-section sub-detail">
        <div className="sub-article">
          <Link href="/careers" className="text-link sub-back">
            <span aria-hidden="true">←</span> {s('career_back')}
          </Link>
        </div>
      </div>
      <SubCta locale={locale}
       
        title={s('career_apply')}
        desc={s('career_cta_desc')}
        label={s('career_cta_btn')}
        href={apply}
      />
    </>
  );
}
