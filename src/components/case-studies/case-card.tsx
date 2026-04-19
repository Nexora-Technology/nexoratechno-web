'use client';

import Link from 'next/link';
import type { CaseStudy } from '@/lib/static-content';

interface Props { item: CaseStudy; locale: string; }

export default function CaseCard({ item, locale }: Props) {
  return (
    <Link
      href={`/${locale}/case-studies/${item.slug}`}
      className="case-card group"
      style={{ '--case-color': item.color } as React.CSSProperties}
    >
      {/* Visual header */}
      <div className="case-visual">
        <div className="case-visual-content">
          <div>
            <p className="case-client">{item.client}</p>
            <p className="case-industry">{item.industry}</p>
          </div>
          <span className="case-year">{item.year}</span>
        </div>
      </div>

      {/* Body */}
      <div className="case-body">
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div className="case-foot">
          <span>{item.services.slice(0, 2).join(' · ')}</span>
          <span>{item.duration}</span>
        </div>
      </div>

      <style>{`
        .case-card {
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .case-card:hover {
          border-color: var(--color-line-strong);
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }
        .case-visual {
          aspect-ratio: 16/9;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 24px;
          color: white;
        }
        .case-visual::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at top right, rgba(255,255,255,0.22), transparent 60%),
            radial-gradient(ellipse at bottom left, rgba(0,0,0,0.25), transparent 60%),
            var(--case-color, #4F46E5);
        }
        .case-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .case-visual-content {
          position: relative;
          z-index: 1;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 12px;
        }
        .case-client {
          font-family: var(--font-display);
          font-size: 26px;
          font-weight: 600;
          letter-spacing: -0.025em;
          line-height: 1.1;
        }
        .case-industry {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.85;
          margin-top: 6px;
        }
        .case-year {
          font-family: var(--font-mono);
          font-size: 12px;
          padding: 4px 10px;
          background: rgba(255,255,255,0.18);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 9999px;
          backdrop-filter: blur(6px);
        }
        .case-body {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }
        .case-body h3 { font-size: 22px; letter-spacing: -0.015em; line-height: 1.25; color: var(--color-ink); }
        .case-body p { font-size: 14.5px; color: var(--color-ink-soft); line-height: 1.55; }
        .case-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--color-line);
          font-size: 13px;
          color: var(--color-ink-soft);
        }
      `}</style>
    </Link>
  );
}
