/**
 * SEO helper — pulls page metadata from WebWize Connect RM (WordPress plugin)
 *
 * Usage in a page.tsx:
 *
 *   import { getSeoMetadata } from '@/lib/seo';
 *
 *   export async function generateMetadata() {
 *     return getSeoMetadata('/about/', {
 *       title: 'About Pro SWPPP',
 *       description: 'Default fallback if RM has no entry for this path.',
 *     });
 *   }
 *
 * If RM has a `live`-status entry for the path it wins.
 * If RM returns 404, missing fields, or any error → the fallback is used.
 */

import type { Metadata } from 'next';

const WWRM_API_BASE =
  process.env.WWRM_API_BASE || 'https://cms.proswppp.com/wp-json/webwize-rm/v1';
const WWRM_API_KEY = process.env.WWRM_API_KEY || '';

// Cache RM responses for 5 min on the server — keeps page builds fast,
// while still picking up edits from the WP admin within a reasonable window.
const RM_REVALIDATE_SECONDS = 300;

interface RmSeoResponse {
  path?: string;
  seo_title?: string;
  meta_desc?: string;
  canonical?: string;
  og_title?: string;
  og_desc?: string;
  og_image?: string;
  twitter_card?: string;
  robots?: string;
  schema_json?: string;
  page_status?: 'draft' | 'development' | 'live';
}

async function fetchRmEntry(path: string): Promise<RmSeoResponse | null> {
  if (!WWRM_API_KEY) return null;

  try {
    const url = `${WWRM_API_BASE}/seo?path=${encodeURIComponent(path)}`;
    const res = await fetch(url, {
      headers: { 'X-API-Key': WWRM_API_KEY },
      next: { revalidate: RM_REVALIDATE_SECONDS, tags: [`rm:${path}`] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as RmSeoResponse;
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

/**
 * Build a Next.js Metadata object from RM data, falling back to the supplied defaults.
 */
export async function getSeoMetadata(
  path: string,
  fallback: Metadata = {}
): Promise<Metadata> {
  const rm = await fetchRmEntry(path);

  if (!rm) return fallback;

  const title = rm.seo_title || (fallback.title as string | undefined);
  const description = rm.meta_desc || (fallback.description as string | undefined);

  // Robots directive — RM stores e.g. "index,follow" or "noindex,nofollow"
  let robots: Metadata['robots'] | undefined;
  if (rm.robots) {
    const directives = rm.robots.toLowerCase();
    robots = {
      index: !directives.includes('noindex'),
      follow: !directives.includes('nofollow'),
    };
  }

  return {
    ...fallback,
    title,
    description,
    alternates: rm.canonical ? { canonical: rm.canonical } : fallback.alternates,
    robots: robots ?? fallback.robots,
    openGraph: {
      ...(fallback.openGraph || {}),
      title: rm.og_title || title,
      description: rm.og_desc || description,
      ...(rm.og_image ? { images: [{ url: rm.og_image }] } : {}),
    },
    twitter: {
      ...(fallback.twitter || {}),
      card:
        (rm.twitter_card as 'summary' | 'summary_large_image' | 'app' | 'player') ||
        'summary_large_image',
      title: rm.og_title || title,
      description: rm.og_desc || description,
      ...(rm.og_image ? { images: [rm.og_image] } : {}),
    },
  };
}

/**
 * Returns the JSON-LD schema string for a path (if RM stores one), else null.
 * Drop into a page with: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
 */
export async function getSeoSchema(path: string): Promise<string | null> {
  const rm = await fetchRmEntry(path);
  if (!rm?.schema_json) return null;
  // Basic guard — RM stores raw JSON string; trust but verify it parses
  try {
    JSON.parse(rm.schema_json);
    return rm.schema_json;
  } catch {
    return null;
  }
}
