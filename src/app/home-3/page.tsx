/**
 * /home-3/ — FROZEN BENCHMARK PAGE
 *
 * Standalone snapshot of the home page as it existed on 2026-05-18
 * (git commit c3a9bb0 — last clean state before the late-May bulk
 * redesign that tanked PageSpeed from ~96 to ~41).
 *
 * Every section component lives under ./_components/sections/ and is a
 * COPY of the May 18 file. Nothing under this folder imports from
 * @/components/sections/* — so future changes to the live home page
 * have ZERO effect on this benchmark.
 *
 * Layout: uses the SHARED root layout's Navigation + SiteWideCTA + Footer
 * (Next.js doesn't allow a nested layout to skip the root). If full
 * Nav/Footer isolation is needed later, restructure with route groups.
 * The May 18 Navigation + Footer snapshots are preserved under
 * ./_components/ as a historical reference for that restructure.
 *
 * Hidden from search engines (noindex/nofollow), not linked from the
 * site navigation. Anyone with the URL can hit /home-3/ directly.
 */

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Pro SWPPP — May 18 Benchmark (/home-3/)',
  description: 'Frozen-in-time benchmark page for PageSpeed comparison.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

// Dynamic imports with ssr:false for framer-motion components — all
// resolve to local snapshots, NOT the live shared components.
const HeroSection         = dynamic(() => import('./_components/sections/HeroSection'),         { ssr: false });
const StatsSection        = dynamic(() => import('./_components/sections/StatsSection'),        { ssr: false });
const TrustBadgesSection  = dynamic(() => import('./_components/sections/TrustBadgesSection'),  { ssr: false });
const ExperienceSection   = dynamic(() => import('./_components/sections/ExperienceSection'),   { ssr: false });
const CEOGuaranteeSection = dynamic(() => import('./_components/sections/CEOGuaranteeSection'), { ssr: false });
const ClientLogosSection  = dynamic(() => import('./_components/sections/ClientLogosSection'),  { ssr: false });
const FinalCTASection     = dynamic(() => import('./_components/sections/FinalCTASection'),     { ssr: false });
const LatestBlogSection   = dynamic(() => import('./_components/sections/LatestBlogSection'),   { ssr: false });
const FAQSection          = dynamic(() => import('./_components/sections/FAQSection'),          { ssr: false });

export default function HomeThreeBenchmarkPage() {
  return (
    <main>
      {/* Hero with rotating Built-for-Builders card (May 18 state) */}
      <HeroSection />

      {/* 20-year stats */}
      <StatsSection />

      {/* Scrolling Google reviews */}
      <TrustBadgesSection />

      {/* Experience copy */}
      <ExperienceSection />

      {/* CEO Guarantee — Derek + blue guarantee panel */}
      <CEOGuaranteeSection />

      {/* Client logos scrolling ticker */}
      <ClientLogosSection />

      {/* Final CTA, latest blog posts, FAQ */}
      <FinalCTASection />
      <LatestBlogSection />
      <FAQSection />
    </main>
  );
}
