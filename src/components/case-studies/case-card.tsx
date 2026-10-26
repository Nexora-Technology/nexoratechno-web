import { Link } from '@/i18n/routing';

export interface CaseItem {
  slug: string;
  title: string;
  summary: string;
  industry: string;
  image?: string;
  tags: string[];
}

export default function CaseCard({ item, readLabel }: { item: CaseItem; readLabel: string }) {
  const href = `/case-studies/${item.slug}`;
  return (
    <article className="archive-card">
      <Link href={href} className="sub-card-link">
        <div className="archive-image">
          {item.image && (
            <img
              src={item.image}
              alt=""
              width={1600}
              height={900}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        {item.industry && <span className="mono">{item.industry}</span>}
        <h4>{item.title}</h4>
      </Link>
      {item.summary && <p className="sub-card-summary">{item.summary}</p>}
      {item.tags.length > 0 && (
        <div className="archive-tags">
          {item.tags.slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
      <Link href={href} className="text-link sub-card-more" aria-label={`${readLabel}: ${item.title}`}>
        {readLabel} <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
