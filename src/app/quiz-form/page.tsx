import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Reuse the quiz client built for /quiz
const QuizClient = dynamic(() => import('../quiz/QuizClient'), { ssr: false });

export const metadata: Metadata = {
  title: 'Do I Need a SWPPP? | Free Risk Assessment | Pro SWPPP',
  description:
    'Answer 5 quick questions to find out if your construction site needs a SWPPP. Get your free 72-Hour Compliance Roadmap instantly.',
  openGraph: {
    title: 'Do I Need a SWPPP? | Pro SWPPP',
    description: 'Free 2-minute SWPPP risk assessment. Find out if your site needs a SWPPP and get your free compliance roadmap.',
  },
};

export default function QuizFormPage() {
  return (
    <main>
      <QuizClient />
    </main>
  );
}
