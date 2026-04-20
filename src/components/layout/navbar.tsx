'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import Link from 'next/link';

const NAV_ANCHORS = [
  { anchor: '#home',     key: 'nav_home' },
  { anchor: '#services', key: 'nav_services' },
  { anchor: '#models',   key: 'nav_models' },
  { anchor: '#about',    key: 'nav_about' },
];

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIsDark(!isDark);
  }

  function switchLocale(lang: 'vi' | 'en') {
    router.replace(pathname, { locale: lang });
  }

  function handleAnchorNav(e: React.MouseEvent, anchor: string) {
    const isHome = pathname === '/';
    if (!isHome) {
      e.preventDefault();
      router.push('/' + anchor);
    }
    if (mobileOpen) setMobileOpen(false);
  }

  return (
    <header className={`nav-wrap${scrolled ? ' scrolled' : ''}`} role="banner">
      <div className="container">
        <nav className="nav" aria-label="Main navigation">
          {/* Brand */}
          <Link href="/" className="brand" aria-label="Nexora Technology home">
            <img
              src="https://nexoratechno.com/wp-content/uploads/YOUR_LOGO_FILE.png"
              alt="Nexora Technology"
              className="brand-logo"
            />
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links" role="list">
            {NAV_ANCHORS.map(({ anchor, key }) => (
              <li key={key}><a href={anchor} onClick={(e) => handleAnchorNav(e, anchor)}>{t(key)}</a></li>
            ))}
            <li><Link href={`/${locale}/case-studies`}>Case Studies</Link></li>
            <li><Link href={`/${locale}/blog`}>Blog</Link></li>
            <li><Link href={`/${locale}/careers`}>Careers</Link></li>
            <li><a href="#contact" onClick={(e) => handleAnchorNav(e, '#contact')}>{t('nav_contact')}</a></li>
          </ul>

          {/* Actions */}
          <div className="nav-actions">
            {/* Lang toggle */}
            <div className="lang-toggle" role="tablist" aria-label="Language">
              <button
                onClick={() => switchLocale('vi')}
                className={locale === 'vi' ? 'active' : ''}
              >VI</button>
              <button
                onClick={() => switchLocale('en')}
                className={locale === 'en' ? 'active' : ''}
              >EN</button>
            </div>

            {/* Theme toggle */}
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* Desktop CTA */}
            <a href="#contact" className="btn btn-primary desktop-cta">{t('nav_cta')}</a>

            {/* Mobile burger */}
            <button className="icon-btn mobile-burger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="mobile-menu">
            {NAV_ANCHORS.map(({ anchor, key }) => (
              <a key={key} href={anchor} onClick={(e) => handleAnchorNav(e, anchor)}>{t(key)}</a>
            ))}
            <Link href={`/${locale}/case-studies`} onClick={() => setMobileOpen(false)}>Case Studies</Link>
            <Link href={`/${locale}/blog`} onClick={() => setMobileOpen(false)}>Blog</Link>
            <Link href={`/${locale}/careers`} onClick={() => setMobileOpen(false)}>Careers</Link>
            <a href="#contact" onClick={(e) => handleAnchorNav(e, '#contact')}>{t('nav_contact')}</a>
          </div>
        )}
      </div>

      <style>{`
        .nav-wrap {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100; padding: 16px 0;
          transition: background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;
        }
        .nav-wrap.scrolled {
          background: color-mix(in oklab, var(--color-bg) 80%, transparent);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          box-shadow: 0 1px 0 var(--color-line);
        }
        .nav { display: flex; align-items: center; justify-content: space-between; gap: 40px; }
        .brand-logo {
          height: 32px; width: auto; object-fit: contain; flex-shrink: 0;
        }
        .brand {
          display: flex; align-items: center; gap: 10px;
          font-family: var(--font-display); font-weight: 600;
          font-size: 18px; letter-spacing: -0.01em; color: var(--color-ink);
          flex-shrink: 0;
        }
        .nav-links {
          display: flex; gap: 4px; list-style: none; padding: 0; margin: 0; flex: 1; justify-content: center;
        }
        .nav-links a {
          padding: 8px 14px; font-size: 14px; font-weight: 500;
          border-radius: 8px; color: var(--color-ink-soft);
          transition: color 0.2s, background 0.2s; white-space: nowrap;
        }
        .nav-links a:hover { color: var(--color-ink); background: var(--color-bg-soft); }
        .nav-links a.active { color: var(--color-ink); }
        .nav-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .icon-btn {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid var(--color-line);
          display: inline-flex; align-items: center; justify-content: center;
          color: var(--color-ink-soft); transition: background 0.2s, color 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }
        .icon-btn:hover { background: var(--color-bg-soft); color: var(--color-ink); border-color: var(--color-line-strong); }
        .lang-toggle {
          display: inline-flex; border: 1px solid var(--color-line);
          border-radius: 10px; overflow: hidden; height: 38px;
          background: var(--color-bg-elev);
        }
        .lang-toggle button {
          padding: 0 12px; font-size: 12px; font-weight: 600;
          color: var(--color-ink-mute); letter-spacing: 0.04em;
          transition: color 0.2s, background 0.2s; border: none; cursor: pointer;
        }
        .lang-toggle button.active { background: var(--color-ink); color: var(--color-bg); }
        .mobile-burger { display: none; }
        @media (max-width: 900px) {
          .nav-links { display: none; }
          .lang-toggle { display: none; }
          .mobile-burger { display: inline-flex; }
          .desktop-cta { display: none; }
        }
        .mobile-menu {
          display: flex; flex-direction: column; gap: 4px;
          padding: 16px 0; border-top: 1px solid var(--color-line);
          margin-top: 8px;
        }
        .mobile-menu a {
          padding: 10px 16px; font-size: 15px; font-weight: 500;
          color: var(--color-ink-soft); border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .mobile-menu a:hover { color: var(--color-ink); background: var(--color-bg-soft); }
      `}</style>
    </header>
  );
}
