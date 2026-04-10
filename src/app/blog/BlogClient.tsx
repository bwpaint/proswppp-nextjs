'use client';
/*
 * Blog Page Client — ProSWPPP Redesign
 * Receives posts from server component (WP REST API)
 * Features: search filter, category pills, responsive grid
 */

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Search, Calendar, ArrowRight, BookOpen } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

interface Props {
  posts: WPPost[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getCategories(posts: WPPost[]): string[] {
  const seen = new Set<string>();
  const cats: string[] = ['All'];
  posts.forEach((post) => {
    const terms = post._embedded?.['wp:term']?.[0] ?? [];
    terms.forEach((t) => {
      if (!seen.has(t.name)) {
        seen.add(t.name);
        cats.push(t.name);
      }
    });
  });
  return cats;
}

function PostCard({ post, index }: { post: WPPost; index: number }) {
  const image = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] ?? [];
  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 140) + '…';

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index * 0.06}
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{ background: '#fff', border: '1px solid #e9ecef', transition: 'box-shadow 0.2s' }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Featured image */}
      <a href={`/blog/${post.slug}/`} className="block overflow-hidden aspect-video bg-[#f0f4f8] flex-shrink-0">
        {image ? (
          <img
            src={image.source_url}
            alt={image.alt_text || title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1A3A4A, #0D1F2B)' }}>
            <BookOpen size={36} style={{ color: '#EF7C3B', opacity: 0.5 }} />
          </div>
        )}
      </a>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{ background: 'rgba(239,124,59,0.1)', color: '#EF7C3B' }}
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        <a href={`/blog/${post.slug}/`} className="block flex-1">
          <h2
            className="font-black text-base leading-snug mb-2 group-hover:text-[#EF7C3B] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", color: '#1A3A4A', letterSpacing: '-0.01em' }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
            {excerpt}
          </p>
        </a>

        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
          <span className="flex items-center gap-1.5 text-gray-400 text-xs" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
            <Calendar size={12} />
            {formatDate(post.date)}
          </span>
          <a
            href={`/blog/${post.slug}/`}
            className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#EF7C3B] hover:gap-2 transition-all"
            style={{ fontFamily: "'Roboto', sans-serif" }}
          >
            Read More <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogClient({ posts }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => getCategories(posts), [posts]);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const title = stripHtml(post.title.rendered).toLowerCase();
      const excerpt = stripHtml(post.excerpt.rendered).toLowerCase();
      const matchesSearch = !search || title.includes(search.toLowerCase()) || excerpt.includes(search.toLowerCase());
      const postCats = post._embedded?.['wp:term']?.[0]?.map((c) => c.name) ?? [];
      const matchesCat = activeCategory === 'All' || postCats.includes(activeCategory);
      return matchesSearch && matchesCat;
    });
  }, [posts, search, activeCategory]);

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-20 lg:py-28"
        style={{ background: 'linear-gradient(135deg, #0D1F2B 0%, #1A3A4A 100%)' }}
      >
        <div className="container text-center">
          <motion.p
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="section-label mb-4"
          >
            Expert Resources
          </motion.p>
          <motion.h1
            custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-white uppercase leading-none mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.03em',
            }}
          >
            SWPPP <span style={{ color: '#EF7C3B' }}>Blog</span>
          </motion.h1>
          <motion.p
            custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-gray-400 text-lg max-w-xl mx-auto mb-10"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            State-specific guides, compliance tips, and stormwater management resources from America&apos;s #1 SWPPP experts.
          </motion.p>

          {/* Search */}
          <motion.div
            custom={0.3} initial="hidden" animate="visible" variants={fadeUp}
            className="relative max-w-md mx-auto"
          >
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-full text-white text-sm outline-none transition-colors"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontFamily: "'Roboto', Arial, sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = '#EF7C3B')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
            />
          </motion.div>
        </div>
      </section>

      {/* ── Posts Grid ── */}
      <section className="py-16 lg:py-24" style={{ background: '#f8f9fa' }}>
        <div className="container">
          {/* Category filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-200"
                  style={{
                    background: activeCategory === cat ? '#EF7C3B' : '#fff',
                    color: activeCategory === cat ? '#fff' : '#6b7280',
                    border: activeCategory === cat ? '1px solid #EF7C3B' : '1px solid #e9ecef',
                    fontFamily: "'Roboto', sans-serif",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                {posts.length === 0 ? 'Blog posts coming soon.' : 'No posts match your search.'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-4 text-[#EF7C3B] text-sm font-semibold underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6 text-center" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                {filtered.length} article{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </>
  );
}
