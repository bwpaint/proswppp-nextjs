import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getSeoMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/', {
    title: "Pro SWPPP — America's #1 Storm Water Pollution Prevention Plan",
    description:
      "Get your SWPPP in 72 hours or it's FREE. Fast, affordable, and 100% compliant SWPPP solutions nationwide.",
  });
}

// Dynamic imports with ssr:false for framer-motion components.
// Note: TrustBadgesSection (Google reviews) is still rendered INSIDE
// HeroSection itself. ClientLogosSection (the "brands we've worked with"
// ticker) was moved out of the hero and now sits between
// ExperienceSection and CEOGuaranteeSection per owner direction.
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/sections/StatsSection'), { ssr: false });
const ExperienceSection = dynamic(() => import('@/components/sections/ExperienceSection'), { ssr: false });
const ClientLogosSection = dynamic(() => import('@/components/sections/ClientLogosSection'), { ssr: false });
const CEOGuaranteeSection = dynamic(() => import('@/components/sections/CEOGuaranteeSection'), { ssr: false });
const FinalCTASection = dynamic(() => import('@/components/sections/FinalCTASection'), { ssr: false });
// LatestBlogSection is now a Server Component — must NOT be dynamic with
// ssr:false, otherwise the build-time fetch + SSR HTML would be lost.
import LatestBlogSection from '@/components/sections/LatestBlogSection';
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: false });

export default function HomePage() {
  return (
    <main>
      {/* Hero — ends with the trust badges row, then (rendered INSIDE
          the hero) the scrolling Google reviews + scrolling client logos. */}
      <HeroSection />

      {/* 20-year stats (20+ years, 100% compliance, 72 hours, 5-star reviews) */}
      <StatsSection />

      {/* Experience — "Confidence in your SWPPP expertise and compliance" */}
      <ExperienceSection />

      {/* Brands-we've-worked-with ticker — sits between the black
          Experience band and the blue CEO Guarantee section. */}
      <ClientLogosSection />

      {/* CEO Guarantee — Derek photo (white) + blue guarantee panel */}
      <CEOGuaranteeSection />

      {/* Final CTA, latest blog posts, FAQ */}
      <FinalCTASection />
      <LatestBlogSection />
      <FAQSection />
    </main>
  );
}
