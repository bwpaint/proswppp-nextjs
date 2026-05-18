import type { Metadata } from 'next';
import BlogClient from './BlogClient';
import { getSeoMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/blog/', {
    title: 'SWPPP Blog — Expert Stormwater Compliance Guides | Pro SWPPP',
    description:
      "State-specific SWPPP guides, compliance tips, and stormwater management resources from America's #1 SWPPP experts.",
    openGraph: {
      title: 'SWPPP Blog | Pro SWPPP',
      description: 'Expert stormwater compliance guides and SWPPP resources.',
    },
  });
}

const BASE = process.env.NEXT_PUBLIC_WP_API_BASE ?? 'https://cms.proswppp.com/wp-json';
const OPTS = { next: { revalidate: 3600 } };

async function getPosts() {
  try {
    const res = await fetch(`${BASE}/wp/v2/posts?_embed&per_page=50&status=publish`, OPTS);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getCategories() {
  try {
    const res = await fetch(`${BASE}/wp/v2/categories?per_page=50&hide_empty=true`, OPTS);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function getTags() {
  try {
    const res = await fetch(`${BASE}/wp/v2/tags?per_page=50&hide_empty=true`, OPTS);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([getPosts(), getCategories(), getTags()]);
  return (
    <main>
      <BlogClient posts={posts} categories={categories} tags={tags} />
    </main>
  );
}
