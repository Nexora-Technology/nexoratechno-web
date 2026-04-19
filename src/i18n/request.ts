import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const validLocales = ['vi', 'en'];
  const locale = (requested && validLocales.includes(requested)) ? requested : 'vi';
  return {
    locale,
    timeZone: 'Asia/Ho_Chi_Minh',
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
