import { useTranslations } from 'next-intl';
import { rich } from './rich';

export default function FaqSection() {
  const t = useTranslations('home.faq');
  const items = t.raw('items') as { q: string; a: string }[];
  return (
    <section className="faq section-pad">
      <div className="faq-layout">
        <h2>{t.rich('heading', rich)}</h2>
        <div id="faq-list">
          {items.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span className="plus" aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
