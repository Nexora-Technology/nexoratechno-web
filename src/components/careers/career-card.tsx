import { Link } from '@/i18n/routing';
import type { Career } from '@/lib/static-content';

export default function CareerCard({ career, viewLabel }: { career: Career; viewLabel: string }) {
  return (
    <article className="sub-role">
      <p className="mono">{[career.dept, career.level, career.type, career.location].filter(Boolean).join(' · ')}</p>
      <h2>
        <Link href={`/careers/${career.slug}`}>{career.title}</Link>
      </h2>
      {career.summary && <p className="sub-card-summary">{career.summary}</p>}
      <Link
        href={`/careers/${career.slug}`}
       
        className="text-link"
        aria-label={`${viewLabel}: ${career.title}`}
      >
        {viewLabel} <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
