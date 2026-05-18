'use client';
/*
 * Experience Section — ProSWPPP Redesign
 * Design: Single unified black section — Confidence Statement headline + 17+ stat merged
 * Per user request: merged two separate black sections into one centered band.
 */
import { motion } from "framer-motion";

export default function ExperienceSection() {
  return (
    <section className="py-16 lg:py-20" style={{ background: '#000000' }}>
      <div className="container text-center">

        {/* Confidence headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-heading text-white text-2xl lg:text-4xl leading-tight mb-4"
        >
          Confidence in Your SWPPP Expertise,<br />
          Compliance, and Full Support.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          20+ years of experience with a long-standing track record of delivering
          fully compliant SWPPP solutions on time, every time.
        </motion.p>

      </div>
    </section>
  );
}
