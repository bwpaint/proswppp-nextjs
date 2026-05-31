'use client';
/*
 * Experience Section — ProSWPPP Redesign
 * Design: Single unified black section — Confidence Statement headline +
 * "America's #1 SWPPP" payoff + supporting subhead + brand-logos ticker.
 * The client-logos ticker is rendered INSIDE this section so it shares
 * the same #000000 background and reads as one continuous dark band.
 */
import { motion } from "framer-motion";
import ClientLogosSection from "./ClientLogosSection";

export default function ExperienceSection() {
  return (
    <section className="pt-8 lg:pt-10 pb-16 lg:pb-20" style={{ background: '#000000' }}>
      <div className="container text-center">

        {/* 3-line stacked headline — lines fade in sequentially */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-heading text-white text-2xl lg:text-4xl leading-tight mb-2"
        >
          America&apos;s most reviewed SWPPP service
        </motion.h2>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="section-heading text-white text-2xl lg:text-4xl leading-tight mb-2"
        >
          America&apos;s highest-rated SWPPP service
        </motion.h2>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="section-heading text-5xl lg:text-7xl leading-tight mb-5"
          style={{ color: "#DE863F" }}
        >
          America&apos;s #1 SWPPP
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          We are America&apos;s #1 SWPPP for a reason &mdash; because we take
          care of our customers&hellip; every time, no matter what.
        </motion.p>

      </div>

      {/* Brand-logos ticker — lives inside this same black band per
          owner direction, so the headlines + the "brands we've worked
          with" carousel read as one unified dark section. */}
      <div className="mt-10 lg:mt-12">
        <ClientLogosSection />
      </div>
    </section>
  );
}
