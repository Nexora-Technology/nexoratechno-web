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

// Case study slugs renamed in WordPress; old URLs stay indexed and shared.
const renamedCaseStudySlugs: Record<string, string> = {
  'game-development-partner-capability-profile': 'game-co-development-and-technical-screening',
  'hotel-pms-on-erpnext-capability-map': 'hotel-pms-on-erpnext',
  'student-conference-website-redesign-proposal': 'student-conference-website-redesign',
  'on-demand-delivery-platform-live-prototype': 'on-demand-delivery-platform',
  'premium-membership-card-app-mvp-design': 'premium-membership-card-app',
  'health-membership-platform-prototype': 'health-membership-platform',
  'powerbuilder-erp-modernization-discovery': 'powerbuilder-erp-modernization',
  'heattrace-wms-foundry-traceability-prototype': 'heattrace-wms-foundry-traceability',
  'tea-farm-management-module-design': 'tea-farm-management-module',
  'odoo-erp-dms-distributor-solution-design': 'odoo-erp-dms-distributor',
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  async redirects() {
    return Object.entries(renamedCaseStudySlugs).flatMap(([from, to]) =>
      ['', '/vi'].map((prefix) => ({
        source: `${prefix}/case-studies/${from}`,
        destination: `${prefix}/case-studies/${to}`,
        statusCode: 301 as const,
      })),
    );
  },

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
