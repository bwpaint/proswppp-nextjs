import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPageClient from './CityPageClient';

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

interface CityData {
  id: number;
  name: string;
  slug: string;
  summary: string;
  county: { id: number; name: string; slug: string };
  state: { id: number; name: string; slug: string; abbreviation: string };
  files: FileItem[];
}

async function getCity(
  stateSlug: string,
  countySlug: string,
  citySlug: string
): Promise<CityData | null> {
  try {
    const res = await fetch(
      `${SCL_BASE}/states/${stateSlug}/counties/${countySlug}/cities/${citySlug}`,
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
  params: { stateSlug: string; countySlug: string; citySlug: string };
}): Promise<Metadata> {
  const city = await getCity(params.stateSlug, params.countySlug, params.citySlug);
  if (!city) return { title: 'City Not Found | Pro SWPPP' };

  const desc = city.summary
    ? city.summary.replace(/<[^>]*>/g, '').slice(0, 155).trim()
    : `SWPPP services for ${city.name}, ${city.state.name}. Get a fully compliant stormwater pollution prevention plan in 72 hours.`;

  return {
    title: `${city.name}, ${city.state.abbreviation} SWPPP Services | Pro SWPPP`,
    description: desc,
    openGraph: {
      title: `${city.name} SWPPP Services | Pro SWPPP`,
      description: desc,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: { stateSlug: string; countySlug: string; citySlug: string };
}) {
  const city = await getCity(params.stateSlug, params.countySlug, params.citySlug);
  if (!city) notFound();

  return (
    <main style={{ background: '#000000' }}>
      <CityPageClient city={city} />
    </main>
  );
}
