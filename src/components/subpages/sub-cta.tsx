import { localeHref } from '@/lib/seo';

interface Props {
  locale: string;
  title: string;
  desc: string;
  label: string;
  /** Overrides the default /#contact target (e.g. a mailto: link). */
  href?: string;
}

export default function SubCta({ locale, title, desc, label, href }: Props) {
  return (
    <section className="sub-cta" aria-labelledby="sub-cta-title">
      <div>
        <h2 id="sub-cta-title">{title}</h2>
        <p>{desc}</p>
      </div>
      <a className="sub-cta-btn" href={href ?? localeHref(locale, '/#contact')}>
        {label} <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
