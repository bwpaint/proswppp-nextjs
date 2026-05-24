'use client';
/*
 * SiteWideCTA — appears on every page above the footer
 * Section 1 (dark navy): "Ready to Get Compliant?" — blue/navy CTA
 * Section 2 (orange):    "72-Hour Delivery — or it's FREE" guarantee banner
 */

import { motion } from 'framer-motion';
import { Shield, Phone } from 'lucide-react';

export default function SiteWideCTA() {
  return (
    <>
      {/* ── Ready to Get Compliant? ── */}
      <section
        style={{ background: 'linear-gradient(135deg, #0D1F2B 0%, #1A3A4A 100%)', padding: '4rem 0' }}
      >
        <div className="container text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-white uppercase font-black mb-4"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontFamily: "'Inter', sans-serif",
              letterSpacing: '-0.02em',
            }}
          >
            Ready to Get <span style={{ color: '#DE863F' }}>Compliant?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 mb-8 max-w-md mx-auto"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            Order your SWPPP today and receive it in 72 hours — guaranteed.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a href="/get-your-swppp/" className="btn-orange text-base px-10 py-4">
              Get My SWPPP
            </a>
            <a
              href="/quiz-form/"
              className="btn-outline-white text-base px-10 py-4"
            >
              Take the Quiz
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── 72-Hour Guarantee Banner ── */}
      <section style={{ background: '#DE863F', padding: '3rem 0' }}>
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <Shield size={48} className="text-white flex-shrink-0" />
            <div>
              <p
                className="text-white font-black text-2xl uppercase"
                style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}
              >
                72-Hour Delivery — or it&apos;s FREE
              </p>
              <p className="text-white/80 text-sm mt-1" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                If we don&apos;t deliver your completed SWPPP within 72 hours of receiving your civil drawings, you pay nothing.
              </p>
            </div>
            <a
              href="tel:8334387977"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-full transition-all duration-200 hover:shadow-lg"
              style={{ color: '#DE863F', fontFamily: "'Roboto', sans-serif" }}
            >
              <Phone size={14} />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
