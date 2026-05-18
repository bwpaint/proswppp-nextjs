import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getSeoMetadata } from '@/lib/seo';

const AboutHero = dynamic(() => import('./AboutClient'), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/about/', {
    title: "About Us | Pro SWPPP — America's #1 SWPPP Service",
    description:
      "20+ years of exclusive SWPPP expertise. Zero compliance issues. Woman-owned business dedicated to fast, accurate stormwater compliance nationwide.",
    openGraph: {
      title: 'About Us | Pro SWPPP',
      description:
        "20+ years of exclusive SWPPP expertise. Zero compliance issues. Fast, affordable, and 100% compliant.",
    },
  });
}

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
    </main>
  );
}
