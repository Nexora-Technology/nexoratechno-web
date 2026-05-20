import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CaseStudy } from '@/lib/static-content';
import CaseDetailView from '@/components/case-studies/case-detail-view';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Parse rendered HTML into ContentBlocks: <h2> headings define block boundaries;
// each block collects following <p> (joined) and <ul><li> entries.
function parseBodyBlocks(html: string): { h: string; p?: string; list?: string[] }[] {
  if (!html.trim()) return [];
  const parts = html.split(/(?=<h2[^>]*>)/i).filter((s) => /<h2/i.test(s));
  return parts.map((seg) => {
    const hMatch = seg.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const h = hMatch ? hMatch[1].replace(/<[^>]*>/g, '').trim() : '';
    const rest = seg.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    const pTexts = Array.from(rest.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
      .map((m) => m[1].replace(/<[^>]*>/g, '').trim())
      .filter(Boolean);
    const ulMatch = rest.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
    const list = ulMatch
      ? Array.from(ulMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
          .map((m) => m[1].replace(/<[^>]*>/g, '').trim())
          .filter(Boolean)
      : undefined;
    return { h, p: pTexts.length ? pTexts.join(' ') : undefined, list };
  });
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/case-studies`);
    if (!res.ok) return [];
    const cases = await res.json();
    if (!Array.isArray(cases)) return [];
    return cases.map((c: { slug: string }) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/case-studies/${slug}`);
    if (!res.ok) return { title: 'Case Study' };
    const item = await res.json();
    const title = String(item?.title || 'Case Study').replace(/<[^>]*>/g, '');
    const description = String(item?.excerpt || '').replace(/<[^>]*>/g, '').slice(0, 160);
    const prefix = locale === 'vi' ? '' : `/${locale}`;
    return {
      title,
      description: description || `How Nexora delivered ${title}.`,
      openGraph: { type: 'article', title, description },
      alternates: { canonical: `https://nexoratechno.com${prefix}/case-studies/${slug}` },
    };
  } catch {
    return { title: 'Case Study' };
  }
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/case-studies/${slug}`);
    if (!res.ok) notFound();
    const p = await res.json();
    if (!p || p.error) notFound();

    const meta = p.caseMeta as Record<string, string> | null;
    const cats = p.categories as { nodes?: { name: string }[] } | null;
    const metrics = Array.isArray(p.metrics) ? p.metrics : [];
    const body = parseBodyBlocks(String(p.content || ''));
    const item: CaseStudy = {
      slug: String(p.slug),
      client: meta?.client ?? '',
      industry: meta?.industry ?? '',
      title: String(p.title || '').replace(/<[^>]*>/g, ''),
      summary: String(p.excerpt || '').replace(/<[^>]*>/g, ''),
      services: cats?.nodes?.map((n) => n.name) ?? [],
      year: parseInt(meta?.year ?? '0') || new Date(String(p.date)).getFullYear(),
      duration: meta?.duration ?? '',
      team: meta?.team ?? '',
      color: meta?.color ?? '#6B46C1',
      metrics,
      body,
      wpContent: String(p.content || ''),
    };

    return <CaseDetailView item={item} locale={locale} />;
  } catch {
    notFound();
  }
}
