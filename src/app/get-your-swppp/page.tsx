import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const GetYourSwpppClient = dynamic(() => import('./GetYourSwpppClient'), { ssr: false });

export const metadata: Metadata = {
  title: "Get Your SWPPP | Pro SWPPP — Delivered in 72 Hours or FREE",
  description:
    "Order your Storm Water Pollution Prevention Plan today. Delivered in 72 hours or it's FREE. Fast, affordable, and 100% compliant. Start with a free estimate.",
  openGraph: {
    title: "Get Your SWPPP | Pro SWPPP",
    description: "Order your SWPPP today. Delivered in 72 hours or it's FREE.",
  },
};

export default function GetYourSwpppPage() {
  return (
    <main>
      <GetYourSwpppClient />
    </main>
  );
}
