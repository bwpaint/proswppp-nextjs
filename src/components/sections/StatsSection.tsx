'use client';
/*
 * Stats Section — ProSWPPP Redesign
 * Design: Dark navy band with large orange stat numbers
 * Editorial design treatment for key metrics
 */

import { motion } from "framer-motion";

const stats = [
  { value: "20+", label: "Years of Experience", suffix: "" },
  { value: "100%", label: "Compliance Record", suffix: "" },
  { value: "72", label: "Hour Delivery Guarantee", suffix: "hrs" },
  { value: "5.0", label: "Google Rating", suffix: "★" },
];

export default function StatsSection() {
  return (
    <section className="pt-28 lg:pt-32 pb-8 lg:pb-10" style={{ background: 'linear-gradient(315deg, #000000 0%, #000000 50%, #000000 100%)' }}>
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="stat-number text-5xl lg:text-6xl mb-2">
                {stat.value}
                {stat.suffix && (
                  <span className="text-3xl lg:text-4xl text-[#6B9ED1]">{stat.suffix}</span>
                )}
              </div>
              <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
