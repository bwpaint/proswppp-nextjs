import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CountyPageClient from './CountyPageClient';

const SCL_BASE =
  process.env.SCL_API_BASE ?? 'https://cms.proswppp.com/wp-json/swppp-loc/v1';
const REVALIDATE = { next: { revalidate: 3600 } };

interface FileItem {
  id: number;
  display_name: string;
  file_url: string;
  file_type: string;
  level: string;
}

interface CountyData {
  id: number;
  name: string;
  slug: string;
  summary: string;
  state: { id: number; name: string; slug: string; abbreviation: string };
  cities: { id: number; name: string; slug: string }[];
  files: FileItem[];
}

async function getCounty(
  stateSlug: string,
  countySlug: string
): Promise<CountyData | null> {
  try {
    const res = await fetch(
      `${SCL_BASE}/states/${stateSlug}/counties/${countySlug}`,
      REVALIDATE
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { stateSlug: string; countySlug: string };
}): Promise<Metadata> {
  const county = await getCounty(params.stateSlug, params.countySlug);
  if (!county) return { title: 'County Not Found | Pro SWPPP' };

  const desc = county.summary
    ? county.summary.replace(/<[^>]*>/g, '').slice(0, 155).trim()
    : `SWPPP services for ${county.name} County, ${county.state.name}. Get a fully compliant stormwater plan in 72 hours.`;

  return {
    title: `${county.name} County, ${county.state.abbreviation} SWPPP Services | Pro SWPPP`,
    description: desc,
    openGraph: {
      title: `${county.name} County SWPPP Services | Pro SWPPP`,
      description: desc,
    },
  };
}

export default async function CountyPage({
  params,
}: {
  params: { stateSlug: string; countySlug: string };
}) {
  const county = await getCounty(params.stateSlug, params.countySlug);
  if (!county) notFound();

  return (
    <main style={{ background: '#000000' }}>
      <CountyPageClient county={county} />
    </main>
  );
}
