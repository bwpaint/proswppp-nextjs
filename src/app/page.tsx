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

// Dynamic imports with ssr:false for framer-motion components
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), { ssr: false });
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/sections/StatsSection'), { ssr: false });
const TrustBadgesSection = dynamic(() => import('@/components/sections/TrustBadgesSection'), { ssr: false });
const ExperienceSection = dynamic(() => import('@/components/sections/ExperienceSection'), { ssr: false });
const CEOGuaranteeSection = dynamic(() => import('@/components/sections/CEOGuaranteeSection'), { ssr: false });
const ClientLogosSection = dynamic(() => import('@/components/sections/ClientLogosSection'), { ssr: false });
const FinalCTASection = dynamic(() => import('@/components/sections/FinalCTASection'), { ssr: false });
const LatestBlogSection = dynamic(() => import('@/components/sections/LatestBlogSection'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: false });

export default function HomePage() {
  return (
    <main>
      {/* Hero with rotating Built-for-Builders card */}
      <HeroSection />

      {/* How It Works — 4-step process, guarantee callout, CTA */}
      <HowItWorksSection />

      {/* 20-year stats (20+ years, 100% compliance, 72 hours, 5-star reviews) */}
      <StatsSection />

      {/* Scrolling Google reviews with "What Our Customers Are Saying" heading
          (formerly the "Client Reviews" section — TrustBadgesSection is the
          file name kept for compatibility, but its content is the reviews
          ticker). Sits between the stat tiles and the Experience copy. */}
      <TrustBadgesSection />

      {/* Experience — "Confidence in your SWPPP expertise and compliance" */}
      <ExperienceSection />

      {/* CEO Guarantee — Derek photo (white) + blue guarantee panel */}
      <CEOGuaranteeSection />

      {/* Client logos scrolling ticker — relocated to sit between the
          CEO Guarantee panel and the "72 hours or it's FREE" CTA. */}
      <ClientLogosSection />

      {/* Final CTA, latest blog posts, FAQ */}
      <FinalCTASection />
      <LatestBlogSection />
      <FAQSection />
    </main>
  );
}
