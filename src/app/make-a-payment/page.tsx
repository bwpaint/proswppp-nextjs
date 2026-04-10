import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const PaymentClient = dynamic(() => import('./PaymentClient'), { ssr: false });

export const metadata: Metadata = {
  title: 'Make a Payment | Pro SWPPP',
  description:
    'Securely pay for your SWPPP services online. Fast, easy payment options for Pro SWPPP customers.',
  openGraph: {
    title: 'Make a Payment | Pro SWPPP',
    description: 'Securely pay for your SWPPP services online.',
  },
};

export default function MakeAPaymentPage() {
  return (
    <main>
      <PaymentClient />
    </main>
  );
}
