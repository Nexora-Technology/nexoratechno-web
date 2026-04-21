import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Career } from '@/lib/static-content';
import CareerDetailView from '@/components/careers/career-detail-view';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/careers`);
    if (!res.ok) return [];
    const careers = await res.json();
    if (!Array.isArray(careers)) return [];
    return careers.map((c: { slug: string }) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/careers/${slug}`);
    if (!res.ok) return { title: 'Careers' };
    const career = await res.json();
    return { title: String(career?.title || 'Careers').replace(/<[^>]*>/g, '') };
  } catch {
    return { title: 'Careers' };
  }
}

export default async function CareerDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/careers/${slug}`);
    if (!res.ok) notFound();
    const p = await res.json();
    if (!p || p.error) notFound();

    const meta = p.careerMeta as Record<string, string> | null;
    const career: Career = {
      slug: String(p.slug),
      title: String(p.title || '').replace(/<[^>]*>/g, ''),
      dept: meta?.department ?? '',
      location: meta?.location ?? '',
      type: meta?.jobType ?? '',
      level: meta?.level ?? '',
      salary: meta?.salary ?? '',
      tags: [],
      summary: String(p.excerpt || '').replace(/<[^>]*>/g, ''),
      posted: new Date(String(p.date)).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
      body: [],
      wpContent: String(p.content || ''),
    };

    return <CareerDetailView career={career} locale={locale} />;
  } catch {
    notFound();
  }
}
