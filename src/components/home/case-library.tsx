'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { presentSectors } from '@/lib/case-sectors';
import { requestScrollRefresh } from './motion-state';
import CaseDialog from './case-dialog';
import type { HomeCase } from './home-data';

const STEP = 6;

export default function CaseLibrary({ cases }: { cases: HomeCase[] }) {
  const t = useTranslations('home.library');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('all');
  const [visible, setVisible] = useState(STEP);
  const [preview, setPreview] = useState<HomeCase | null>(null);
  const [opener, setOpener] = useState<HTMLElement | null>(null);

  const sectors = useMemo(() => presentSectors(cases.map((c) => c.industry), locale), [cases, locale]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return cases.filter(
      (c) =>
        (sector === 'all' || c.sector === sector) &&
        (!needle || [c.title, c.summary, c.industry, ...c.tags].join(' ').toLocaleLowerCase().includes(needle))
    );
  }, [cases, query, sector]);

  // The library sits above pinned scenes; their start positions move with it.
  useEffect(requestScrollRefresh, [filtered, visible]);

  const reset = () => setVisible(STEP);
  const remaining = filtered.length - visible;

  return (
    <>
    <details className="case-library" id="case-library">
      <summary>
        <div>
          <span className="mono">THE CASE LIBRARY / {cases.length}</span>
          <h3>{t('title')}</h3>
        </div>
        <span className="library-open" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="library-content">
        {cases.length === 0 ? (
          <p className="archive-empty">{t('unavailable')}</p>
        ) : (
          <>
            <div className="library-controls">
              <label className="search-label">
                <span className="mono">{t('search')}</span>
                <input
                  id="case-search"
                  type="search"
                  autoComplete="off"
                  placeholder="Fintech, React, AI…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    reset();
                  }}
                />
              </label>
              <span id="case-results" role="status" className="mono">
                {t('results', { shown: filtered.length, total: cases.length })}
              </span>
            </div>
            <div className="case-filters" role="group" aria-label={t('filter')}>
              {[{ key: 'all', label: t('all') }, ...sectors].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={sector === s.key}
                  onClick={() => {
                    setSector(s.key);
                    reset();
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <div className="archive-grid">
              {filtered.length === 0 && <p className="archive-empty">{t('empty')}</p>}
              {filtered.slice(0, visible).map((c) => (
                <article className="archive-card" key={c.slug}>
                  <Link href={`/case-studies/${c.slug}`}>
                    <div className="archive-image">
                      {c.image && (
                        // eslint-disable-next-line @next/next/no-img-element -- CMS image served by WordPress
                        <img src={c.image} alt={`${c.title} — ${t('cover_alt')}`} width={1600} height={900} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                      )}
                    </div>
                    <span className="mono">{c.industry}</span>
                    <h4>{c.title}</h4>
                  </Link>
                  <div className="archive-tags">
                    {c.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <button type="button" onClick={(e) => {
                      setOpener(e.currentTarget);
                      setPreview(c);
                    }} aria-haspopup="dialog">
                    {t('quick')} ↗
                  </button>
                </article>
              ))}
            </div>
            <div className="library-bottom">
              {remaining > 0 && (
                <button type="button" id="case-more" className="text-link" onClick={() => setVisible(visible + STEP)}>
                  {t('more', { count: Math.min(STEP, remaining) })}
                </button>
              )}
              <Link className="text-link" href="/case-studies">
                <span>{t('all_cases')}</span> ↗
              </Link>
            </div>
            <p className="library-note">{t('note')}</p>
          </>
        )}
      </div>
    </details>
    <CaseDialog item={preview} opener={opener} onClose={() => setPreview(null)} />
    </>
  );
}
