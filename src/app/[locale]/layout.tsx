import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers/providers';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { buildAlternates, OG_IMAGES, OG_IMAGE } from '@/lib/seo';
import '@/app/globals.css';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';

  const title = isVi
    ? 'Nexora Technology | Công ty Phát triển Phần mềm'
    : 'Nexora Technology | Software Development Company';
  const description = isVi
    ? 'Công ty phần mềm tại TP.HCM — phát triển web, mobile, IoT và chuyển đổi hệ thống legacy.'
    : 'Software company in Ho Chi Minh City — web development, mobile apps, IoT, and legacy migration.';

  return {
    // `absolute` sets the home title verbatim and ignores the root layout's
    // template (the string already contains the brand — avoids duplicating it).
    // `template` is re-declared so child pages (Blog, Careers…) still get the
    // "| Nexora Technology" suffix on their short titles.
    title: { absolute: title, template: '%s | Nexora Technology' },
    description,
    alternates: buildAlternates(locale, ''),
    openGraph: {
      locale: isVi ? 'vi_VN' : 'en_US',
      url: `https://nexoratechno.com/${locale}`,
      siteName: 'Nexora Technology',
      title,
      description,
      type: 'website',
      images: OG_IMAGES,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: OG_IMAGES,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  let messages: Record<string, unknown>;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nexora Technology Co., Ltd.',
    url: 'https://nexoratechno.com',
    logo: OG_IMAGE,
    description: locale === 'vi'
      ? 'Công ty phần mềm tại TP.HCM — phát triển web, mobile, IoT và chuyển đổi hệ thống legacy.'
      : 'Software company in Ho Chi Minh City — web development, mobile apps, IoT, and legacy migration.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'web@nexoratechno.com',
      contactType: 'customer service',
    },
    // TODO: add real social profile URLs (LinkedIn, Facebook, GitHub) to strengthen
    // the entity's knowledge-graph signal once the accounts are live.
    sameAs: [],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Motion gate: hidden initial states in CSS only apply under html.js,
            so content stays visible for crawlers and users without JS.
            next/script beforeInteractive runs before hydration and is injected
            outside React's client render (no "script tag in component" warning). */}
        <Script id="motion-js-gate" strategy="beforeInteractive">
          {"document.documentElement.classList.add('js')"}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers locale={locale} messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
