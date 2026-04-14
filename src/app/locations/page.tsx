import type { Metadata } from 'next';
import USMapClient from './USMapClient';

export const metadata: Metadata = {
  title: 'SWPPP Services by Location | Pro SWPPP',
  description:
    'Find SWPPP services for your state. Pro SWPPP delivers fully compliant stormwater plans in 72 hours across the United States.',
};

export const dynamic = 'force-dynamic';

const SCL_BASE =
  process.env.SCL_API_BASE ?? 'https://cms.proswppp.com/wp-json/swppp-loc/v1';
const REVALIDATE = { cache: 'no-store' as const };

interface StateItem {
  id: number;
  name: string;
  slug: string;
  abbreviation: string;
}

async function getLiveStates(): Promise<StateItem[]> {
  try {
    const res = await fetch(`${SCL_BASE}/states`, REVALIDATE);
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function LocationsPage() {
  const liveStates = await getLiveStates();

  return (
    <main style={{ background: '#000000' }}>
      {/* Hero */}
      <section className="py-20" style={{ background: '#000000' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="section-label mb-4"
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontWeight: 900,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#EF7C3B',
              }}
            >
              Where We Serve
            </p>
            <h1
              className="text-white uppercase leading-none mb-6"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              SWPPP Services{' '}
              <span style={{ color: '#EF7C3B' }}>By Location</span>
            </h1>
            <p
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1.125rem',
                lineHeight: 1.7,
              }}
            >
              Fully compliant stormwater pollution prevention plans delivered in
              72 hours. Select your state below to find SWPPP services near you.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="pb-20" style={{ background: '#000000' }}>
        <USMapClient liveStates={liveStates} />
      </section>
    </main>
  );
}
