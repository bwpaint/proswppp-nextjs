/**
 * /home-2/  — HIDDEN benchmark page
 *
 * Identical to the production home page except the Hero is the legacy
 * pre-rotating-card version (contact form on the right). Used for Google
 * PageSpeed comparison against the current /home/ Hero. NOT linked from
 * the nav, footer, or sitemap. Marked noindex/nofollow so search engines
 * skip it.
 */

import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Hide from search engines. Anyone who has the URL can still hit it directly.
export const metadata: Metadata = {
  title: 'Pro SWPPP — Hero v1 (Benchmark)',
  description: 'Hidden benchmark page for performance comparison.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

// Legacy hero — the pre-rotation-card version with the contact form on the right.
const HeroSection = dynamic(() => import('./HeroSectionLegacy'), { ssr: false });

// All other sections are identical to the live home page.
const TrustBadgesSection  = dynamic(() => import('@/components/sections/TrustBadgesSection'),  { ssr: false });
const StatsSection        = dynamic(() => import('@/components/sections/StatsSection'),        { ssr: false });
const ExperienceSection   = dynamic(() => import('@/components/sections/ExperienceSection'),   { ssr: false });
const CEOGuaranteeSection = dynamic(() => import('@/components/sections/CEOGuaranteeSection'), { ssr: false });
const ClientLogosSection  = dynamic(() => import('@/components/sections/ClientLogosSection'),  { ssr: false });
const FinalCTASection     = dynamic(() => import('@/components/sections/FinalCTASection'),     { ssr: false });
const LatestBlogSection   = dynamic(() => import('@/components/sections/LatestBlogSection'),   { ssr: false });
const FAQSection          = dynamic(() => import('@/components/sections/FAQSection'),          { ssr: false });
const WhoWeAreSection     = dynamic(() => import('@/components/sections/WhoWeAreSection'),     { ssr: false });

export default function HomePageV1() {
  return (
    <main>
      <HeroSection />
      <TrustBadgesSection />
      <WhoWeAreSection />
      <ClientLogosSection />
      <StatsSection />
      <ExperienceSection />
      <CEOGuaranteeSection />
      <FinalCTASection />
      <LatestBlogSection />
      <FAQSection />
    </main>
  );
}
