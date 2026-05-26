/*
 * LatestBlogSection — SERVER COMPONENT (no "use client").
 *
 * Posts are fetched at build/revalidate time via Next.js' native fetch
 * with ISR (revalidate every hour). The fetched + mapped array is
 * passed as a prop into the client ticker so there is ZERO client-side
 * network roundtrip on page load — posts are baked into the SSR HTML.
 *
 * If the WP REST API is unreachable at build time, we fall back to a
 * static set of 6 sample posts so the section still renders.
 */

import LatestBlogSectionClient, { type PostCard } from "./LatestBlogSectionClient";

const CATEGORY_COLORS: Record<string, string> = {
  compliance: "#DE863F",
  guides: "#7B9CD1",
  inspections: "#7B9CD1",
  "best-practices": "#2D7D46",
  violations: "#C0392B",
  "permit-close-out": "#8B4513",
  uncategorized: "#7B9CD1",
};

const FALLBACK_POSTS: PostCard[] = [
  {
    id: 1,
    category: "COMPLIANCE",
    categoryColor: "#DE863F",
    title: "Does My Construction Project Actually Need a SWPPP?",
    excerpt:
      "If your project disturbs 1 acre or more of land, federal law requires a Stormwater Pollution Prevention Plan. Here's how to know for sure.",
    date: "Mar 18, 2025",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-swppp-required-5g5heySjM992MM84CHA4zv.webp",
    slug: "/blog/does-my-project-need-a-swppp",
  },
  {
    id: 2,
    category: "GUIDES",
    categoryColor: "#7B9CD1",
    title: "How We Deliver a Fully Compliant SWPPP in 72 Hours",
    excerpt:
      "Most firms take two weeks. We've engineered a process that delivers a permit-ready plan in 3 business days — or your money back.",
    date: "Feb 28, 2025",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-72hr-delivery-3zE2jKXUKSi42ksd8NnQpx.webp",
    slug: "/blog/72-hour-swppp-delivery",
  },
  {
    id: 3,
    category: "INSPECTIONS",
    categoryColor: "#7B9CD1",
    title: "What to Expect During a Stormwater Inspection",
    excerpt:
      "Regulators can show up unannounced. We break down exactly what inspectors look for and how a solid SWPPP protects you from fines.",
    date: "Feb 14, 2025",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-inspector-gXfUZgxgodw6MsCTyZM5W6.webp",
    slug: "/blog/stormwater-inspection-guide",
  },
  {
    id: 4,
    category: "BEST PRACTICES",
    categoryColor: "#2D7D46",
    title: "The Complete Guide to BMPs for Your Construction Site",
    excerpt:
      "Best Management Practices like silt fences, sediment basins, and erosion control blankets are the backbone of every compliant SWPPP.",
    date: "Jan 30, 2025",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-bmp-guide-9ELJhakrHQEDuKggMoNYHC.webp",
    slug: "/blog/bmp-guide-construction-sites",
  },
  {
    id: 5,
    category: "VIOLATIONS",
    categoryColor: "#C0392B",
    title: "SWPPP Violations: How to Avoid $50,000/Day Fines",
    excerpt:
      "Stormwater violations can trigger immediate stop-work orders and fines that compound daily. Here's what triggers them and how to stay safe.",
    date: "Jan 12, 2025",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-fines-violations-ZtALNdprAppmAdcmyUF7Ud.webp",
    slug: "/blog/swppp-violations-fines",
  },
  {
    id: 6,
    category: "PERMIT CLOSE-OUT",
    categoryColor: "#8B4513",
    title: "When Can You Terminate Your Construction General Permit?",
    excerpt:
      "Once your site reaches 70% permanent stabilization, you may be eligible to close out your permit. We walk you through the process step by step.",
    date: "Dec 20, 2024",
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/blog-permit-termination-SXzdnsP9PqGNRohvDWLmjb.webp",
    slug: "/blog/terminate-construction-general-permit",
  },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .trim();
}

async function fetchPosts(): Promise<PostCard[]> {
  const base = process.env.NEXT_PUBLIC_WP_API_BASE ?? "https://cms.proswppp.com/wp-json";
  try {
    const r = await fetch(
      `${base}/wp/v2/posts?_embed&per_page=12&status=publish`,
      // ISR — re-fetch every hour; otherwise served from the cached build.
      { next: { revalidate: 3600 } }
    );
    if (!r.ok) return FALLBACK_POSTS;
    const data = (await r.json()) as unknown;
    if (!Array.isArray(data) || data.length === 0) return FALLBACK_POSTS;
    return data.map((p: Record<string, unknown>) => {
      const embedded = (p._embedded ?? {}) as Record<string, unknown>;
      const terms = ((embedded["wp:term"] as unknown[] | undefined)?.[0] ?? []) as Record<string, unknown>[];
      const cat = terms[0];
      const catSlug = (cat?.slug as string | undefined) ?? "uncategorized";
      const catName = ((cat?.name as string | undefined) ?? "General").toUpperCase();
      const color = CATEGORY_COLORS[catSlug] ?? "#7B9CD1";
      const featured = (embedded["wp:featuredmedia"] as unknown[] | undefined)?.[0] as
        | Record<string, unknown>
        | undefined;
      const image = (featured?.source_url as string | undefined) ?? "";
      const titleRendered = ((p.title as Record<string, string> | undefined)?.rendered) ?? "";
      const excerptRendered = ((p.excerpt as Record<string, string> | undefined)?.rendered) ?? "";
      return {
        id: p.id as number,
        category: catName,
        categoryColor: color,
        title: stripHtml(titleRendered),
        excerpt: stripHtml(excerptRendered),
        date: formatDate(p.date as string),
        image,
        slug: `/blog/${p.slug as string}`,
      };
    });
  } catch {
    return FALLBACK_POSTS;
  }
}

export default async function LatestBlogSection() {
  const posts = await fetchPosts();
  return <LatestBlogSectionClient posts={posts} />;
}
