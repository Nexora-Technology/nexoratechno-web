'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { localeHref } from '@/lib/seo';

export const LOCALE_SCROLL_KEY = 'nexora-locale-scroll';

export default function SiteHeader() {
  const t = useTranslations('site');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const onHome = pathname === '/';
  // In-page anchors on the home page; full links back to it from sub-pages.
  const anchor = (id: string) => (onHome ? `#${id}` : `${localeHref(locale)}#${id}`);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const switchLanguage = () => {
    // The home page remounts per locale; it restores this position after rebuilding its scenes.
    try {
      if (onHome) sessionStorage.setItem(LOCALE_SCROLL_KEY, String(window.scrollY));
    } catch {
      /* storage blocked: the page opens at the top */
    }
    router.replace(pathname, { locale: locale === 'vi' ? 'en' : 'vi', scroll: false });
  };

  const links = [
    { href: anchor('work'), label: t('nav_work') },
    { href: anchor('expertise'), label: t('nav_expertise') },
    { href: anchor('about'), label: t('nav_about') },
  ];
  const pages = [
    { href: '/blog', label: t('nav_journal') },
    { href: '/careers', label: t('nav_careers') },
  ];

  return (
    <>
      <a className="skip" href="#main">
        {t('skip')}
      </a>
      <header className="header">
        <Link href="/" className="logo" aria-label={t('home_label')}>
          {/* eslint-disable-next-line @next/next/no-img-element -- official PNG, fixed size */}
          <img src="/images/nexora-logo.png" width={500} height={104} alt="Nexora Technology" />
        </Link>
        <nav className="desktop-nav" aria-label={t('nav_main')}>
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          {pages.map((p) => (
            <Link key={p.href} href={p.href} aria-current={pathname.startsWith(p.href) ? 'page' : undefined}>
              {p.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="lang-switch" lang={locale === 'vi' ? 'en' : 'vi'} aria-label={t('lang_label')} onClick={switchLanguage}>
            {t('lang_target')} <span>↗</span>
          </button>
          <a className="contact-link" href={anchor('contact')}>
            <span>{t('talk')}</span>
            <span className="round-arrow" aria-hidden="true">↗</span>
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? t('menu_close') : t('menu_open')}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? '×' : '☰'}
          </button>
        </div>
      </header>
      <nav
        id="mobile-nav"
        className="mobile-nav"
        aria-label={t('nav_mobile')}
        hidden={!open}
        onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}
      >
        {links.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
        {pages.map((p) => (
          <Link key={p.href} href={p.href}>
            {p.label}
          </Link>
        ))}
        <a href={anchor('contact')}>{t('nav_contact')}</a>
      </nav>
    </>
  );
}
