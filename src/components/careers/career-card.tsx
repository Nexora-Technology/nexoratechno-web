import Link from 'next/link';
import type { Career } from '@/lib/static-content';

interface Props { career: Career; locale: string; }

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const BriefcaseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7"/>
  </svg>
);

export default function CareerCard({ career, locale }: Props) {
  return (
    <Link href={`/${locale}/careers/${career.slug}`} className="career-card">
      {/* Col 1: info */}
      <div>
        <span className="c-dept">{career.dept}</span>
        <h3 className="text-xl font-display font-semibold tracking-tight text-[var(--color-ink)] mt-2">
          {career.title}
        </h3>
        <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-3 max-w-[58ch]">
          {career.summary}
        </p>
        <div className="tag-row mt-4">
          {career.tags.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
      </div>

      {/* Col 2: meta */}
      <div className="career-meta">
        <div className="career-meta-row"><MapPinIcon />{career.location}</div>
        <div className="career-meta-row"><BriefcaseIcon />{career.type}</div>
        <div className="career-meta-row"><ClockIcon />{career.level}</div>
      </div>

      {/* Col 3: arrow */}
      <div className="career-arrow">
        <ArrowIcon />
      </div>

      <style>{`
        .career-card {
          display: grid;
          grid-template-columns: 1.5fr 1fr auto;
          gap: 24px;
          align-items: center;
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          padding: 26px 28px;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .career-card:hover {
          border-color: var(--color-line-strong);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        @media (max-width: 760px) {
          .career-card { grid-template-columns: 1fr; gap: 14px; }
          .career-card .career-arrow { display: none; }
        }
        .c-dept {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-accent-ink);
        }
        .career-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 13px;
          color: var(--color-ink-soft);
        }
        .career-meta-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .career-arrow {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-line);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--color-ink);
          transition: background 0.2s, transform 0.2s, color 0.2s;
        }
        .career-card:hover .career-arrow {
          background: var(--color-ink);
          color: var(--color-bg);
          transform: translateX(4px);
        }
        .tag-pill {
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 500;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-line);
          border-radius: 9999px;
          color: var(--color-ink-soft);
        }
        .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
      `}</style>
    </Link>
  );
}