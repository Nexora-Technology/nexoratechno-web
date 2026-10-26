import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FEATURED_SLUGS, type HomeData } from './home-data';
import { PROJECT_ART, PROJECT_META } from './project-art';
import ProjectCover from './project-cover';
import CaseLibrary from './case-library';
import { rich } from './rich';

interface FeaturedCopy {
  title: string;
  text: string;
  art: string;
}

export default function WorkSection({ data }: { data: HomeData }) {
  const t = useTranslations('home.work');
  const copy = t.raw('featured') as FeaturedCopy[];
  const count = data.library.length;
  return (
    <section className="work section-pad" id="work">
      <div className="section-marker mono">
        <span>02 / SELECTED WORK</span>
        <span>REAL CHALLENGES. WORKING SOFTWARE.</span>
      </div>
      <div className="section-heading">
        <h2>{t.rich('heading', rich)}</h2>
        {count > 0 && (
          <Link className="text-link" href="/case-studies">
            <span>{t('count', { count })}</span> ↗
          </Link>
        )}
      </div>
      <div className="work-scroll-label mono" aria-hidden="true">
        <span>{t('scroll')}</span>
        <span className="work-counter">01 / 04</span>
      </div>
      <div className="project-grid">
        {FEATURED_SLUGS.map((slug, i) => {
          const item = data.featured[i];
          const art = PROJECT_ART[i];
          return (
            <Link key={slug} className={`project ${PROJECT_META[i].layout}`} href={`/case-studies/${slug}`}>
              <ProjectCover
                className={art.className}
                image={item?.image}
                alt={item?.imageAlt || item?.title || ''}
                coverLabel={t('cover')}
                artLabel={copy[i].art}
              >
                <div className="art-top mono">
                  <span>{art.label}</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <div className="art-body" aria-hidden="true">
                  {art.art}
                </div>
              </ProjectCover>
              <div className="project-caption">
                <div>
                  <span className="mono">{PROJECT_META[i].tag}</span>
                  <h3>{t.rich(`featured.${i}.title`, rich)}</h3>
                  {copy[i].text && <p>{copy[i].text}</p>}
                </div>
                <span className="project-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="work-note mono">{t('note')}</div>
      <CaseLibrary cases={data.library} />
    </section>
  );
}
