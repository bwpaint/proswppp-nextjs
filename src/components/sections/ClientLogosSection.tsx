'use client';
/*
 * Find Us On + Client Logos Section — ProSWPPP Redesign
 * Design: Orange "Find Us On" section with BBB badge
 * Then white "Who We've Worked With" with scrolling logo ticker
 */

import { motion } from "framer-motion";

const clientLogos = [
  { name: "Buffalo Building Better", abbr: "BUFFALO" },
  { name: "CBI", abbr: "CBI" },
  { name: "Holland Built on Integrity", abbr: "HOLLAND" },
  { name: "Joeris", abbr: "JOERIS" },
  { name: "MBC General Contractors", abbr: "MBC" },
  { name: "Rycon Construction Inc.", abbr: "RYCON" },
  { name: "Satterfield & Pontikes", abbr: "S&P" },
];

export default function ClientLogosSection() {
  return (
    <>
      {/* Find Us On */}
      <section className="bg-[#EF7C3B] py-12 lg:py-14">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-heading text-white text-2xl lg:text-3xl mb-8">
              Find Us On…
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {/* BBB Badge */}
              <div className="bg-white rounded-xl px-6 py-4 flex items-center gap-4 shadow-md">
                <div className="text-center">
                  <p className="font-bold text-[#003087] text-lg leading-none">BBB</p>
                  <p className="text-xs text-gray-500">Accredited</p>
                  <p className="text-xs text-gray-500">Business</p>
                </div>
                <div className="border-l pl-4">
                  <p className="font-bold text-[#1A3A4A] text-sm">BBB Rating: A+</p>
                  <p className="text-xs text-gray-500">Click for Profile</p>
                </div>
              </div>

              {/* Procore Badge */}
              <div className="bg-white rounded-xl px-6 py-4 shadow-md">
                <img
                  src="https://www.procore.com/network/assets/static/procore-black-badge.svg"
                  alt="Procore Network Badge"
                  className="h-12 w-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="bg-white py-14 lg:py-16">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-heading text-[#1A3A4A] text-2xl lg:text-3xl text-center mb-10"
          >
            Who We've Worked With
          </motion.h2>

          {/* Scrolling ticker */}
          <div className="overflow-hidden">
            <div className="ticker-track flex gap-12 items-center">
              {[...clientLogos, ...clientLogos].map((logo, i) => (
                <div
                  key={`${logo.abbr}-${i}`}
                  className="flex-shrink-0 bg-gray-50 border border-gray-200 rounded-xl px-8 py-4 min-w-[140px] text-center hover:border-[#EF7C3B] transition-colors"
                >
                  <p className="font-bold text-[#1A3A4A] text-sm uppercase tracking-wide whitespace-nowrap">
                    {logo.abbr}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 whitespace-nowrap">{logo.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
