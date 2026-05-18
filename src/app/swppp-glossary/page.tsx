import type { Metadata } from 'next';
import GlossaryClient from './GlossaryClient';
import { getSeoMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return getSeoMetadata('/swppp-glossary/', {
    title: 'SWPPP Glossary — Stormwater Compliance Terms | Pro SWPPP',
    description:
      'A comprehensive reference of SWPPP, NPDES, BMP, and stormwater compliance terminology. Search definitions for every term used in construction stormwater permits.',
    openGraph: {
      title: 'SWPPP Glossary — Stormwater Compliance Terms | Pro SWPPP',
      description:
        'Search definitions for SWPPP, NPDES, BMP, CGP, and every other stormwater compliance term.',
    },
  });
}

export default function SWPPPGlossaryPage() {
  return (
    <main>
      <GlossaryClient />
    </main>
  );
}
