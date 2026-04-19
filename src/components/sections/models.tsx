'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const MODELS = [
  {
    id: '1',
    nameKey: 'm1_name',
    tagKey: 'm1_tag',
    descKey: 'm1_desc',
    specs: [
      { labelKey: 'm_desc',  valueKey: 'm1_desc_v' },
      { labelKey: 'm_cost',  valueKey: 'm1_cost_v' },
      { labelKey: 'm_flex',  valueKey: 'm1_flex_v' },
      { labelKey: 'm_pm',    valueKey: 'm1_pm_v' },
      { labelKey: 'm_pros',  valueKey: 'm1_pros_v' },
      { labelKey: 'm_cons',  valueKey: 'm1_cons_v' },
      { labelKey: 'm_fit',   valueKey: 'm1_fit_v' },
      { labelKey: 'm_min',   valueKey: 'm1_min_v' },
    ],
  },
  {
    id: '2',
    nameKey: 'm2_name',
    tagKey: 'm2_tag',
    descKey: 'm2_desc',
    specs: [
      { labelKey: 'm_desc',  valueKey: 'm2_desc_v' },
      { labelKey: 'm_cost',  valueKey: 'm2_cost_v' },
      { labelKey: 'm_flex',  valueKey: 'm2_flex_v' },
      { labelKey: 'm_pm',    valueKey: 'm2_pm_v' },
      { labelKey: 'm_pros',  valueKey: 'm2_pros_v' },
      { labelKey: 'm_cons',  valueKey: 'm2_cons_v' },
      { labelKey: 'm_fit',   valueKey: 'm2_fit_v' },
      { labelKey: 'm_min',   valueKey: 'm2_min_v' },
    ],
  },
  {
    id: '3',
    nameKey: 'm3_name',
    tagKey: 'm3_tag',
    descKey: 'm3_desc',
    specs: [
      { labelKey: 'm_desc',  valueKey: 'm3_desc_v' },
      { labelKey: 'm_cost',  valueKey: 'm3_cost_v' },
      { labelKey: 'm_flex',  valueKey: 'm3_flex_v' },
      { labelKey: 'm_pm',    valueKey: 'm3_pm_v' },
      { labelKey: 'm_pros',  valueKey: 'm3_pros_v' },
      { labelKey: 'm_cons',  valueKey: 'm3_cons_v' },
      { labelKey: 'm_fit',   valueKey: 'm3_fit_v' },
      { labelKey: 'm_min',   valueKey: 'm3_min_v' },
    ],
  },
];

const ROWS = [
  { labelKey: 'm_desc', modelKeys: ['m1_desc_v', 'm2_desc_v', 'm3_desc_v'] },
  { labelKey: 'm_cost',  modelKeys: ['m1_cost_v', 'm2_cost_v', 'm3_cost_v'] },
  { labelKey: 'm_flex',  modelKeys: ['m1_flex_v', 'm2_flex_v', 'm3_flex_v'] },
  { labelKey: 'm_pm',    modelKeys: ['m1_pm_v',   'm2_pm_v',   'm3_pm_v'  ] },
  { labelKey: 'm_pros',  modelKeys: ['m1_pros_v', 'm2_pros_v', 'm3_pros_v'] },
  { labelKey: 'm_cons',  modelKeys: ['m1_cons_v', 'm2_cons_v', 'm3_cons_v'] },
  { labelKey: 'm_fit',   modelKeys: ['m1_fit_v',  'm2_fit_v',  'm3_fit_v' ] },
  { labelKey: 'm_min',   modelKeys: ['m1_min_v',  'm2_min_v',  'm3_min_v' ] },
];

const NUMS = ['01', '02', '03'];

function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in'); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

export default function Models() {
  const t = useTranslations();
  const [active, setActive] = useState('1');
  const [highlightCol, setHighlightCol] = useState<number | null>(null);
  const headRef = useRef<HTMLDivElement>(null);
  useReveal(headRef);

  const current = MODELS.find(m => m.id === active)!;

  return (
    <section className="section" id="models" style={{ background: 'var(--color-bg-soft)', paddingTop: '120px' }}>
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <span className="eyebrow">{t('models_eyebrow')}</span>
          <h2 className="section-title">{t('models_title')}</h2>
          <p className="section-sub">{t('models_sub')}</p>
        </div>

        {/* Tabs + Panel grid */}
        <div className="models-grid" style={{ marginTop: '48px' }}>
          {/* Sidebar tabs */}
          <div className="model-tabs">
            {MODELS.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                className={`model-tab${active === m.id ? ' active' : ''}`}
              >
                <div className="mt-num">{NUMS[idx]}</div>
                <div className="mt-name">{t(m.nameKey)}</div>
                <div className="mt-tag">{t(m.tagKey)}</div>
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="model-panel">
            <h3>
              {t(current.nameKey)}{' '}
              <span style={{ color: 'var(--color-ink-mute)', fontWeight: 500 }} className="mono">
                — {t(current.tagKey)}
              </span>
            </h3>
            <p className="model-panel-desc">{t(current.descKey)}</p>

            <div className="model-specs">
              {current.specs.map(({ labelKey, valueKey }) => (
                <div key={labelKey} className="model-spec">
                  <div className="model-spec-label">{t(labelKey)}</div>
                  <div className="model-spec-value">{t(valueKey)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div style={{ marginTop: '96px' }}>
          <div className="compare-head">
            <div>
              <h3 style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>{t('compare_title')}</h3>
              <p style={{ color: 'var(--color-ink-soft)', fontSize: '15px', marginTop: '8px' }}>
                {t('compare_sub')}
              </p>
            </div>
            <div className="compare-filter">
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-ink-mute)',
                padding: '8px 8px 8px 12px',
              }}>
                {t('compare_highlight')}
              </span>
              <button
                onClick={() => setHighlightCol(null)}
                className={highlightCol === null ? 'active' : ''}
              >
                {t('compare_all')}
              </button>
              {MODELS.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setHighlightCol(i)}
                  className={highlightCol === i ? 'active' : ''}
                >
                  {t(m.nameKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="compare-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th />
                  {MODELS.map((m, i) => (
                    <th
                      key={m.id}
                      className={highlightCol === i ? 'highlighted' : ''}
                      onClick={() => setHighlightCol(highlightCol === i ? null : i)}
                    >
                      {t(m.nameKey)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(row => (
                  <tr key={row.labelKey}>
                    <th className="row-label" scope="row">{t(row.labelKey)}</th>
                    {row.modelKeys.map((vk, i) => (
                      <td
                        key={vk}
                        className={highlightCol === i ? 'col-highlighted' : ''}
                      >
                        {t(vk)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .models-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .models-grid { grid-template-columns: 1fr; gap: 24px; }
        }
        .model-tabs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: sticky;
          top: 100px;
        }
        @media (max-width: 900px) {
          .model-tabs { position: static; flex-direction: row; overflow-x: auto; }
        }
        .model-tab {
          text-align: left;
          padding: 18px 20px;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid transparent;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          min-width: 0;
          cursor: pointer;
        }
        .model-tab .mt-num {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          color: var(--color-ink-mute);
        }
        .model-tab .mt-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.015em;
          margin-top: 6px;
        }
        .model-tab .mt-tag {
          font-size: 12.5px;
          color: var(--color-ink-mute);
          margin-top: 4px;
        }
        .model-tab:hover { background: var(--color-bg-soft); }
        .model-tab.active {
          background: var(--color-bg-elev);
          border-color: var(--color-line-strong);
          box-shadow: var(--shadow-md);
        }
        .model-tab.active .mt-num { color: var(--color-accent-ink); }
        .model-panel {
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          padding: 40px;
          min-height: 560px;
        }
        @media (max-width: 600px) { .model-panel { padding: 28px 22px; } }
        .model-panel h3 { font-size: 32px; letter-spacing: -0.025em; }
        .model-panel-desc {
          margin-top: 14px;
          font-size: 17px;
          color: var(--color-ink-soft);
          max-width: 56ch;
          line-height: 1.55;
        }
        .model-specs {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px 32px;
        }
        @media (max-width: 680px) { .model-specs { grid-template-columns: 1fr; } }
        .model-spec {
          border-top: 1px solid var(--color-line);
          padding-top: 16px;
        }
        .model-spec-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-mute);
        }
        .model-spec-value {
          margin-top: 8px;
          font-size: 15px;
          color: var(--color-ink);
          line-height: 1.5;
        }
        .compare-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .compare-filter {
          display: inline-flex;
          gap: 6px;
          background: var(--color-bg-elev);
          padding: 4px;
          border-radius: 9999px;
          border: 1px solid var(--color-line);
          align-items: center;
        }
        .compare-filter button {
          padding: 8px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-ink-mute);
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
          background: transparent;
          border: none;
        }
        .compare-filter button.active {
          background: var(--color-ink);
          color: var(--color-bg);
        }
        .compare-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          font-size: 14.5px;
        }
        .compare-table th,
        .compare-table td {
          padding: 18px 20px;
          text-align: left;
          vertical-align: top;
          border-bottom: 1px solid var(--color-line);
        }
        .compare-table tr:last-child td,
        .compare-table tr:last-child th { border-bottom: 0; }
        .compare-table thead th {
          background: var(--color-bg-soft);
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
          border-bottom: 1px solid var(--color-line-strong);
          cursor: pointer;
          position: relative;
          user-select: none;
          transition: background 0.2s;
        }
        .compare-table thead th:hover {
          background: color-mix(in oklab, var(--color-accent-soft) 50%, var(--color-bg-soft));
        }
        .compare-table thead th.highlighted {
          background: linear-gradient(180deg, var(--color-accent-soft),
            color-mix(in oklab, var(--color-accent) 28%, var(--color-bg-soft)));
          color: var(--color-ink);
        }
        .compare-table tbody th {
          width: 210px;
          background: var(--color-bg-soft);
          font-weight: 500;
          color: var(--color-ink-soft);
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
        }
        .compare-table tbody th:hover {
          background: color-mix(in oklab, var(--color-accent-soft) 35%, var(--color-bg-soft));
        }
        .compare-table .row-label {
          width: 210px;
          background: var(--color-bg-soft);
          font-weight: 500;
          color: var(--color-ink-soft);
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .compare-table td.col-highlighted {
          background: color-mix(in oklab, var(--color-accent-soft) 22%, var(--color-bg-elev));
        }
        .compare-wrap { overflow-x: auto; }
      `}</style>
    </section>
  );
}
