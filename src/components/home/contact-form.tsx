'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { BUDGETS, SERVICES } from '@/lib/contact';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Field = 'name' | 'email' | 'message';

export default function ContactForm() {
  const t = useTranslations('home.contact');
  const budgets = t.raw('budgets') as string[];
  const form = useRef<HTMLFormElement>(null);
  const [services, setServices] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [invalid, setInvalid] = useState<Field | null>(null);

  const toggleService = (service: string) =>
    setServices((list) => (list.includes(service) ? list.filter((s) => s !== service) : [...list, service]));

  // Mirrors the server rules in src/lib/contact.ts so mistakes show before a round trip.
  const firstInvalid = (data: FormData): Field | null => {
    if (!String(data.get('name')).trim()) return 'name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email')).trim())) return 'email';
    if (String(data.get('message')).trim().length < 10) return 'message';
    return null;
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    const data = new FormData(e.currentTarget);
    const field = firstInvalid(data);
    setInvalid(field);
    if (field) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(data), services }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      form.current?.reset();
      setServices([]);
    } catch {
      setStatus('error');
    }
  }

  const message =
    invalid ? t(`invalid_${invalid}`) : status === 'success' ? t('success') : status === 'error' ? t('error') : '';

  return (
    <form id="contact-form" ref={form} onSubmit={submit} noValidate aria-labelledby="contact-form-title" aria-describedby="contact-form-note">
      <h3 className="form-title" id="contact-form-title">
        {t('form_title')}
      </h3>
      <span className="mono" id="contact-need">
        {t('need')}
      </span>
      <div className="service-chips" role="group" aria-labelledby="contact-need">
        {SERVICES.map((service) => (
          <button key={service} type="button" aria-pressed={services.includes(service)} onClick={() => toggleService(service)}>
            {service === 'Other' ? t('other') : service}
          </button>
        ))}
      </div>
      <div className="form-row">
        <label>
          <span>{t('name')}</span>
          <input name="name" autoComplete="name" placeholder={t('ph_name')} required maxLength={120} aria-invalid={invalid === 'name'} />
        </label>
        <label>
          <span>{t('email')}</span>
          <input name="email" type="email" autoComplete="email" placeholder={t('ph_email')} required maxLength={200} aria-invalid={invalid === 'email'} />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>{t('company')}</span>
          <input name="company" autoComplete="organization" placeholder={t('ph_company')} maxLength={160} />
        </label>
        <label>
          <span>{t('budget')}</span>
          <select name="budget" id="contact-budget" defaultValue="unsure">
            {BUDGETS.map((value, i) => (
              <option key={value} value={value}>
                {budgets[i]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        <span>{t('message')}</span>
        <textarea name="message" rows={4} placeholder={t('ph_message')} required maxLength={5000} aria-invalid={invalid === 'message'} />
      </label>
      <input className="contact-trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-bottom">
        <span className="form-note" id="contact-form-note">{t('note')}</span>
        <button className="submit-button" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          <span>{status === 'sending' ? t('sending') : t('submit')}</span> ↗
        </button>
      </div>
      <p id="form-status" role="status" data-state={invalid ? 'error' : status}>
        {message}
      </p>
    </form>
  );
}
