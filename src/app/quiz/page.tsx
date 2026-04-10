import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const QuizClient = dynamic(() => import('./QuizClient'), { ssr: false });

export const metadata: Metadata = {
  title: 'SWPPP Risk Assessment Quiz | Pro SWPPP',
  description:
    'Find out in 2 minutes if your construction site needs a SWPPP. Get your personalized 72-Hour Compliance Roadmap - free.',
  openGraph: {
    title: 'SWPPP Risk Assessment Quiz | Pro SWPPP',
    description: 'Find out if your construction site needs a SWPPP. Get your free compliance roadmap.',
  },
};

export default function QuizPage() {
  return (
    <main>
      <QuizClient />
    </main>
  );
}
