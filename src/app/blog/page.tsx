import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'SWPPP Blog — Expert Stormwater Compliance Guides | Pro SWPPP',
  description:
    'State-specific SWPPP guides, compliance tips, and stormwater management resources from America\'s #1 SWPPP experts.',
  openGraph: {
    title: 'SWPPP Blog | Pro SWPPP',
    description: 'Expert stormwater compliance guides and SWPPP resources.',
  },
};

interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

async function getPosts(): Promise<WPPost[]> {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE ?? 'https://cms.proswppp.com/wp-json';
  try {
    const res = await fetch(
      `${base}/wp/v2/posts?_embed&per_page=12&status=publish`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <BlogClient posts={posts} />
    </main>
  );
}
