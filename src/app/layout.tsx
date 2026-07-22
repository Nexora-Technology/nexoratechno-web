import type { Metadata } from 'next';
import { OG_IMAGES } from '@/lib/seo';

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
    locale: 'en_US',
    alternateLocale: 'vi_VN',
    siteName: 'Nexora Technology',
    title: 'Nexora Technology | Software Development Company',
    description:
      'Web development, mobile apps, IoT solutions, and legacy system migration from Ho Chi Minh City.',
    url: 'https://nexoratechno.com',
    images: OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexora Technology | Software Development Company',
    description:
      'Web development, mobile apps, IoT solutions, and legacy system migration from Ho Chi Minh City.',
    images: OG_IMAGES,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}