import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Providers } from '@/components/providers/providers';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
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
  const pathPrefix = isVi ? '' : `/${locale}`;

  return {
    title: isVi ? 'Nexora Technology | Công ty Phát triển Phần mềm' : 'Nexora Technology | Software Development Company',
    description: isVi
      ? 'Công ty phần mềm tại TP.HCM — phát triển web, mobile, IoT và chuyển đổi hệ thống legacy.'
      : 'Software company in Ho Chi Minh City — web development, mobile apps, IoT, and legacy migration.',
    alternates: {
      canonical: `https://nexoratechno.com${pathPrefix}`,
      languages: {
        vi: 'https://nexoratechno.com',
        en: 'https://nexoratechno.com/en',
      },
    },
    openGraph: {
      locale: isVi ? 'vi_VN' : 'en_US',
      url: `https://nexoratechno.com${pathPrefix}`,
      siteName: 'Nexora Technology',
      type: 'website',
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

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
    logo: 'https://nexoratechno.com/logo.png',
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
    sameAs: [],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
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
