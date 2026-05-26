/**
 * /home-3/ scoped layout — applies next/font/google CSS variables to
 * everything under /home-3/ ONLY, so the live site keeps loading fonts
 * via the original <link> tags (per owner: Option B).
 *
 * Mechanism:
 *   - next/font/google with `variable` mode bakes Inter + Roboto into
 *     the build as self-hosted assets and inlines critical font-face
 *     CSS into the SSR HTML for any page that mounts this layout.
 *   - The font className strings get attached to a wrapper <div>.
 *     CSS variables --font-inter / --font-roboto cascade only into
 *     children of that div — i.e., only /home-3/.
 *   - globals.css declarations like
 *       font-family: var(--font-inter), 'Inter', ...
 *     use the self-hosted variant when the variable is defined
 *     (/home-3/) and fall back to the <link>-loaded 'Inter' on every
 *     other route.
 */

import type { ReactNode } from 'react';
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['900'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function HomeThreeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Hide the rotating-flash announcement bar on /home-3/ only.
          The bar is rendered by the shared Navigation in the root
          layout; this scoped <style> only loads when /home-3/ mounts,
          so the live site keeps the bar untouched. Removed from
          layout entirely (no paint area, no LCP candidate) — the JS
          interval still ticks in the background but does nothing
          visible. */}
      <style>{`
        .announcement-bar { display: none !important; }
      `}</style>
      <div className={`${inter.variable} ${roboto.variable}`}>
        {children}
      </div>
    </>
  );
}
