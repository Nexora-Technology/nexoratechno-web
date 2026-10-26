import type { ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import '@/app/subpages.css';

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
  status: string;
  title: ReactNode;
  /** Long titles (detail pages) use the smaller type scale. */
  compact?: boolean;
  lead?: string;
  children?: ReactNode;
}

export default function SubHero({ crumbs, status, title, compact, lead, children }: Props) {
  return (
    <section className="sub-hero">
      <div className="sub-hero-top mono">
        <nav className="sub-crumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((c, i) => (
              <li key={i} {...(!c.href && { 'aria-current': 'page' as const })}>
                {c.href ? (
                  <Link href={c.href}>
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <span className="sub-status">
          <i className="sub-dot" aria-hidden="true" />
          {status}
        </span>
      </div>
      <h1 className={compact ? 'sub-title is-compact' : 'sub-title'}>{title}</h1>
      {lead && <p className="sub-lead">{lead}</p>}
      {children}
    </section>
  );
}
