import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware({
  ...routing,
  // The bare domain must ALWAYS serve English — never auto-redirect to /vi
  // based on browser Accept-Language or the NEXT_LOCALE cookie.
  localeDetection: false,
});

export const config = {
  // Skip API routes, Next internals, every WordPress path proxied via
  // next.config rewrites, and any file with an extension (wp-login.php,
  // sitemap.xml, images…). Touching wp-admin here would break the WP proxy.
  matcher: [
    '/((?!api|_next|_vercel|wp-admin|wp-content|wp-includes|wp-json|graphql|.*\\..*).*)',
  ],
};
