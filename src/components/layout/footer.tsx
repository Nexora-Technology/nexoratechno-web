'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-brand">
            <Link href={`/${locale}`} className="brand" aria-label="Nexora home">
              <img
                src="https://nexoratechno.com/wp-content/uploads/2026/04/logo_nex.png"
                alt="Nexora Technology"
                className="brand-logo"
              />
            </Link>
            <p className="footer-tag">{t('foot_tag')}</p>
            <p className="footer-tag" style={{ marginTop: '18px' }}>
              17/5 Tân Thuận Tây, Phường Tân Thuận<br/>
              TP. Hồ Chí Minh, Việt Nam
            </p>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h5>{t('foot_services')}</h5>
            <ul>
              <li><a href="#services">{t('svc1_title')}</a></li>
              <li><a href="#services">{t('svc2_title')}</a></li>
              <li><a href="#services">{t('svc3_title')}</a></li>
              <li><a href="#services">{t('svc5_title')}</a></li>
              <li><a href="#services">{t('svc6_title')}</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h5>{t('foot_company')}</h5>
            <ul>
              <li><a href="#about">{t('foot_l_about')}</a></li>
              <li><Link href={`/${locale}/careers`}>{t('foot_l_careers')}</Link></li>
              <li><Link href={`/${locale}/blog`}>{t('foot_l_blog')}</Link></li>
              <li><a href="#contact">{t('foot_l_contact')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h5>{t('foot_legal')}</h5>
            <ul>
              <li><a href="#">{t('foot_l_privacy')}</a></li>
              <li><a href="#">{t('foot_l_terms')}</a></li>
              <li><a href="#">{t('foot_l_cookies')}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bot">
          <span>{t('foot_copy')}</span>
          <div className="footer-social">
            {/* LinkedIn */}
            <a href="#" aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* GitHub */}
            <a href="#" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--color-ink);
          color: var(--color-bg);
          padding: 80px 0 40px;
          margin-top: 40px;
        }
        [data-theme="dark"] .footer {
          background: #05050A;
          border-top: 1px solid var(--color-line);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.12);
        }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 520px) { .footer-grid { grid-template-columns: 1fr; gap: 32px; } }
        .footer-brand { color: var(--color-bg); }
        .footer-brand .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .footer-brand .brand-logo {
          height: 32px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
        }
        .footer-tag {
          margin-top: 14px;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          max-width: 34ch;
          line-height: 1.5;
        }
        .footer-col h5 {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          font-weight: 500;
          margin: 0 0 16px;
        }
        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-col a {
          font-size: 14px;
          color: rgba(255,255,255,0.75);
          transition: color 0.2s;
        }
        .footer-col a:hover { color: var(--color-accent); }
        .footer-bot {
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12.5px;
          color: rgba(255,255,255,0.5);
          gap: 16px;
          flex-wrap: wrap;
        }
        .footer-social { display: flex; gap: 10px; }
        .footer-social a {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.75);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .footer-social a:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
        }
      `}</style>
    </footer>
  );
}
