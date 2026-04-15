import dynamic from 'next/dynamic';

// Dynamic imports with ssr:false for framer-motion components
const HeroSection = dynamic(() => import('@/components/sections/HeroSection'), { ssr: false });
const TrustBadgesSection = dynamic(() => import('@/components/sections/TrustBadgesSection'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/sections/StatsSection'), { ssr: false });
const FeaturesShowcaseSection = dynamic(() => import('@/components/sections/FeaturesShowcaseSection'), { ssr: false });
const WhyChooseSection = dynamic(() => import('@/components/sections/WhyChooseSection'), { ssr: false });
const SocialProofSection = dynamic(() => import('@/components/sections/SocialProofSection'), { ssr: false });
const ExperienceSection = dynamic(() => import('@/components/sections/ExperienceSection'), { ssr: false });
const CEOGuaranteeSection = dynamic(() => import('@/components/sections/CEOGuaranteeSection'), { ssr: false });
const ClientLogosSection = dynamic(() => import('@/components/sections/ClientLogosSection'), { ssr: false });
const QuizCTASection = dynamic(() => import('@/components/sections/QuizCTASection'), { ssr: false });
const FinalCTASection = dynamic(() => import('@/components/sections/FinalCTASection'), { ssr: false });
const LatestBlogSection = dynamic(() => import('@/components/sections/LatestBlogSection'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/sections/FAQSection'), { ssr: false });
const WhoWeAreSection = dynamic(() => import('@/components/sections/WhoWeAreSection'), { ssr: false });

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBadgesSection />
      <WhoWeAreSection />
      <StatsSection />
      <FeaturesShowcaseSection />
      <WhyChooseSection />
      <SocialProofSection />
      <ExperienceSection />
      <CEOGuaranteeSection />
      <ClientLogosSection />
      <QuizCTASection />
      <FinalCTASection />
      <LatestBlogSection />
      <FAQSection />
    </main>
  );
}
