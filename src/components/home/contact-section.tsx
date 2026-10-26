import { useTranslations } from 'next-intl';
import ContactForm from './contact-form';

const EMAIL = 'email@nexoratechno.com';

export default function ContactSection() {
  const t = useTranslations('home.contact');
  return (
    <section className="contact section-pad" id="contact">
      <div className="section-marker mono">
        <span>08 / YOUR NEXT CHAPTER</span>
        <span>LET&apos;S MAKE SOMETHING THAT MATTERS.</span>
      </div>
      <div className="contact-heading">
        <h2>
          What’s
          <br />
          <em>your next?</em>
        </h2>
        <a className="big-arrow" href={`mailto:${EMAIL}`} aria-label={t('email_label')}>
          ↗
        </a>
      </div>
      <div className="contact-layout">
        <div className="contact-info">
          <p>{t('text')}</p>
          <a className="email-link" href={`mailto:${EMAIL}`}>
            {EMAIL} ↗
          </a>
          <div className="contact-direct">
            <a href="tel:+84969536234">+84 969 536 234 ↗</a>
            <span>{t('hours')}</span>
          </div>
          <address className="address">
            <span className="mono">VISIT US</span>
            <p>
              17/5 Tân Thuận Tây, Khu phố 34
              <br />
              Phường Tân Thuận, TP. Hồ Chí Minh
              <br />
              Vietnam · UTC+7
            </p>
          </address>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
