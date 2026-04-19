import { NextRequest, NextResponse } from 'next/server';
import { wpClient, POST_BASE_FIELDS, WPPost } from '@/lib/wordpress';

const GET_BLOG_POST = `
  ${POST_BASE_FIELDS}
  query GetBlogPost($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      ...PostBaseFields
      content
    }
  }
`;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const data = await wpClient.request<{ post: WPPost | null }>(
      GET_BLOG_POST,
      { slug }
    );
    if (!data.post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(data.post);
  } catch (err) {
    console.error('[WP API /blog/slug]', err);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}
