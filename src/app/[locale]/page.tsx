import { setRequestLocale } from 'next-intl/server';
import HomePage from '@/components/home/home-page';
import { getHomeData } from '@/components/home/home-data';

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePage locale={locale} data={await getHomeData(locale)} />;
}
