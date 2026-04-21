'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const SERVICE_KEYS = ['web', 'mobile', 'app', 'maintenance', 'iot', 'legacy'];
const SERVICE_NUMS = ['1', '2', '3', '4', '5', '6'];

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

export default function Contact() {
  const t = useTranslations();
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headRef = useRef<HTMLDivElement>(null);
  useReveal(headRef);

  function toggleChip(val: string) {
    setSelected(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company') || undefined,
          budget: data.get('budget') || undefined,
          message: data.get('message'),
          subject: selected.length > 0 ? selected.join(', ') : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || 'Gửi thất bại, vui lòng thử lại.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Không thể kết nối máy chủ, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setSelected([]);
    setError(null);
  }

  return (
    <section className="section" id="contact">
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <span className="eyebrow">{t('contact_eyebrow')}</span>
          <h2 className="section-title">{t('contact_title')}</h2>
          <p className="section-sub">{t('contact_sub')}</p>
        </div>

        <div className="contact-grid">
          {/* Info column */}
          <div className="contact-info">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                labelKey: 'f_addr',
                value: (
                  <>
                    17/5 Tân Thuận Tây, Khu phố 34
                    <br />Phường Tân Thuận, TP. Hồ Chí Minh
                    <br />Việt Nam
                  </>
                ),
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
                  </svg>
                ),
                labelKey: 'f_email_l',
                value: (
                  <a href="mailto:email@nexoratechno.com" style={{ color: 'var(--color-accent)' }}>
                    email@nexoratechno.com
                  </a>
                ),
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                ),
                labelKey: 'f_phone',
                value: <a href="tel:+84969536234" style={{ color: 'inherit' }}>+84 969 536 234</a>,
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                ),
                labelKey: 'f_hours',
                value: t('f_hours_v'),
              },
            ].map(({ icon, labelKey, value }) => (
              <div key={labelKey} className="contact-info-item">
                <div className="contact-info-icon">{icon}</div>
                <div>
                  <div className="contact-info-label">{t(labelKey)}</div>
                  <div className="contact-info-value">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form column */}
          <div>
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <h3>{t('f_success_t')}</h3>
                <p>{t('f_success_d')}</p>
                <button onClick={handleReset} className="btn btn-ghost">
                  {t('f_success_new')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                {/* Name + Email */}
                <div className="field-row">
                  <div className="field">
                    <label>{t('f_name')} <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                    <input name="name" type="text" required autoComplete="name" />
                  </div>
                  <div className="field">
                    <label>{t('f_email')} <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                    <input name="email" type="email" required autoComplete="email" />
                  </div>
                </div>

                {/* Company */}
                <div className="field">
                  <label>{t('f_company')}</label>
                  <input name="company" type="text" autoComplete="organization" />
                </div>

                {/* Service chips */}
                <div className="field">
                  <label>{t('f_service')}</label>
                  <div className="chips">
                    {SERVICE_KEYS.map((svc, i) => {
                      const isActive = selected.includes(svc);
                      return (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => toggleChip(svc)}
                          className={`chip${isActive ? ' active' : ''}`}
                        >
                          {t(`svc${SERVICE_NUMS[i]}_title`)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget */}
                <div className="field">
                  <label>{t('f_budget')}</label>
                  <select name="budget">
                    <option value="">{t('f_budget_4')}</option>
                    <option value="0-10k">{t('f_budget_0')}</option>
                    <option value="10k-50k">{t('f_budget_1')}</option>
                    <option value="50k-200k">{t('f_budget_2')}</option>
                    <option value="200k+">{t('f_budget_3')}</option>
                  </select>
                </div>

                {/* Message */}
                <div className="field">
                  <label>{t('f_message')}</label>
                  <textarea name="message" rows={4} />
                </div>

                {/* Submit */}
                <div className="form-submit">
                  {error && (
                    <span className="form-error">{error}</span>
                  )}
                  {!error && <span className="form-note mono">Secured · TLS 1.3</span>}
                  <button type="submit" disabled={submitting} className="btn btn-accent">
                    {submitting ? t('f_submitting') : t('f_submit')}
                    {!submitting && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 5l7 7-7 7"/>
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1.05fr 1fr;
          gap: 56px;
          margin-top: 48px;
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .contact-info-item {
          display: grid;
          grid-template-columns: 44px 1fr;
          gap: 16px;
          align-items: start;
        }
        .contact-info-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background: var(--color-bg-soft);
          border: 1px solid var(--color-line);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-ink);
          flex-shrink: 0;
        }
        .contact-info-icon svg {
          width: 18px;
          height: 18px;
        }
        .contact-info-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-ink-mute);
        }
        .contact-info-value {
          margin-top: 4px;
          font-size: 15.5px;
          color: var(--color-ink);
          line-height: 1.5;
        }
        .contact-info-value a:hover { text-decoration: underline; text-decoration-color: var(--color-accent); text-underline-offset: 3px; }
        .contact-form {
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          padding: 36px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        @media (max-width: 600px) { .contact-form { padding: 24px; } }
        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
        }
        .field:last-of-type { margin-bottom: 0; }
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 560px) { .field-row { grid-template-columns: 1fr; } }
        .field label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-ink-mute);
          font-weight: 500;
        }
        .field input,
        .field select,
        .field textarea {
          background: var(--color-bg);
          border: 1px solid var(--color-line-strong);
          border-radius: 10px;
          padding: 12px 14px;
          font: inherit;
          font-size: 15px;
          color: var(--color-ink);
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: var(--font-body);
          width: 100%;
        }
        .field textarea { resize: vertical; min-height: 120px; }
        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          outline: none;
          border-color: var(--color-accent);
          box-shadow: 0 0 0 4px color-mix(in oklab, var(--color-accent) 25%, transparent);
        }
        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }
        .chip {
          padding: 8px 14px;
          font-size: 13px;
          border: 1px solid var(--color-line-strong);
          border-radius: 9999px;
          background: var(--color-bg);
          color: var(--color-ink-soft);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          font-weight: 500;
          font-family: inherit;
        }
        .chip:hover { border-color: var(--color-accent); color: var(--color-ink); }
        .chip.active {
          background: var(--color-ink);
          border-color: var(--color-ink);
          color: var(--color-bg);
        }
        .form-submit {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 8px;
        }
        .form-error {
          font-size: 13px;
          color: var(--color-danger);
          max-width: 30ch;
        }
        .form-note {
          font-size: 12px;
          color: var(--color-ink-mute);
          max-width: 26ch;
        }
        .form-success {
          text-align: center;
          padding: 28px 12px;
        }
        .form-success-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: color-mix(in oklab, var(--color-ok) 18%, var(--color-bg-elev));
          border: 1px solid color-mix(in oklab, var(--color-ok) 40%, var(--color-bg-elev));
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-ok);
        }
        .form-success h3 {
          font-size: 24px;
          letter-spacing: -0.02em;
        }
        .form-success h3 {
          margin-top: 20px;
          font-size: 24px;
        }
        .form-success p {
          margin-top: 10px;
          color: var(--color-ink-soft);
          font-size: 15px;
        }
        .form-success button { margin-top: 22px; }
        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s, opacity 0.2s;
          border: 1px solid transparent;
          white-space: nowrap;
          cursor: pointer;
        }
        .btn:disabled { opacity: 0.7; cursor: wait; }
        .btn-primary {
          background: var(--color-ink);
          color: var(--color-bg);
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(10,10,20,0.18);
        }
        .btn-accent {
          background: var(--color-accent);
          color: #1A1508;
          box-shadow: 0 6px 14px rgba(218, 182, 96, 0.35);
        }
        .btn-accent:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 28px rgba(218, 182, 96, 0.5);
        }
        .btn-ghost {
          background: transparent;
          color: var(--color-ink);
          border-color: var(--color-line-strong);
        }
        .btn-ghost:hover { background: var(--color-bg-soft); }
      `}</style>
    </section>
  );
}
