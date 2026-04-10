'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, FolderOpen, Tag, ArrowLeft, ArrowRight } from 'lucide-react';

const DARK_BG = 'linear-gradient(135deg, #0D1F2B 0%, #1A3A4A 50%, #0D1F2B 100%)';

interface WPTerm { id: number; name: string; slug: string; count: number; }

interface Props {
  title: string;
  date: string;
  content: string;
  categories: WPTerm[];
  tags: WPTerm[];
  allCategories: WPTerm[];
  allTags: WPTerm[];
  image?: { src: string; alt: string };
  authorName?: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function PostSidebar({
  search, setSearch, allCategories, allTags,
}: {
  search: string; setSearch: (v: string) => void;
  allCategories: WPTerm[]; allTags: WPTerm[];
}) {
  const sideCard = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '1rem',
    padding: '1.5rem',
  };

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/blog?search=${encodeURIComponent(search.trim())}`;
    }
  }

  return (
    <aside className="space-y-6">
      {/* Search */}
      <div style={sideCard}>
        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          Search
        </h3>
        <form onSubmit={handleSearch} className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-9 pr-10 py-2.5 text-white text-sm outline-none rounded-lg"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Roboto', Arial, sans-serif" }}
            onFocus={(e) => (e.target.style.borderColor = '#EF7C3B')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded" style={{ color: '#EF7C3B' }}>
            <ArrowRight size={14} />
          </button>
        </form>
      </div>

      {/* Categories */}
      {allCategories.length > 0 && (
        <div style={sideCard}>
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <FolderOpen size={14} style={{ color: '#EF7C3B' }} /> Categories
          </h3>
          <ul className="space-y-1">
            <li>
              <a href="/blog" className="w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Roboto', sans-serif", display: 'flex' }}>
                All Posts
              </a>
            </li>
            {allCategories.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`/blog?category=${encodeURIComponent(cat.name)}`}
                  className="w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg text-sm transition-colors"
                  style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Roboto', sans-serif", display: 'flex' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EF7C3B'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,124,59,0.1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{cat.count}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div style={sideCard}>
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Tag size={14} style={{ color: '#EF7C3B' }} /> Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <a
                key={tag.id}
                href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                className="text-xs px-3 py-1 rounded-full transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontFamily: "'Roboto', sans-serif",
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = '#EF7C3B'; el.style.color = '#fff'; el.style.borderColor = '#EF7C3B'; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.color = 'rgba(255,255,255,0.6)'; el.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                {tag.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Back to blog */}
      <a
        href="/blog"
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors"
        style={{ color: '#EF7C3B', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
      >
        <ArrowLeft size={14} /> Back to Blog
      </a>
    </aside>
  );
}

export default function PostClient({ title, date, content, categories, tags, allCategories, allTags, image, authorName }: Props) {
  const [search, setSearch] = useState('');

  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24" style={{ background: DARK_BG }}>
        <div className="container">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-xs mb-8"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            <a href="/" className="hover:text-[#EF7C3B] transition-colors">Home</a>
            <span>/</span>
            <a href="/blog" className="hover:text-[#EF7C3B] transition-colors">Blog</a>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }} className="truncate max-w-[200px]">{title}</span>
          </motion.div>

          {/* Category pills */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
              className="flex flex-wrap gap-2 mb-4"
            >
              {categories.map((cat) => (
                <span key={cat.id} className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ background: 'rgba(239,124,59,0.15)', color: '#EF7C3B', fontFamily: "'Inter', sans-serif" }}>
                  {cat.name}
                </span>
              ))}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontFamily: "'Inter', sans-serif", fontWeight: 900, letterSpacing: '-0.02em', maxWidth: '860px' }}
            dangerouslySetInnerHTML={{ __html: title }}
          />

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap items-center gap-4 text-sm"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={13} style={{ color: '#EF7C3B' }} />
              {formatDate(date)}
            </span>
            {authorName && <span>By {authorName}</span>}
          </motion.div>
        </div>
      </section>

      {/* Featured image */}
      {image && (
        <div style={{ background: '#0D1F2B' }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden"
              style={{ maxHeight: '480px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" style={{ maxHeight: '480px' }} />
            </motion.div>
          </div>
        </div>
      )}

      {/* Content + Sidebar */}
      <section className="py-14 lg:py-20" style={{ background: 'linear-gradient(315deg, #0D1F2B 0%, #1A3A4A 50%, #0D1F2B 100%)' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">

            {/* Left — Article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl p-8 lg:p-10"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {tags.map((tag) => (
                    <a
                      key={tag.id}
                      href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                      className="text-xs px-2.5 py-0.5 rounded-full transition-all"
                      style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none', fontFamily: "'Roboto', sans-serif" }}
                    >
                      #{tag.name}
                    </a>
                  ))}
                </div>
              )}

              {/* WordPress content */}
              <div
                className="wp-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Bottom nav */}
              <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <a
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all"
                  style={{ color: '#EF7C3B', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}
                >
                  <ArrowLeft size={14} /> Back to All Articles
                </a>
              </div>
            </motion.article>

            {/* Right — Sidebar */}
            <div className="lg:sticky lg:top-28">
              <PostSidebar
                search={search} setSearch={setSearch}
                allCategories={allCategories} allTags={allTags}
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
