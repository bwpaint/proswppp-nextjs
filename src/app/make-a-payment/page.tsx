import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { getSeoMetadata } from '@/lib/seo';

const PaymentClient = dynamic(() => import('./PaymentClient'), { ssr: false });

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/make-a-payment/', {
    title: 'Make a Payment | Pro SWPPP',
    description:
      'Securely pay for your SWPPP services online. Fast, easy payment options for Pro SWPPP customers.',
    openGraph: {
      title: 'Make a Payment | Pro SWPPP',
      description: 'Securely pay for your SWPPP services online.',
    },
  });
}

export default function MakeAPaymentPage() {
  return (
    <main>
      <PaymentClient />
    </main>
  );
}
