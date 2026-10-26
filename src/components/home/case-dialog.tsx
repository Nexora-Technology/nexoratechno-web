'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { choreography } from './motion-state';
import type { HomeCase } from './home-data';

interface Props {
  item: HomeCase | null;
  /** The button that opened the dialog; Safari/Firefox don't focus buttons on click. */
  opener: HTMLElement | null;
  onClose: () => void;
}

/** Quick-view modal. Native <dialog> gives Escape and focus containment; focus
 *  returns to the button that opened it. */
export default function CaseDialog({ item, opener, onClose }: Props) {
  const t = useTranslations('home.library');
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el || !item) return;
    el.showModal();
    choreography.lenis?.stop();
    return () => {
      if (el.open) el.close();
      choreography.lenis?.start();
      opener?.focus({ preventScroll: true });
    };
  }, [item, opener]);

  return (
    <dialog
      ref={dialog}
      className="case-dialog"
      data-lenis-prevent
      aria-labelledby="case-dialog-title"
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
    >
      {item && (
        <>
          <div className="case-dialog-top mono">
            <span>{item.industry} / CASE STUDY</span>
            <button type="button" id="case-dialog-close" autoFocus aria-label={t('close')} onClick={() => dialog.current?.close()}>
              ×
            </button>
          </div>
          {item.image && (
            // eslint-disable-next-line @next/next/no-img-element -- CMS image served by WordPress
            <img className="case-dialog-cover" src={item.image} alt={`${item.title} — ${t('cover_alt')}`} width={1600} height={900} decoding="async" referrerPolicy="no-referrer" />
          )}
          <div className="case-dialog-body">
            <h2 id="case-dialog-title">{item.title}</h2>
            <p>{item.summary}</p>
            <div className="archive-tags">
              {item.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {item.figure && (
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element -- CMS image served by WordPress */}
                <img src={item.figure} alt={`${item.title} — ${t('diagram_alt')}`} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
                <figcaption>{t('diagram_caption')}</figcaption>
              </figure>
            )}
            <Link className="text-link" href={`/case-studies/${item.slug}`}>
              {t('read_full')} ↗
            </Link>
            <p className="library-note">{t('dialog_note')}</p>
          </div>
        </>
      )}
    </dialog>
  );
}
