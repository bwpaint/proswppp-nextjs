'use client';
/*
 * SWPPP Glossary — /swppp-glossary/
 * Design: Dark background matching site theme, clean typography, alphabetical glossary with live search
 * Font: Inter (headings) + Roboto (body) — matches brand system
 */

import { useState } from 'react';
import { Search } from 'lucide-react';

const GLOSSARY_TERMS = [
  {
    term: 'SWPPP',
    full: 'Stormwater Pollution Prevention Plan',
    definition:
      'A site-specific document required for construction or industrial sites that disturb one or more acres of land. It identifies potential pollutant sources and outlines Best Management Practices (BMPs) to prevent stormwater contamination.',
  },
  {
    term: 'BMP',
    full: 'Best Management Practice',
    definition:
      'Structural, non-structural, or managerial techniques used to prevent or reduce the discharge of pollutants to stormwater. Examples include silt fences, sediment basins, inlet protection, and stabilized construction entrances.',
  },
  {
    term: 'NPDES',
    full: 'National Pollutant Discharge Elimination System',
    definition:
      'A federal permit program under the Clean Water Act that controls water pollution by regulating point sources that discharge pollutants into waters of the United States. Construction sites disturbing 1+ acres must obtain an NPDES permit.',
  },
  {
    term: 'CGP',
    full: 'Construction General Permit',
    definition:
      'An NPDES permit issued by the EPA or a state environmental agency that authorizes stormwater discharges from construction activities. Operators must file a Notice of Intent (NOI) and develop a SWPPP before coverage begins.',
  },
  {
    term: 'NOI',
    full: 'Notice of Intent',
    definition:
      'A document submitted to the permitting authority (EPA or state agency) to obtain coverage under the Construction General Permit. It notifies regulators of the site location, operator information, and planned construction activities.',
  },
  {
    term: 'NOT',
    full: 'Notice of Termination',
    definition:
      'A document submitted to terminate NPDES permit coverage when construction is complete, the site has been stabilized, and all stormwater controls have been removed or transferred.',
  },
  {
    term: 'Erosion Control',
    full: '',
    definition:
      'Practices that prevent soil particles from being detached and transported by water or wind. Common erosion controls include hydroseeding, erosion control blankets, and slope stabilization.',
  },
  {
    term: 'Sediment Control',
    full: '',
    definition:
      'Practices designed to capture soil particles that have already been detached and are being transported by stormwater runoff. Examples include silt fences, sediment traps, and fiber rolls.',
  },
  {
    term: 'Impervious Surface',
    full: '',
    definition:
      'Any surface that prevents or significantly reduces the infiltration of water into the ground. Examples include pavement, rooftops, and compacted gravel. Impervious surfaces increase stormwater runoff volume and velocity.',
  },
  {
    term: 'Land Disturbance',
    full: '',
    definition:
      'Any activity that removes vegetative cover, exposes soil, or alters the topography of a site. Land disturbance of one or more acres typically triggers NPDES permit requirements.',
  },
  {
    term: 'Stormwater Runoff',
    full: '',
    definition:
      'Water from rain or snowmelt that flows over land surfaces and into storm drains, streams, rivers, or other water bodies. Construction sites are a significant source of stormwater pollution due to exposed soils.',
  },
  {
    term: 'Qualified SWPPP Developer (QSD)',
    full: '',
    definition:
      'A certified professional authorized to prepare, certify, and amend SWPPPs in states like California. QSD certification is typically held by licensed engineers, geologists, or landscape architects with stormwater training.',
  },
  {
    term: 'Qualified SWPPP Practitioner (QSP)',
    full: '',
    definition:
      'A certified professional authorized to implement and oversee a SWPPP during construction in California. QSPs conduct inspections, maintain records, and ensure BMPs are properly installed and functioning.',
  },
  {
    term: 'TPDES',
    full: 'Texas Pollutant Discharge Elimination System',
    definition:
      "Texas's state-administered NPDES program, managed by the Texas Commission on Environmental Quality (TCEQ). Construction sites in Texas must obtain a TPDES Construction General Permit (TXR150000).",
  },
  {
    term: 'WPCP',
    full: 'Water Pollution Control Program',
    definition:
      'A stormwater management document required for certain California Department of Transportation (Caltrans) and local agency projects. Similar in purpose to a SWPPP but tailored to linear infrastructure projects.',
  },
  {
    term: 'Turbidity',
    full: '',
    definition:
      'A measure of water clarity, indicating the amount of suspended particles. High turbidity in stormwater discharge is a common violation indicator and is regulated under many NPDES permits.',
  },
  {
    term: 'Stabilization',
    full: '',
    definition:
      'The process of establishing permanent or temporary vegetative cover, mulching, or other measures to prevent erosion on disturbed areas. Final stabilization is required before NPDES permit coverage can be terminated.',
  },
  {
    term: 'Inspection Report',
    full: '',
    definition:
      'A documented record of a site inspection conducted by a qualified person to assess the effectiveness of BMPs, identify areas of non-compliance, and document corrective actions. Required at regular intervals under most NPDES permits.',
  },
  {
    term: 'Waters of the United States (WOTUS)',
    full: '',
    definition:
      'A legal term defining which water bodies are subject to federal jurisdiction under the Clean Water Act. Includes navigable waters, tributaries, and adjacent wetlands. Discharging pollutants to WOTUS without a permit is a federal violation.',
  },
  {
    term: 'Annual Report',
    full: '',
    definition:
      'A periodic compliance report required under some state NPDES permits (notably California\'s Industrial General Permit) summarizing BMP performance, inspection findings, and any corrective actions taken during the reporting year.',
  },
];

export default function GlossaryClient() {
  const [search, setSearch] = useState('');

  const filtered = GLOSSARY_TERMS.filter(
    (t) =>
      t.term.toLowerCase().includes(search.toLowerCase()) ||
      t.full.toLowerCase().includes(search.toLowerCase()) ||
      t.definition.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce<Record<string, typeof GLOSSARY_TERMS>>((acc, term) => {
    const letter = term.term[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(term);
    return acc;
  }, {});

  const letters = Object.keys(grouped).sort();

  return (
    <div
      className="min-h-screen"
      style={{ background: '#000000' }}
    >
      {/* Hero header */}
      <div className="py-16 lg:py-20" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <p
            className="text-[#DE863F] uppercase tracking-widest text-sm mb-3"
            style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400, letterSpacing: '0.2em' }}
          >
            Reference Guide
          </p>
          <h1
            className="text-white uppercase leading-none mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.03em',
            }}
          >
            SWPPP <span style={{ color: '#DE863F' }}>Glossary</span>
          </h1>
          <p
            className="text-gray-400 max-w-2xl"
            style={{ fontFamily: "'Roboto', Arial, sans-serif", fontSize: '1rem', lineHeight: '1.7' }}
          >
            A comprehensive reference of stormwater compliance terminology — from NPDES permits to BMP
            definitions. Use the search below to find any term quickly.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-lg">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search terms, acronyms, or definitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                fontFamily: "'Roboto', Arial, sans-serif",
              }}
            />
          </div>
        </div>
      </div>

      {/* Glossary content */}
      <div className="container py-12 lg:py-16">
        {letters.length === 0 ? (
          <p
            className="text-gray-400 text-center py-16"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            No terms found matching &ldquo;{search}&rdquo;.
          </p>
        ) : (
          <div className="space-y-12">
            {letters.map((letter) => (
              <div key={letter}>
                <div
                  className="flex items-center gap-4 mb-6"
                  style={{ borderBottom: '2px solid rgba(222,134,63,0.3)', paddingBottom: '0.5rem' }}
                >
                  <span
                    className="text-[#DE863F]"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontWeight: 900,
                      fontSize: '2rem',
                      lineHeight: 1,
                    }}
                  >
                    {letter}
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {grouped[letter].map((item) => (
                    <div
                      key={item.term}
                      className="rounded-xl p-5 transition-all duration-200 hover:border-[#DE863F]/40"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className="mb-2">
                        <h3
                          className="text-white"
                          style={{
                            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontWeight: 700,
                            fontSize: '1rem',
                          }}
                        >
                          {item.term}
                        </h3>
                        {item.full && (
                          <p
                            className="text-[#DE863F] text-xs mt-0.5"
                            style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400 }}
                          >
                            {item.full}
                          </p>
                        )}
                      </div>
                      <p
                        className="text-gray-400 text-sm leading-relaxed"
                        style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
                      >
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
