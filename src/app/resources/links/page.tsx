import type { Metadata } from 'next';
import { ExternalLink, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SWPPP Resources & Regulatory Links | Pro SWPPP',
  description: 'Curated links to EPA, state environmental agencies, permit portals, and SWPPP compliance resources for construction professionals.',
};

const LINK_CATEGORIES = [
  {
    title: 'Federal Regulatory Bodies',
    links: [
      { name: 'EPA NPDES Stormwater Program', desc: 'The primary federal program governing stormwater discharges. Find Construction General Permit info, NOI requirements, and compliance guides.', url: 'https://www.epa.gov/npdes/npdes-stormwater-program' },
      { name: 'EPA eNOI / eReporting System', desc: 'Submit your Notice of Intent electronically to obtain coverage under the federal Construction General Permit.', url: 'https://cdx.epa.gov' },
      { name: 'EPA ECHO — Enforcement & Compliance', desc: 'Search for inspection records, violations, and enforcement actions by facility or location.', url: 'https://echo.epa.gov' },
      { name: 'Army Corps of Engineers — Section 404 Permits', desc: 'Required for construction activities that discharge dredged or fill material into waters of the US.', url: 'https://www.usace.army.mil/Missions/Civil-Works/Regulatory-Program-and-Permits/' },
    ],
  },
  {
    title: 'State Environmental Agencies',
    links: [
      { name: 'Texas — TCEQ Stormwater Program', desc: 'Texas Commission on Environmental Quality. TXR150000 Construction General Permit, NOI filing, and compliance resources.', url: 'https://www.tceq.texas.gov/permitting/stormwater/cgp' },
      { name: 'California — SWRCB SMARTS Portal', desc: 'State Water Resources Control Board. File California construction stormwater permits and manage your SWPPP online.', url: 'https://smarts.waterboards.ca.gov/' },
      { name: 'Florida — FDEP Stormwater Program', desc: 'Florida Department of Environmental Protection. State NPDES permit program for construction stormwater discharges.', url: 'https://floridadep.gov/water/stormwater' },
      { name: 'Nevada — NDEP NPDES Stormwater', desc: 'Nevada Division of Environmental Protection. Construction general permit, NOI requirements, and BMP guidance.', url: 'https://ndep.nv.gov/water/water-quality-planning/stormwater' },
      { name: 'Arizona — ADEQ AZPDES Permit Program', desc: 'Arizona Department of Environmental Quality. AZPDES Construction General Permit and permit application system.', url: 'https://azdeq.gov/node/232' },
      { name: 'Colorado — CDPHE Stormwater Program', desc: 'Colorado Department of Public Health & Environment. NPDES stormwater permits for construction activities statewide.', url: 'https://cdphe.colorado.gov/water-quality/permits/stormwater' },
      { name: 'Georgia — EPD NPDES Permits', desc: 'Georgia Environmental Protection Division. Land disturbance permits and NPDES construction stormwater general permits.', url: 'https://epd.georgia.gov/watershed-protection-branch/npdes-permits' },
    ],
  },
  {
    title: 'Industry Standards & Best Practices',
    links: [
      { name: 'IECA — International Erosion Control Association', desc: 'Professional organization for erosion and sediment control practitioners. Standards, certifications, and technical resources.', url: 'https://www.ieca.org' },
      { name: 'CPESC — Certified Professional in Erosion & Sediment Control', desc: 'Certification board for CPESC credentialing — the industry standard for SWPPP practitioners.', url: 'https://www.cpesc.org' },
      { name: 'CASQA — California Stormwater Quality Association', desc: 'California-specific BMP handbooks, stormwater manuals, and construction site stormwater management resources.', url: 'https://www.casqa.org' },
      { name: 'EPA Construction Site Stormwater Runoff Control', desc: 'EPA\'s technical guidance on construction site BMPs — selecting and maintaining erosion and sediment controls.', url: 'https://www.epa.gov/nps/construction-site-stormwater-runoff-control' },
    ],
  },
  {
    title: 'Reference & Training',
    links: [
      { name: 'EPA NPDES Permit Writers\' Manual', desc: 'Technical reference for understanding how NPDES permits are written, structured, and enforced.', url: 'https://www.epa.gov/npdes/npdes-permit-writers-manual' },
      { name: 'Better Business Bureau — Pro SWPPP LLC', desc: 'Verify Pro SWPPP\'s BBB accreditation and review our business profile.', url: 'https://www.bbb.org/us/tx/kingwood/profile/water-pollution-control/pro-swppp-llc-0915-90073436' },
    ],
  },
];

export default function SWPPPLinksPage() {
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
              Regulatory <span style={{ color: '#EF7C3B' }}>Links</span>
            </h1>
            <p style={{ fontFamily: "'Roboto', Arial, sans-serif", color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Direct links to federal agencies, state environmental departments, permit portals, and professional standards organizations — curated for construction professionals.
            </p>
          </div>
        </div>
      </section>

      {/* Link Categories */}
      <section className="pb-24" style={{ background: '#000000' }}>
        <div className="container">
          <div className="space-y-14 max-w-4xl mx-auto">
            {LINK_CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <h2 className="text-white font-black uppercase mb-6" style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.1rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(239,124,59,0.3)', paddingBottom: '0.75rem' }}>
                  {cat.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cat.links.map((link) => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 rounded-xl p-5 transition-all group" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(239,124,59,0.4)' )}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}>
                      <Globe size={16} style={{ color: '#EF7C3B', flexShrink: 0, marginTop: 3 }} />
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-white font-bold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>{link.name}</span>
                          <ExternalLink size={11} style={{ color: 'rgba(255,255,255,0.3)' }} />
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Roboto', sans-serif" }}>{link.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="max-w-4xl mx-auto mt-16 rounded-2xl p-10 text-center" style={{ background: 'rgba(239,124,59,0.08)', border: '1px solid rgba(239,124,59,0.25)' }}>
            <h2 className="text-white font-black uppercase mb-3" style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}>
              Ready to Get Permitted?
            </h2>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: "'Roboto', sans-serif" }}>
              Let us handle the permits, NOI, and SWPPP plan — fully compliant and delivered in 72 hours.
            </p>
            <a href="/get-your-swppp/" className="inline-block font-black uppercase tracking-wider rounded-full px-8 py-3 transition-all" style={{ background: '#EF7C3B', color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', textDecoration: 'none' }}>
              Get My SWPPP
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
