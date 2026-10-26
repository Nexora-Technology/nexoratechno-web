'use client';

import { useMemo, useState } from 'react';
import '@/app/subpages.css';
import CaseCard, { type CaseItem } from './case-card';

const STEP = 9;

export interface ExplorerLabels {
  search: string;
  filter: string;
  all: string;
  count: string; // contains {shown} and {total}
  more: string; // contains {n}
  none: string;
  read: string;
}

interface Props {
  items: (CaseItem & { sector: string })[];
  sectors: { key: string; label: string }[];
  labels: ExplorerLabels;
}

const fill = (tpl: string, vars: Record<string, number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k]));

export default function CaseExplorer({ items, sectors, labels }: Props) {
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('all');
  const [limit, setLimit] = useState(STEP);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (c) =>
        (sector === 'all' || c.sector === sector) &&
        (!q || [c.title, c.summary, c.industry, ...c.tags].join(' ').toLowerCase().includes(q))
    );
  }, [items, query, sector]);

  const shown = matches.slice(0, limit);
  const remaining = matches.length - shown.length;

  return (
    <>
      <div className="sub-tools">
        <label className="sub-search">
          <span className="mono">{labels.search}</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(STEP);
            }}
            autoComplete="off"
          />
        </label>
        <div className="case-filters" role="group" aria-label={labels.filter}>
          {[{ key: 'all', label: labels.all }, ...sectors].map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={sector === s.key}
              onClick={() => {
                setSector(s.key);
                setLimit(STEP);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mono sub-count" role="status">
          {fill(labels.count, { shown: shown.length, total: matches.length })}
        </p>
      </div>
      <div className="archive-grid">
        {shown.map((c) => (
          <CaseCard key={c.slug} item={c} readLabel={labels.read} />
        ))}
        {!shown.length && <p className="archive-empty">{labels.none}</p>}
      </div>
      {remaining > 0 && (
        <div className="sub-more-wrap">
          <button type="button" className="sub-more" onClick={() => setLimit(limit + STEP)}>
            {fill(labels.more, { n: Math.min(STEP, remaining) })} <span aria-hidden="true">↓</span>
          </button>
        </div>
      )}
    </>
  );
}
