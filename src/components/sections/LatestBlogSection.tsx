'use client';
/*
 * LatestBlogSection — ProSWPPP Redesign
 * Fetches live posts from WordPress REST API (cms.proswppp.com)
 * Falls back to placeholder data if API is unavailable
 */

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  compliance: "#EF7C3B",
  guides: "#154FC1",
  inspections: "#6B9ED1",
  "best-practices": "#2D7D46",
  violations: "#C0392B",
  "permit-close-out": "#8B4513",
  uncategorized: "#6B9ED1",
};

interface PostCard {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
}

const FALLBACK_POSTS: PostCard[] = [
  {
    id: 1,
    category: "COMPLIANCE",
    categoryColor: "#EF7C3B",
    title: "Does My Construction Project Actually Need a SWPPP?",
    excerpt: "If your project disturbs 1 acre or more of land, federal law requires a Stormwater Pollution Prevention Plan. Here's how to know for sure.",
    date: "Mar 18, 2025",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-swppp-required-5g5heySjM992MM84CHA4zv.webp",
    slug: "/blog/does-my-project-need-a-swppp",
  },
  {
    id: 2,
    category: "GUIDES",
    categoryColor: "#154FC1",
    title: "How We Deliver a Fully Compliant SWPPP in 72 Hours",
    excerpt: "Most firms take two weeks. We've engineered a process that delivers a permit-ready plan in 3 business days — or your money back.",
    date: "Feb 28, 2025",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-72hr-delivery-3zE2jKXUKSi42ksd8NnQpx.webp",
    slug: "/blog/72-hour-swppp-delivery",
  },
  {
    id: 3,
    category: "INSPECTIONS",
    categoryColor: "#6B9ED1",
    title: "What to Expect During a Stormwater Inspection",
    excerpt: "Regulators can show up unannounced. We break down exactly what inspectors look for and how a solid SWPPP protects you from fines.",
    date: "Feb 14, 2025",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-inspector-gXfUZgxgodw6MsCTyZM5W6.webp",
    slug: "/blog/stormwater-inspection-guide",
  },
  {
    id: 4,
    category: "BEST PRACTICES",
    categoryColor: "#2D7D46",
    title: "The Complete Guide to BMPs for Your Construction Site",
    excerpt: "Best Management Practices like silt fences, sediment basins, and erosion control blankets are the backbone of every compliant SWPPP.",
    date: "Jan 30, 2025",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-bmp-guide-9ELJhakrHQEDuKggMoNYHC.webp",
    slug: "/blog/bmp-guide-construction-sites",
  },
  {
    id: 5,
    category: "VIOLATIONS",
    categoryColor: "#C0392B",
    title: "SWPPP Violations: How to Avoid $50,000/Day Fines",
    excerpt: "Stormwater violations can trigger immediate stop-work orders and fines that compound daily. Here's what triggers them and how to stay safe.",
    date: "Jan 12, 2025",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-fines-violations-ZtALNdprAppmAdcmyUF7Ud.webp",
    slug: "/blog/swppp-violations-fines",
  },
  {
    id: 6,
    category: "PERMIT CLOSE-OUT",
    categoryColor: "#8B4513",
    title: "When Can You Terminate Your Construction General Permit?",
    excerpt: "Once your site reaches 70% permanent stabilization, you may be eligible to close out your permit. We walk you through the process step by step.",
    date: "Dec 20, 2024",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-permit-termination-SXzdnsP9PqGNRohvDWLmjb.webp",
    slug: "/blog/terminate-construction-general-permit",
  },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
}

export default function LatestBlogSection() {
  const [posts, setPosts] = useState<PostCard[]>(FALLBACK_POSTS);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_WP_API_BASE ?? 'https://cms.proswppp.com/wp-json';
    fetch(`${base}/wp/v2/posts?_embed&per_page=12&status=publish`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data || !Array.isArray(data) || data.length === 0) return;
        const mapped: PostCard[] = data.map((p: any) => {
          const terms = p._embedded?.['wp:term']?.[0] ?? [];
          const cat = terms[0];
          const catSlug = cat?.slug ?? 'uncategorized';
          const catName = (cat?.name ?? 'General').toUpperCase();
          const color = CATEGORY_COLORS[catSlug] ?? '#6B9ED1';
          const image = p._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? '';
          return {
            id: p.id,
            category: catName,
            categoryColor: color,
            title: stripHtml(p.title?.rendered ?? ''),
            excerpt: stripHtml(p.excerpt?.rendered ?? ''),
            date: formatDate(p.date),
            image,
            slug: `/blog/${p.slug}`,
          };
        });
        setPosts(mapped);
      })
      .catch(() => {/* keep fallback */});
  }, []);

  const allPosts = [...posts, ...posts];
  return (
    <section
      style={{
        background: "#000000",
        padding: "5rem 0 4.5rem",
        overflow: "hidden",
      }}
    >
      {/* ── Section label ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2.75rem",
        }}
      >
        <span
          style={{
            display: "block",
            width: "3rem",
            height: "2px",
            background: "#EF7C3B",
          }}
        />
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "#EF7C3B",
            textTransform: "uppercase",
          }}
        >
          Latest From the ProSWPPP Blog
        </span>
        <span
          style={{
            display: "block",
            width: "3rem",
            height: "2px",
            background: "#EF7C3B",
          }}
        />
      </motion.div>

      {/* ── Scrolling article cards ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Left fade mask — gradual multi-stop */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "14rem",
            background: "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Right fade mask — gradual multi-stop */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "14rem",
            background: "linear-gradient(to left, #000000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Ticker track */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            width: "max-content",
            animation: "blogTicker 60s linear infinite",
            paddingBottom: "0.5rem",
            paddingLeft: "1.5rem",
          }}
          className="blog-ticker-track"
        >
          {allPosts.map((post, i) => (
            <a
              key={i}
              href={post.slug}
              style={{
                width: "360px",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "11px",
                overflow: "hidden",
                textDecoration: "none",
                transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(239,124,59,0.5)";
                el.style.transform = "translateY(-4px)";
                el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "rgba(255,255,255,0.08)";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Card image */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                  }}
                />
              </div>

              {/* Card body */}
              <div
                style={{
                  padding: "1.25rem 1.5rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  flex: 1,
                }}
              >
                {/* Category pill */}
                <span
                  style={{
                    display: "inline-block",
                    alignSelf: "flex-start",
                    backgroundColor: post.categoryColor,
                    color: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "2rem",
                  }}
                >
                  {post.category}
                </span>

                {/* Headline */}
                <h3
                  style={{
                    fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontWeight: 900,
                    fontSize: "1.0625rem",
                    lineHeight: "1.35",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p
                  style={{
                    fontFamily: "'Roboto', Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    lineHeight: "1.6",
                    color: "rgba(255,255,255,0.55)",
                    margin: 0,
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Date row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <Calendar
                    size={13}
                    style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: "'Roboto', Arial, sans-serif",
                      fontWeight: 400,
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {post.date}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── CTA below scroller ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2.75rem",
        }}
      >
        <a
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 2rem",
            borderRadius: "2rem",
            border: "2px solid #EF7C3B",
            backgroundColor: "transparent",
            color: "#EF7C3B",
            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
            fontSize: "0.8125rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background-color 0.2s, color 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "#EF7C3B";
            el.style.color = "#ffffff";
            el.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "transparent";
            el.style.color = "#EF7C3B";
            el.style.transform = "translateY(0)";
          }}
        >
          Read All Articles
          <ArrowRight size={15} />
        </a>
      </motion.div>
    </section>
  );
}
