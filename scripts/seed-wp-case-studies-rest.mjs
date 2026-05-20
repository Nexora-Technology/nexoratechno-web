#!/usr/bin/env node
/**
 * Seed Case Studies into WordPress via REST API.
 * Idempotent: existing posts with the same slug are updated, not duplicated.
 *
 * Embeds `caseMeta` + `services` + `metrics` as a JSON comment block inside the
 * post content. The Next.js /api/wordpress/case-studies route extracts it —
 * no ACF / WPGraphQL-for-ACF plugin required.
 *
 * Usage:
 *   WP_BASE_URL="https://nexoratechno.com" \
 *   WP_USER="admin" \
 *   WP_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx" \
 *   node scripts/seed-wp-case-studies-rest.mjs
 */

const WP_BASE_URL = process.env.WP_BASE_URL || 'https://nexoratechno.com';
const WP_USER = process.env.WP_USER;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

if (!WP_USER || !WP_APP_PASSWORD) {
  console.error('✗ Missing WP_USER or WP_APP_PASSWORD env vars');
  process.exit(1);
}

const AUTH = 'Basic ' + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString('base64');
const ENDPOINT = `${WP_BASE_URL.replace(/\/$/, '')}/wp-json/wp/v2/case_study`;

const headers = {
  Authorization: AUTH,
  'Content-Type': 'application/json',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const findBySlug = async (slug) => {
  const res = await fetch(`${ENDPOINT}?slug=${encodeURIComponent(slug)}&status=publish,draft,private`, {
    headers,
  });
  if (!res.ok) {
    // Fall back to public listing if status filter forbidden
    const r2 = await fetch(`${ENDPOINT}?slug=${encodeURIComponent(slug)}`, { headers });
    if (!r2.ok) throw new Error(`Lookup failed: ${r2.status} ${await r2.text()}`);
    const arr = await r2.json();
    return arr[0]?.id ?? null;
  }
  const arr = await res.json();
  return arr[0]?.id ?? null;
};

const buildContent = (cs) => {
  const meta = {
    client: cs.client,
    industry: cs.industry,
    year: cs.year,
    duration: cs.duration,
    team: cs.team,
    color: cs.color,
    services: cs.services,
    metrics: cs.metrics,
  };
  const sections = cs.body
    .map((b) => {
      let s = `<h2>${b.h}</h2>`;
      if (b.p) s += `<p>${b.p}</p>`;
      if (b.list && b.list.length) s += `<ul>${b.list.map((i) => `<li>${i}</li>`).join('')}</ul>`;
      return s;
    })
    .join('\n');
  return `<!-- case-meta:${JSON.stringify(meta)} -->\n${sections}`;
};

const upsert = async (cs) => {
  const existing = await findBySlug(cs.slug);
  const payload = {
    title: cs.title,
    slug: cs.slug,
    excerpt: cs.summary,
    content: buildContent(cs),
    status: 'publish',
  };
  const url = existing ? `${ENDPOINT}/${existing}` : ENDPOINT;
  const method = existing ? 'POST' : 'POST'; // WP REST: POST to /{id} updates
  const res = await fetch(url, { method, headers, body: JSON.stringify(payload) });
  if (!res.ok) {
    console.error(`  ✗ ${cs.slug} -> ${res.status} ${await res.text()}`);
    return null;
  }
  const data = await res.json();
  console.log(`  ${existing ? 'updated' : 'created'} #${data.id}  ${cs.slug}`);
  return data.id;
};

// ─── Data (from Nexora Profile.pdf) ─────────────────────────────────────────

const CASE_STUDIES = [
  {
    slug: 'stock-prediction',
    title: 'AI Stock Prediction Platform',
    client: 'Confidential Fintech Client',
    industry: 'Fintech',
    year: '2024',
    duration: '6 months',
    team: '5',
    color: '#6366F1',
    summary:
      'AI-driven stock prediction system analyzing historical and real-time market data to forecast price trends and support smarter investment decisions.',
    services: ['Python', 'Machine Learning', 'Deep Learning', 'Financial APIs', 'AWS'],
    metrics: [],
    body: [
      {
        h: 'Business Challenge',
        p: 'Stock markets are highly volatile, making accurate predictions difficult, while investors lack real-time, data-driven tools to support confident decision-making.',
      },
      {
        h: 'Our Solution',
        p: 'We built an AI-driven stock prediction system that analyzes historical and real-time market data to forecast price trends and support smarter investment decisions.',
      },
      { h: 'Tech Stack', list: ['Python', 'Machine Learning & Deep Learning frameworks', 'Financial analysis APIs', 'AWS'] },
    ],
  },
  {
    slug: 'manufacturing-qc-tracking',
    title: 'Manufacturing QC Visual Inspection',
    client: 'Industrial Manufacturer',
    industry: 'Manufacturing',
    year: '2024',
    duration: '8 months',
    team: '7',
    color: '#10B981',
    summary:
      'Automated visual inspection system using deep learning (YOLO + ResNet) to detect surface defects in real time — reducing false negatives by 94% and cutting QC labor costs by 60%.',
    services: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'NVIDIA Triton', 'FastAPI', 'Docker', 'AWS S3'],
    metrics: [
      { label: 'Defect Detection Accuracy', value: '94%' },
      { label: 'QC Labor Cost Reduction', value: '60%' },
      { label: 'Inference Per Frame', value: '<12ms' },
      { label: 'Automated Monitoring', value: '24/7' },
    ],
    body: [
      {
        h: 'Business Challenge',
        p: 'Manufacturing lines struggle with manual defect detection — slow, error-prone, and costly — while quality teams lack real-time visibility into production anomalies.',
      },
      {
        h: 'Our Solution',
        p: 'Automated visual inspection system using deep learning (YOLO + ResNet) to detect surface defects in real time, reducing false negatives by 94% and cutting QC labor costs by 60%.',
      },
      {
        h: 'CV Inspection Pipeline',
        list: [
          'Image Capture — HD cameras @ 60fps',
          'Preprocessing — noise reduction, normalization',
          'Defect Detection — YOLOv8 inference <12ms/frame',
          'Result Output — dashboard alert + auto-reject',
        ],
      },
      {
        h: 'Tech Stack',
        list: ['Python', 'PyTorch', 'YOLOv8', 'OpenCV', 'NVIDIA Triton Inference Server', 'FastAPI', 'Docker', 'AWS S3'],
      },
    ],
  },
  {
    slug: 'project-workspace',
    title: 'Project Workspace — Team Productivity Platform',
    client: 'SaaS Startup',
    industry: 'Productivity SaaS',
    year: '2024',
    duration: '9 months',
    team: '6',
    color: '#8B5CF6',
    summary:
      'Team task management platform with shared boards, deadlines, and embedded video and calendar workflows for distributed teams — boosting team productivity by 50%.',
    services: ['Vue', 'Node.js', 'MongoDB', 'Google Calendar API', 'Zoom SDK'],
    metrics: [
      { label: 'Team Productivity', value: '+50%' },
      { label: 'Integrations', value: '5+' },
      { label: 'Tech Stack', value: 'Vue+Node' },
      { label: 'Availability', value: '24/7' },
    ],
    body: [
      {
        h: 'Business Challenge',
        p: 'Teams working across tools face constant context switching — emails, calendars, video calls, and task trackers siloed without a unified workflow platform.',
      },
      {
        h: 'Our Solution',
        p: 'Team task management platform with shared boards, deadlines, and embedded video and calendar workflows for distributed teams — boosting team productivity by 50%.',
      },
      {
        h: 'Delivery Highlights',
        list: [
          'Native calendar and video integrations reduced context switching.',
          'Customizable boards adapt to engineering, marketing, and operational workflows.',
          'Role-based permissions and activity logs supported larger team rollouts.',
        ],
      },
      { h: 'Tech Stack', list: ['Vue', 'Node.js', 'MongoDB', 'Google Calendar API', 'Zoom SDK'] },
    ],
  },
  {
    slug: 'saleshub-pos',
    title: 'SalesHub POS — Multi-platform Retail & Restaurant POS',
    client: 'Retail Chain Operator',
    industry: 'Retail & F&B',
    year: '2023',
    duration: '7 months',
    team: '8',
    color: '#F59E0B',
    summary:
      'Multi-platform POS system for retail chains and restaurants with offline-first reliability and centralized HQ reporting — onboarding 50+ stores in just 3 months.',
    services: ['React', 'ASP.NET Core', 'MySQL'],
    metrics: [
      { label: 'Stores Onboarded', value: '50+' },
      { label: 'Deployment', value: '3 mo' },
      { label: 'Design', value: 'Offline-first' },
      { label: 'HQ Sync', value: 'Real-time' },
    ],
    body: [
      {
        h: 'Business Challenge',
        p: 'Retail chains and restaurants lacked a unified POS — fragmented systems caused network-dependent failures and no real-time visibility into revenue or inventory across locations.',
      },
      {
        h: 'Our Solution',
        p: 'Multi-platform POS system for retail chains and restaurants with offline-first reliability and centralized HQ reporting — onboarding 50+ stores in just 3 months.',
      },
      {
        h: 'Delivery Highlights',
        list: [
          'Offline-capable terminals continued operating through network outages.',
          'Real-time synchronization to HQ for inventory and revenue visibility.',
          'Configurable receipts, tax rules, and loyalty programs per location.',
        ],
      },
      { h: 'Tech Stack', list: ['React', 'ASP.NET Core', 'MySQL'] },
    ],
  },
  {
    slug: 'erp-platform',
    title: 'Integrated ERP Platform for Mid-market Operators',
    client: 'Mid-market Enterprise',
    industry: 'Enterprise Software',
    year: '2023',
    duration: '12 months',
    team: '10',
    color: '#EF4444',
    summary:
      'Integrated enterprise platform spanning inventory, sales, procurement, finance, HR, and CRM — designed for mid-market operators consolidating onto a single back office, cutting manual reporting by 60%.',
    services: ['React', 'TypeScript', 'Node.js', 'WebSocket', 'PostgreSQL', 'Redis'],
    metrics: [
      { label: 'Reporting Effort', value: '−60%' },
      { label: 'Tools Consolidated', value: '6→1' },
      { label: 'Multi-unit Sync', value: 'Real-time' },
      { label: 'Coverage', value: 'Full ERP' },
    ],
    body: [
      {
        h: 'Business Challenge',
        p: 'Mid-market operators run six or more disconnected back-office tools — causing manual reporting overhead, data silos across finance, HR, inventory, and no single source of truth.',
      },
      {
        h: 'Our Solution',
        p: 'Integrated enterprise platform spanning inventory, sales, procurement, finance, HR, and CRM — designed for mid-market operators consolidating onto a single back office, cutting manual reporting by 60%.',
      },
      {
        h: 'Delivery Highlights',
        list: [
          'Replaced six disparate tools with one unified back-office workspace.',
          'Real-time inventory and finance visibility across business units.',
          'Configurable role-based dashboards for executives and operators.',
        ],
      },
      { h: 'Tech Stack', list: ['React', 'TypeScript', 'Node.js', 'WebSocket', 'PostgreSQL', 'Redis'] },
    ],
  },
  {
    slug: 'laundry-booking-app',
    title: 'Laundry Booking App',
    client: 'Laundry Service Operator',
    industry: 'Service Tech',
    year: '2023',
    duration: '4 months',
    team: '4',
    color: '#22C55E',
    summary:
      'A simple yet powerful booking app enabling user autonomy and optimized store operations — replacing error-prone phone bookings.',
    services: ['React Native', 'Node.js', 'PostgreSQL'],
    metrics: [],
    body: [
      {
        h: 'Business Challenge',
        p: 'The client lacked a scheduling system, relying on phone calls, which led to errors and lack of control.',
      },
      {
        h: 'Our Solution',
        p: 'Nexora built a simple yet powerful app enabling user autonomy and optimized store operations.',
      },
      { h: 'Tech Stack', list: ['React Native', 'Node.js', 'PostgreSQL'] },
    ],
  },
  {
    slug: 'food-marketplace',
    title: 'Food Marketplace — Standalone Ordering Platform',
    client: 'F&B Brand',
    industry: 'F&B',
    year: '2023',
    duration: '5 months',
    team: '5',
    color: '#EC4899',
    summary:
      'Standalone food ordering platform enabling the client to control data, orders, and reduce operational costs — moving off third-party platforms.',
    services: ['React Native', 'Node.js', 'MySQL'],
    metrics: [],
    body: [
      {
        h: 'Business Challenge',
        p: 'The client relied on platforms like Grab Food / Now, incurring high fees and limited restaurant management features.',
      },
      {
        h: 'Our Solution',
        p: 'Nexora built a standalone platform enabling the client to control data, orders, and reduce operational costs.',
      },
      { h: 'Tech Stack', list: ['React Native', 'Node.js', 'MySQL'] },
    ],
  },
  {
    slug: 'cosmeb-sc',
    title: 'CosmeB SC — Unified Service Operations App',
    client: 'Service Provider Network',
    industry: 'Service Tech',
    year: '2024',
    duration: '6 months',
    team: '6',
    color: '#0EA5E9',
    summary:
      'A single app combining wallet, order lifecycle, reporting and in-app support to streamline daily operations for service providers.',
    services: ['React Native', 'Node.js', 'MySQL', 'Payment Gateway', 'Maps API'],
    metrics: [],
    body: [
      {
        h: 'Business Challenge',
        p: 'Fragmented tools for orders, payments and support caused delays and poor visibility for providers.',
      },
      {
        h: 'Our Solution',
        p: 'Delivered a single app combining wallet, order lifecycle, reporting and in-app support to streamline daily operations.',
      },
      { h: 'Tech Stack', list: ['React Native', 'Node.js', 'MySQL', 'Payment gateway', 'Maps API'] },
    ],
  },
];

// ─── Seeder ─────────────────────────────────────────────────────────────────

console.log(`\n▶ Seeding ${CASE_STUDIES.length} case studies to ${WP_BASE_URL}…`);
for (const cs of CASE_STUDIES) {
  try {
    await upsert(cs);
  } catch (err) {
    console.error(`  ✗ ${cs.slug} -> ${err.message}`);
  }
}
console.log('\n✓ Done');
