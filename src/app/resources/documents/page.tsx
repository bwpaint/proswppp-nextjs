import type { Metadata } from 'next';
import { FileText, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SWPPP Documents & Templates | Pro SWPPP',
  description: 'Download SWPPP templates, permit forms, NOI checklists, and reference documents for your stormwater compliance needs.',
};

const CATEGORIES = [
  {
    title: 'Federal Forms & Permits',
    docs: [
      { name: 'EPA Construction General Permit (CGP)', desc: 'The baseline federal permit for stormwater discharges from construction activity. Required for sites disturbing 1+ acres.', url: 'https://www.epa.gov/npdes/npdes-stormwater-program', external: true },
      { name: 'Notice of Intent (NOI) — EPA eNOI System', desc: 'Submit your NOI electronically through the EPA\'s NPDES eReporting system to obtain coverage under the CGP.', url: 'https://cdx.epa.gov/CDX/Login', external: true },
      { name: 'Notice of Termination (NOT)', desc: 'Required when construction is complete and the site has achieved final stabilization. File to terminate CGP permit coverage.', url: 'https://www.epa.gov/npdes/stormwater-discharges-construction-activities', external: true },
    ],
  },
  {
    title: 'SWPPP Plan Components',
    docs: [
      { name: 'Site Map Requirements Checklist', desc: 'Complete checklist of what must appear on your SWPPP site map: drainage patterns, BMP locations, impervious surfaces, and discharge points.', url: null, external: false },
      { name: 'BMP Selection Guide', desc: 'Best Management Practice selection matrix — match your site conditions to the correct erosion and sediment controls.', url: null, external: false },
      { name: 'SWPPP Inspection Log Template', desc: 'Standardized inspection log for documenting required stormwater inspections throughout the construction period.', url: null, external: false },
      { name: 'Corrective Action Log', desc: 'Document BMPs that need repair or replacement and track corrective actions to maintain permit compliance.', url: null, external: false },
    ],
  },
  {
    title: 'State Regulatory Agencies',
    docs: [
      { name: 'Texas — TCEQ (TXR150000 Permit)', desc: 'Texas Commission on Environmental Quality — Construction General Permit and NOI portal for Texas projects.', url: 'https://www.tceq.texas.gov/permitting/stormwater/cgp', external: true },
      { name: 'California — SWRCB SMARTS Portal', desc: 'California State Water Resources Control Board — Stormwater Multiple Application and Report Tracking System for CA permits.', url: 'https://smarts.waterboards.ca.gov/', external: true },
      { name: 'Florida — FDEP Business Portal', desc: 'Florida DEP online portal for stormwater permit applications, NOI submissions, and permit management.', url: 'https://floridadep.gov/water/stormwater', external: true },
      { name: 'Nevada — NDEP NPDES Program', desc: 'Nevada Division of Environmental Protection — stormwater permit applications and construction general permit information.', url: 'https://ndep.nv.gov/water/water-quality-planning/stormwater', external: true },
      { name: 'Arizona — ADEQ Permit Portal', desc: 'Arizona Department of Environmental Quality — construction stormwater general permit (AZPDES CGP) and NOI filing.', url: 'https://azdeq.gov/node/232', external: true },
      { name: 'Colorado — CDPHE NPDES Portal', desc: 'Colorado Department of Public Health and Environment — stormwater permit program and construction permit applications.', url: 'https://cdphe.colorado.gov/water-quality/permits/stormwater', external: true },
      { name: 'Georgia — EPD NPDES Program', desc: 'Georgia Environmental Protection Division — land disturbance activity permits and NPDES stormwater general permits.', url: 'https://epd.georgia.gov/watershed-protection-branch/npdes-permits', external: true },
    ],
  },
];

export default function SWPPPDocumentsPage() {
  return (
    <main style={{ background: '#000000' }}>
      {/* Hero */}
      <section className="py-20 lg:py-24" style={{ background: '#000000' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="section-label mb-4" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#EF7C3B' }}>
              Resources
            </p>
            <h1 className="text-white uppercase leading-none mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 900, letterSpacing: '-0.03em' }}>
              SWPPP <span style={{ color: '#EF7C3B' }}>Documents</span>
            </h1>
            <p style={{ fontFamily: "'Roboto', Arial, sans-serif", color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Federal forms, state permit portals, plan templates, and inspection logs — everything you need for stormwater compliance in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Document Categories */}
      <section className="pb-24" style={{ background: '#000000' }}>
        <div className="container">
          <div className="space-y-14 max-w-4xl mx-auto">
            {CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <h2 className="text-white font-black uppercase mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(239,124,59,0.3)', paddingBottom: '0.75rem' }}>
                  {cat.title}
                </h2>
                <div className="space-y-3">
                  {cat.docs.map((doc) => (
                    <div key={doc.name} className="flex items-start gap-4 rounded-xl p-5 transition-all" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <FileText size={18} style={{ color: '#EF7C3B', flexShrink: 0, marginTop: 2 }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{doc.name}</span>
                          {doc.external && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,124,59,0.15)', color: '#EF7C3B', fontFamily: "'Roboto', sans-serif" }}>External</span>}
                          {!doc.url && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontFamily: "'Roboto', sans-serif" }}>Contact Us</span>}
                        </div>
                        <p className="text-sm mb-2" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Roboto', sans-serif", lineHeight: 1.6 }}>{doc.desc}</p>
                        {doc.url && (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: '#EF7C3B', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}>
                            Visit Portal <ExternalLink size={11} />
                          </a>
                        )}
                        {!doc.url && (
                          <a href="/get-your-swppp/" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: '#EF7C3B', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}>
                            Get This With Your SWPPP →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
