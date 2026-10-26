import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { CaseStudy, ContentBlock } from '@/lib/static-content';
import { buildAlternates, OG_IMAGES } from '@/lib/seo';
import CaseDetailView from '@/components/case-studies/case-detail-view';
import { textOf } from '@/lib/wordpress';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Parse rendered HTML into ContentBlocks: <h2> headings define block boundaries;
// each block collects following <p> (joined), <ul><li> entries and <figure> images.
function parseBodyBlocks(html: string): ContentBlock[] {
  if (!html.trim()) return [];
  const parts = html.split(/(?=<h2[^>]*>)/i).filter((s) => /<h2/i.test(s));
  return parts.map((seg) => {
    const hMatch = seg.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const h = hMatch ? textOf(hMatch[1]) : '';
    const rest = seg.replace(/<h2[^>]*>[\s\S]*?<\/h2>/i, '');
    const figures = Array.from(rest.matchAll(/<figure[^>]*>([\s\S]*?)<\/figure>/gi)).flatMap((m) => {
      const src = m[1].match(/<img[^>]*\ssrc="([^"]+)"/i)?.[1];
      if (!src) return [];
      const alt = textOf(m[1].match(/<img[^>]*\salt="([^"]*)"/i)?.[1] ?? '');
      const caption = textOf(m[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1] ?? '') || undefined;
      return [{ src, alt, caption }];
    });
    const pTexts = Array.from(rest.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
      .map((m) => textOf(m[1]))
      .filter(Boolean);
    const ulMatch = rest.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
    const list = ulMatch
      ? Array.from(ulMatch[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
          .map((m) => textOf(m[1]))
          .filter(Boolean)
      : undefined;
    return { h, p: pTexts.length ? pTexts.join(' ') : undefined, list, figures: figures.length ? figures : undefined };
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
    const description = textOf(String(item?.excerpt || '')).slice(0, 160);
    const cover = item?.featuredImage?.node?.sourceUrl;
    const images = cover ? [{ url: cover, width: 1600, height: 900, alt: title }] : OG_IMAGES;
    return {
      title,
      description: description || `How Nexora delivered ${title}.`,
      openGraph: { type: 'article', title, description, images },
      twitter: { card: 'summary_large_image', title, description, images },
      alternates: buildAlternates(locale, `/case-studies/${slug}`),
    };
  } catch {
    return { title: 'Case Study' };
  }
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

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
      summary: textOf(String(p.excerpt || '')),
      services: cats?.nodes?.map((n) => n.name) ?? [],
      year: parseInt(meta?.year ?? '0') || new Date(String(p.date)).getFullYear(),
      duration: meta?.duration ?? '',
      team: meta?.team ?? '',
      image: p.featuredImage?.node?.sourceUrl,
      metrics,
      body,
    };

    return <CaseDetailView item={item} locale={locale} />;
  } catch {
    notFound();
  }
}
