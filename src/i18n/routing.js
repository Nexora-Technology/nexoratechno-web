// @ts-nocheck
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const locales = ['vi', 'en'];
export const defaultLocale = 'vi';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

const nav = createNavigation(routing);
export const Link = nav.Link;
export const redirect = nav.redirect;
export const usePathname = nav.usePathname;
export const useRouter = nav.useRouter;
export const getPathname = nav.getPathname;
