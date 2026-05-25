'use client';
/*
 * Quiz CTA Section — ProSWPPP Redesign
 * Design: Light blue background with centered CTA
 * Uses aerial construction site background image
 */

import { motion } from "framer-motion";

const QUIZ_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/quiz-section-bg-L5RCLtRc25JtumffDmTuXT.webp";

export default function QuizCTASection() {
  return (
    <section
      className="relative py-20 lg:py-24"
      style={{
        backgroundImage: `url(${QUIZ_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#4361AF]/80" />

      <div className="relative z-10 container text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading text-white text-3xl lg:text-4xl mb-4">
            Do I Need a SWPPP?
          </h2>
          <p className="text-white/90 font-medium text-lg mb-8">
            Take the quiz and find out!
          </p>
          <a href="/quiz" className="btn-orange text-base px-10 py-4">
            Do I Need a SWPPP?
          </a>
        </motion.div>
      </div>
    </section>
  );
}
