import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const AboutHero = dynamic(() => import('./AboutClient'), { ssr: false });

export const metadata: Metadata = {
  title: "About Us | Pro SWPPP — America's #1 SWPPP Service",
  description:
    "17 years of exclusive SWPPP expertise. Zero compliance issues. Woman-owned business dedicated to fast, accurate stormwater compliance nationwide.",
  openGraph: {
    title: "About Us | Pro SWPPP",
    description: "17 years of exclusive SWPPP expertise. Zero compliance issues. Fast, affordable, and 100% compliant.",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
    </main>
  );
}
