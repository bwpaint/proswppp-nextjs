'use client';
/*
 * Experience Section — ProSWPPP Redesign
 * Design: Single unified black section — Confidence Statement headline + 17+ stat merged
 * Per user request: merged two separate black sections into one centered band.
 */
import { motion } from "framer-motion";

export default function ExperienceSection() {
  return (
    <section className="pt-8 lg:pt-10 pb-28 lg:pb-32" style={{ background: '#000000' }}>
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
          className="section-heading text-2xl lg:text-4xl leading-tight mb-5"
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
    </section>
  );
}
