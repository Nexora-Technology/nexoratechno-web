'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  categories: string[];
  onFilterChange: (cat: string) => void;
}

export default function BlogFilter({ categories, onFilterChange }: Props) {
  const t = useTranslations();
  const [active, setActive] = useState('all');

  const handleClick = (cat: string) => {
    setActive(cat);
    onFilterChange(cat);
  };

  return (
    <div className="listing-filters">
      {['all', ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={active === cat ? 'active' : ''}
        >
          {cat === 'all' ? t('sub_all') : cat}
        </button>
      ))}
      <style>{`
        .listing-filters {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 40px;
          padding: 6px;
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: 9999px;
          width: fit-content;
          max-width: 100%;
          overflow-x: auto;
        }
        .listing-filters button {
          padding: 9px 16px; font-size: 13px; font-weight: 500;
          border-radius: 9999px; color: var(--color-ink-soft);
          transition: background .2s, color .2s; white-space: nowrap;
          background: transparent; border: none; cursor: pointer;
        }
        .listing-filters button:hover { color: var(--color-ink); }
        .listing-filters button.active {
          background: var(--color-ink); color: var(--color-bg);
        }
      `}</style>
    </div>
  );
}
