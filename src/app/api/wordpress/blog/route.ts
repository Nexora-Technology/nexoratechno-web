import { NextResponse } from 'next/server';
import { wpClient, POST_BASE_FIELDS, WPPost } from '@/lib/wordpress';

const GET_BLOG_POSTS = `
  ${POST_BASE_FIELDS}
  query GetBlogPosts($first: Int!) {
    posts(first: $first) {
      nodes { ...PostBaseFields }
    }
  }
`;

export async function GET() {
  try {
    const data = await wpClient.request<{ posts: { nodes: WPPost[] } }>(
      GET_BLOG_POSTS,
      { first: 20 }
    );
    return NextResponse.json(data.posts.nodes, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[WP API /blog]', err);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
