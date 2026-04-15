'use client';
/*
 * FAQ Section — ProSWPPP Redesign
 * Design: Dark #0F110A background, accordion with orange active state
 * Inter 900 headings, Roboto 400 body, orange checkmark/plus icons
 * Placed above the ClientLogos / FindUsOn section
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Do I really need a SWPPP?",
    a: "If your project disturbs 1 acre or more, or is part of a larger common plan of development, federal law requires it. If you're unsure, take our 30-second quiz to find out instantly.",
  },
  {
    q: "How fast can I get my plan?",
    a: "While most firms take 2 weeks, we deliver a fully compliant SWPPP in 72 hours or it's FREE. We specialize in speed to get your project moving.",
  },
  {
    q: "What if an inspector rejects the plan?",
    a: "We have a 100% compliance record. However, if a regulator raises any concerns, we take full responsibility and resolve the issue on your behalf at no extra cost.",
  },
  {
    q: 'Who is a "Qualified Person" to write this?',
    a: "Regulatory agencies require specific expertise. Our team has 20+ years of experience ensuring every plan meets Federal, State, and Local requirements perfectly.",
  },
  {
    q: "How much does a SWPPP cost?",
    a: "We pride ourselves on being the most affordable professional option. By focusing exclusively on SWPPPs, we've streamlined the process to pass those savings to you.",
  },
  {
    q: "What are BMPs?",
    a: 'These are the "Best Management Practices" we design for your site—like silt fences or sediment basins—to keep you in compliance and avoid heavy fines.',
  },
  {
    q: "What happens if I'm caught without one?",
    a: "You face immediate stop-work orders and fines that can exceed $50,000 per day. We can help you avoid this risk in just 3 days.",
  },
  {
    q: "When can I terminate my permit?",
    a: "Once your site has reached 70% permanent stabilization (like grass or paving). We provide support from start to finish to ensure a clean exit.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section style={{ background: "linear-gradient(315deg, #000000 0%, #000000 50%, #000000 100%)" }} className="py-20 lg:py-24">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-3 font-semibold"
            style={{ color: "#EF7C3B" }}
          >
            Got Questions?
          </p>
          <h2
            className="text-4xl lg:text-5xl font-black leading-tight text-white"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900 }}
          >
            Frequently Asked Questions
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#EF7C3B]/40" />
            <span className="text-[#EF7C3B] text-xl">✦</span>
            <span className="h-px w-16 bg-[#EF7C3B]/40" />
          </div>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="overflow-hidden rounded-[11px]"
                style={{
                  border: isOpen
                    ? "1px solid #EF7C3B"
                    : "1px solid rgba(255,255,255,0.08)",
                  backgroundColor: isOpen
                    ? "rgba(239,124,59,0.06)"
                    : "rgba(255,255,255,0.03)",
                  transition: "border-color 0.25s, background-color 0.25s",
                }}
              >
                {/* Question row */}
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span
                    className="text-base lg:text-lg font-bold text-white leading-snug group-hover:text-[#EF7C3B] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      backgroundColor: isOpen ? "#EF7C3B" : "rgba(239,124,59,0.15)",
                    }}
                  >
                    {isOpen ? (
                      <Minus size={14} className="text-white" />
                    ) : (
                      <Plus size={14} style={{ color: "#EF7C3B" }} />
                    )}
                  </span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="px-6 pb-6">
                        <div
                          className="h-px w-full mb-4"
                          style={{ backgroundColor: "rgba(239,124,59,0.2)" }}
                        />
                        <p
                          className="text-gray-300 leading-relaxed"
                          style={{
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: "calc(0.9375rem)",
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* CTA below accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-5 text-sm">
            Still have questions? Our founder Derek is happy to help.
          </p>
          <a
            href="tel:8334387977"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-[11px] font-bold text-white uppercase tracking-wide transition-all hover:opacity-90 hover:scale-105"
            style={{
              backgroundColor: "#EF7C3B",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "0.9375rem",
              letterSpacing: "0.05em",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Still Have Questions? Call Derek at 833-GET-SWPP
          </a>
        </motion.div>
      </div>
    </section>
  );
}
