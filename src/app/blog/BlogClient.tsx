'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, ArrowRight, BookOpen, Tag, FolderOpen } from 'lucide-react';

const DARK_BG = '#000000';

interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

interface WPTerm { id: number; name: string; slug: string; count: number; }

interface Props {
  posts: WPPost[];
  categories: WPTerm[];
  tags: WPTerm[];
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function PostCard({ post }: { post: WPPost }) {
  const image = post._embedded?.['wp:featuredmedia']?.[0];
  const cats = post._embedded?.['wp:term']?.[0] ?? [];
  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 140) + '…';

  return (
    <article
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', transition: 'border-color 0.2s, transform 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(222,134,63,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <a href={`/blog/${post.slug}/`} className="block overflow-hidden aspect-video bg-black flex-shrink-0">
        {image ? (
          <img src={image.source_url} alt={image.alt_text || title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: '#111111' }}>
            <BookOpen size={36} style={{ color: '#DE863F', opacity: 0.4 }} />
          </div>
        )}
      </a>
      <div className="p-5 flex flex-col flex-1">
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {cats.slice(0, 2).map((cat) => (
              <span key={cat.id} className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(222,134,63,0.15)', color: '#DE863F' }}>
                {cat.name}
              </span>
            ))}
          </div>
        )}
        <a href={`/blog/${post.slug}/`} className="block flex-1">
          <h2 className="font-black text-base leading-snug mb-2 text-white group-hover:text-[#DE863F] transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>{excerpt}</p>
        </a>
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="flex items-center gap-1.5 text-gray-500 text-xs">
            <Calendar size={12} />{formatDate(post.date)}
          </span>
          <a href={`/blog/${post.slug}/`} className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#DE863F] hover:gap-2 transition-all">
            Read More <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </article>
  );
}

function BlogSidebar({
  search, setSearch, categories, tags, activeCategory, setActiveCategory, activeTag, setActiveTag,
}: {
  search: string; setSearch: (v: string) => void;
  categories: WPTerm[]; tags: WPTerm[];
  activeCategory: string; setActiveCategory: (v: string) => void;
  activeTag: string; setActiveTag: (v: string) => void;
}) {
  const sideCard = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '1rem', padding: '1.5rem' };

  return (
    <aside className="space-y-6">
      {/* Search */}
      <div style={sideCard}>
        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Search</h3>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-3 py-2.5 text-white text-sm outline-none rounded-lg"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Roboto', Arial, sans-serif" }}
            onFocus={(e) => (e.target.style.borderColor = '#DE863F')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div style={sideCard}>
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <FolderOpen size={14} style={{ color: '#DE863F' }} /> Categories
          </h3>
          <ul className="space-y-1">
            <li>
              <button onClick={() => setActiveCategory('All')} className="w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg text-sm transition-colors"
                style={{ color: activeCategory === 'All' ? '#DE863F' : 'rgba(255,255,255,0.7)', background: activeCategory === 'All' ? 'rgba(222,134,63,0.1)' : 'transparent', fontFamily: "'Roboto', sans-serif" }}>
                All Posts
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => setActiveCategory(cat.name)} className="w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg text-sm transition-colors"
                  style={{ color: activeCategory === cat.name ? '#DE863F' : 'rgba(255,255,255,0.7)', background: activeCategory === cat.name ? 'rgba(222,134,63,0.1)' : 'transparent', fontFamily: "'Roboto', sans-serif" }}>
                  <span>{cat.name}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{cat.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div style={sideCard}>
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Tag size={14} style={{ color: '#DE863F' }} /> Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button key={tag.id} onClick={() => setActiveTag(activeTag === tag.name ? '' : tag.name)}
                className="text-xs px-3 py-1 rounded-full transition-all"
                style={{
                  background: activeTag === tag.name ? '#DE863F' : 'rgba(255,255,255,0.07)',
                  color: activeTag === tag.name ? '#fff' : 'rgba(255,255,255,0.6)',
                  border: `1px solid ${activeTag === tag.name ? '#DE863F' : 'rgba(255,255,255,0.12)'}`,
                  fontFamily: "'Roboto', sans-serif",
                }}>
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export default function BlogClient({ posts, categories, tags }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag] = useState('');

  // Read query params from URL on mount (for links from post sidebar)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const tag = params.get('tag');
    const q = params.get('search');
    if (cat) setActiveCategory(cat);
    if (tag) setActiveTag(tag);
    if (q) setSearch(q);
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const title = stripHtml(post.title.rendered).toLowerCase();
      const excerpt = stripHtml(post.excerpt.rendered).toLowerCase();
      const matchesSearch = !search || title.includes(search.toLowerCase()) || excerpt.includes(search.toLowerCase());
      const postCats = post._embedded?.['wp:term']?.[0]?.map((c) => c.name) ?? [];
      const postTags = post._embedded?.['wp:term']?.[1]?.map((t) => t.name) ?? [];
      const matchesCat = activeCategory === 'All' || postCats.includes(activeCategory);
      const matchesTag = !activeTag || postTags.includes(activeTag);
      return matchesSearch && matchesCat && matchesTag;
    });
  }, [posts, search, activeCategory, activeTag]);

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28" style={{ background: DARK_BG }}>
        <div className="container text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="section-label mb-4">Expert Resources</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white uppercase leading-none mb-4"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontFamily: "'Inter', sans-serif", fontWeight: 900, letterSpacing: '-0.03em' }}>
            SWPPP <span style={{ color: '#DE863F' }}>Blog</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
            State-specific guides, compliance tips, and stormwater resources from America&apos;s #1 SWPPP experts.
          </motion.p>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="py-16 lg:py-20" style={{ background: '#000000' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">

            {/* Left — Posts */}
            <div>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                {filtered.length} article{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
                {activeTag ? ` tagged "${activeTag}"` : ''}
              </p>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'rgba(255,255,255,0.2)' }} />
                  <p className="text-gray-500 text-lg" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                    {posts.length === 0 ? 'Blog posts coming soon.' : 'No posts match your search.'}
                  </p>
                  {(search || activeTag) && (
                    <button onClick={() => { setSearch(''); setActiveTag(''); }} className="mt-4 text-[#DE863F] text-sm font-semibold underline">
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filtered.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              )}
            </div>

            {/* Right — Sidebar */}
            <div className="lg:sticky lg:top-28">
              <BlogSidebar
                search={search} setSearch={setSearch}
                categories={categories} tags={tags}
                activeCategory={activeCategory} setActiveCategory={setActiveCategory}
                activeTag={activeTag} setActiveTag={setActiveTag}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
