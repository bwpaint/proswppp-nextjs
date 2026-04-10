import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StatePageClient from './StatePageClient';

const SCL_BASE =
  process.env.SCL_API_BASE ?? 'https://cms.proswppp.com/wp-json/swppp-loc/v1';
const REVALIDATE = { next: { revalidate: 3600 } };

interface StateData {
  id: number;
  name: string;
  slug: string;
  abbreviation: string;
  summary: string;
  counties: { id: number; name: string; slug: string }[];
  files: { id: number; display_name: string; file_url: string; file_type: string; level: string }[];
}

async function getState(stateSlug: string): Promise<StateData | null> {
  try {
    const res = await fetch(`${SCL_BASE}/states/${stateSlug}`, REVALIDATE);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { stateSlug: string };
}): Promise<Metadata> {
  const state = await getState(params.stateSlug);
  if (!state) {
    return { title: 'State Not Found | Pro SWPPP' };
  }
  const desc = state.summary
    ? state.summary.replace(/<[^>]*>/g, '').slice(0, 155).trim()
    : `Get a fully compliant SWPPP in 72 hours for ${state.name} construction projects. Pro SWPPP serves all counties across ${state.name}.`;

  return {
    title: `${state.name} SWPPP Services | Pro SWPPP`,
    description: desc,
    openGraph: {
      title: `${state.name} SWPPP Services | Pro SWPPP`,
      description: desc,
    },
  };
}

export default async function StatePage({
  params,
}: {
  params: { stateSlug: string };
}) {
  const state = await getState(params.stateSlug);
  if (!state) notFound();

  return (
    <main style={{ background: '#000000' }}>
      <StatePageClient state={state} />
    </main>
  );
}
