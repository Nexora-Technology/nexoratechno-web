import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Nexora Technology | Software Development Company in Vietnam',
    template: '%s | Nexora Technology',
  },
  description:
    'Nexora Technology — Software company in Ho Chi Minh City specializing in web development, mobile apps, IoT solutions, and legacy system migration.',
  metadataBase: new URL('https://nexoratechno.com'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    siteName: 'Nexora Technology',
    title: 'Nexora Technology | Software Development Company',
    description:
      'Web development, mobile apps, IoT solutions, and legacy system migration from Ho Chi Minh City.',
    url: 'https://nexoratechno.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: 'https://nexoratechno.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}