import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getSeoMetadata } from '@/lib/seo';

/**
 * /get-your-swppp — Map-first SWPPP order flow
 *
 * Server component wrapper — dynamically imports the heavy client component
 * with ssr:false so the SVG map + interactive wizard only run in the browser.
 */

const GetYourSwpppClient = dynamic(
  () => import('./GetYourSwpppClient'),
  { ssr: false }
);

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/get-your-swppp/', {
    title: 'Order Your SWPPP — 72-Hour Delivery Guaranteed | Pro SWPPP',
    description:
      'Order your site-specific SWPPP online. Fully compliant stormwater pollution prevention plans delivered in 72 hours — or it’s FREE.',
    openGraph: {
      title: 'Order Your SWPPP | Pro SWPPP',
      description:
        'Fully compliant SWPPP delivered in 72 hours. Trusted by construction professionals nationwide.',
    },
  });
}

export default function GetYourSwpppPage() {
  return <GetYourSwpppClient />;
}
