import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SWPPP Documents | Pro SWPPP',
  description: 'Download SWPPP templates, forms, and reference documents for your stormwater compliance needs.',
};

export default function SWPPPDocumentsPage() {
  return (
    <main>
      <section
        className="py-20 lg:py-28"
        style={{ background: '#000000' }}
      >
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p
              className="section-label mb-4"
              style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#EF7C3B' }}
            >
              Resources
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
              SWPPP Documents
            </h1>
            <div
              className="rounded-2xl p-8 lg:p-10"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                Content coming soon. Please check back shortly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
