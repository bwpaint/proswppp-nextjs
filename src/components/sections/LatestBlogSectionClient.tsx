'use client';
/*
 * LatestBlogSectionClient — the interactive ticker portion of the blog
 * section. Receives an already-fetched array of posts from its server
 * component parent (LatestBlogSection.tsx) so there's NO client-side
 * fetch / no useEffect / no network roundtrip on page load.
 */

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

export interface PostCard {
  id: number;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  slug: string;
}

export default function LatestBlogSectionClient({ posts }: { posts: PostCard[] }) {
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
        <span style={{ display: "block", width: "3rem", height: "2px", background: "#DE863F" }} />
        <span
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            color: "#DE863F",
            textTransform: "uppercase",
          }}
        >
          Latest From the ProSWPPP Blog
        </span>
        <span style={{ display: "block", width: "3rem", height: "2px", background: "#DE863F" }} />
      </motion.div>

      {/* ── Scrolling article cards ── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "14rem",
            background:
              "linear-gradient(to right, #000000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "14rem",
            background:
              "linear-gradient(to left, #000000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

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
                el.style.borderColor = "rgba(222,134,63,0.5)";
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
              <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.4s ease",
                  }}
                />
              </div>

              <div
                style={{
                  padding: "1.25rem 1.5rem 1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  flex: 1,
                }}
              >
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

                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem" }}>
                  <Calendar size={13} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
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
        style={{ display: "flex", justifyContent: "center", marginTop: "2.75rem" }}
      >
        <a
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 2rem",
            borderRadius: "2rem",
            border: "2px solid #DE863F",
            backgroundColor: "transparent",
            color: "#DE863F",
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
            el.style.backgroundColor = "#DE863F";
            el.style.color = "#ffffff";
            el.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "transparent";
            el.style.color = "#DE863F";
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
