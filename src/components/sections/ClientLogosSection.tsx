'use client';
/*
 * Find Us On + Client Logos Section — ProSWPPP Redesign
 * Design: Orange "Find Us On" section with BBB badge
 * Then white "Who We've Worked With" with scrolling logo ticker
 */

import { motion } from "framer-motion";

const clientLogos = [
  { name: "Buffalo Construction", img: "https://proswppp.com/wp-content/uploads/2025/03/Buffalo-Construction-logo.jpg" },
  { name: "CBI General Contractors", img: "https://proswppp.com/wp-content/uploads/2025/03/CBI-General-Contractors-logo.jpg" },
  { name: "Holland Construction", img: "https://proswppp.com/wp-content/uploads/2025/03/Holland-Construction-logo.jpg" },
  { name: "Joeris General Contractors", img: "https://proswppp.com/wp-content/uploads/2025/03/Joeris-General-Contractors-logo.jpg" },
  { name: "MEC General Contractors", img: "https://proswppp.com/wp-content/uploads/2025/03/MEC-General-Contractors-logo.jpg" },
  { name: "Rycon Construction", img: "https://proswppp.com/wp-content/uploads/2025/03/Rycon-Construction-logo.jpg" },
  { name: "Satterfield & Pontikes", img: "https://proswppp.com/wp-content/uploads/2025/03/Satterfield-and-Pontikes-Construction-Inc-logo.jpg" },
  { name: "The MAPP Group", img: "https://proswppp.com/wp-content/uploads/2025/03/The-MAPP-Group-logo.jpg" },
  { name: "Triad Construction", img: "https://proswppp.com/wp-content/uploads/2025/03/Triad-Construction-Inc-logo.jpg" },
  { name: "Westmoreland Builders", img: "https://proswppp.com/wp-content/uploads/2025/03/Westmoreland-Builders-logo.jpg" },
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
      <section className="py-14 lg:py-16" style={{ background: 'linear-gradient(135deg, #0D1F2B 0%, #1A3A4A 50%, #0D1F2B 100%)' }}>
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-heading text-[#EF7C3B] text-2xl lg:text-3xl text-center mb-10"
          >
            Who We Work With
          </motion.h2>

          {/* Scrolling ticker with feathered edges */}
          <div className="overflow-hidden" style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
          }}>
            <div className="ticker-track flex gap-10 items-center">
              {[...clientLogos, ...clientLogos].map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex-shrink-0 bg-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-lg"
                  style={{ width: '160px', height: '80px', padding: '12px 20px', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <img
                    src={logo.img}
                    alt={logo.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span style="font-family:'Inter',sans-serif;font-weight:700;font-size:0.75rem;color:#1A3A4A;text-align:center;padding:0 8px;">${logo.name}</span>`;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
