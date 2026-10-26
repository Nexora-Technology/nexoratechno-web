'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const NAMES = ['Dedicated Team', 'Fixed Price', 'Time & Material'];
// Existing engagement comparison copy (messages m_* / m{1..3}_*_v).
const ROWS = ['cost', 'flex', 'pm', 'pros', 'cons', 'min'];

export default function ModelComparison() {
  const t = useTranslations();
  const [highlight, setHighlight] = useState(-1);
  const cell = (i: number) => (highlight === i ? 'comparison-selected' : undefined);
  return (
    <div className="comparison-wrap section-pad">
      <details className="model-comparison">
        <summary>
          <div>
            <span className="mono">FIND YOUR FIT</span>
            <h3>{t('home.models.compare')}</h3>
          </div>
          <span className="library-open" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="comparison-scroll" tabIndex={0} role="region" aria-label={t('home.models.compare_label')}>
          <table id="model-comparison-table">
            <caption>{t('home.models.compare_caption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('home.models.criterion')}</th>
                {NAMES.map((name, i) => (
                  <th scope="col" key={name} className={cell(i)}>
                    <button type="button" aria-pressed={highlight === i} onClick={() => setHighlight(highlight === i ? -1 : i)}>
                      {name}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row}>
                  <th scope="row">{t(`m_${row}`)}</th>
                  {NAMES.map((name, i) => (
                    <td key={name} className={cell(i)}>
                      {t(`m${i + 1}_${row}_v`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="library-note">{t('home.models.compare_note')}</p>
      </details>
    </div>
  );
}
