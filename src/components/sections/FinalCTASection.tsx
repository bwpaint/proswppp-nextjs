'use client';
/*
 * Final CTA Section — ProSWPPP Redesign
 * Design: Orange background with bold white text and dual CTAs
 *
 * CTA URLs verified against original content dump:
 * - "Get My SWPPP" → https://proswppp.com/get-your-swppp/
 * - "Schedule Consultation" → https://calendly.com/proswppp/swpppconsult
 */

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="py-16 lg:py-20" style={{ background: 'linear-gradient(315deg, #0D1F2B 0%, #1A3A4A 50%, #0D1F2B 100%)' }}>
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#EF7C3B] font-semibold uppercase tracking-widest text-sm mb-3">
            Fast, Affordable, &amp; 100% Compliant SWPPP Solution
          </p>
          <h2 className="section-heading text-white text-3xl lg:text-5xl mb-4 leading-tight">
            Your SWPPP Delivered<br />In 72 Hours, Or It's Free!
          </h2>
          <p className="text-white/90 font-medium text-lg mb-2">
            Free SWPPP Consultation with Derek, your SWPPP Expert…
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 max-w-2xl mx-auto mt-8 mb-10">
            <h3 className="text-white font-bold text-xl mb-3 uppercase tracking-wide">
              Why Order Now From Pro SWPPP?
            </h3>
            <p className="text-white/90 text-base mb-2">
              Because you will have America's #1 SWPPP in 72 hours, or it's FREE.
            </p>
            <p className="text-white font-semibold">
              We have a perfect, 100% compliance record.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://proswppp.com/get-your-swppp/"
              className="btn-orange text-base px-10 py-4"
            >
              Get My SWPPP
            </a>
            <a
              href="https://calendly.com/proswppp/swpppconsult?month=2026-04"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white text-base px-8 py-4"
            >
              Schedule My Free SWPPP Consultation
            </a>
          </div>

          <p className="text-white/80 mt-8 text-sm">
            If you have any questions before you order, please call Derek at:{" "}
            <a
              href="tel:8334387977"
              className="text-white font-bold hover:underline inline-flex items-center gap-1"
            >
              <Phone size={14} />
              833-GET-SWPP
            </a>
          </p>

          <p className="text-white/60 mt-3 text-sm">
            <a
              href="https://maps.app.goo.gl/rKcDY3vvTKsJTqnQ9"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Our Address: 17904 W Lake Houston Pkwy, STE 303, Atascocita, TX, 77346
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
