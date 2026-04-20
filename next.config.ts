import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const wpInternal = process.env.WP_INTERNAL_URL || 'http://wordpress';

const wpPaths = [
  'wp-admin',
  'wp-content',
  'wp-includes',
  'wp-json',
];

const wpSingleFiles = [
  'wp-login.php',
  'wp-cron.php',
  'wp-comments-post.php',
  'wp-signup.php',
  'wp-activate.php',
  'wp-trackback.php',
  'xmlrpc.php',
  'wp-sitemap.xml',
  'graphql',
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  async rewrites() {
    return [
      ...wpPaths.flatMap((p) => [
        // Trailing slash on destination avoids Apache's slash-append 301 (which would
        // otherwise leak the internal hostname "wordpress" back to the browser).
        { source: `/${p}`,           destination: `${wpInternal}/${p}/` },
        { source: `/${p}/:path*`,    destination: `${wpInternal}/${p}/:path*` },
      ]),
      ...wpSingleFiles.map((f) => ({
        source: `/${f}`,
        destination: `${wpInternal}/${f}`,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
