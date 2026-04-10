import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostClient from './PostClient';

const BASE = process.env.NEXT_PUBLIC_WP_API_BASE ?? 'https://cms.proswppp.com/wp-json';
const OPTS = { next: { revalidate: 3600 } };

async function getPostBySlug(slug: string) {
  try {
    const res = await fetch(`${BASE}/wp/v2/posts?slug=${slug}&_embed&status=publish`, OPTS);
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch { return null; }
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: 'Post Not Found | Pro SWPPP Blog' };

  const title = post.title?.rendered?.replace(/<[^>]*>/g, '') ?? 'Blog Post';
  const excerpt = post.excerpt?.rendered?.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim().slice(0, 160) ?? '';
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return {
    title: `${title} | Pro SWPPP Blog`,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, allCategories, allTags] = await Promise.all([
    getPostBySlug(params.slug),
    getCategories(),
    getTags(),
  ]);

  if (!post) notFound();

  const embedded = post._embedded ?? {};
  const image = embedded['wp:featuredmedia']?.[0]
    ? { src: embedded['wp:featuredmedia'][0].source_url, alt: embedded['wp:featuredmedia'][0].alt_text || post.title?.rendered?.replace(/<[^>]*>/g, '') }
    : undefined;

  const postCategories = (embedded['wp:term']?.[0] ?? []).map((c: { id: number; name: string; slug: string }) => ({
    id: c.id, name: c.name, slug: c.slug, count: 0,
  }));
  const postTags = (embedded['wp:term']?.[1] ?? []).map((t: { id: number; name: string; slug: string }) => ({
    id: t.id, name: t.name, slug: t.slug, count: 0,
  }));

  const authorName = embedded?.['author']?.[0]?.name ?? undefined;

  return (
    <main>
      <PostClient
        title={post.title?.rendered ?? ''}
        date={post.date ?? ''}
        content={post.content?.rendered ?? ''}
        categories={postCategories}
        tags={postTags}
        allCategories={allCategories}
        allTags={allTags}
        image={image}
        authorName={authorName}
      />
    </main>
  );
}
