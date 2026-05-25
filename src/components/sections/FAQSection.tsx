'use client';
/*
 * FAQ Section — ProSWPPP Redesign
 * Layout matches the right-column "Beyond the 72-Hour Delivery" service
 * cards in CEOGuaranteeSection: brand-blue section bg, each item is a
 * light-tint card with a dark-navy icon circle (orange icon), white
 * title, and white/90 body — but with accordion open/close behavior
 * for the answer.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Plus, Minus } from "lucide-react";

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
    <section style={{ background: "#7B9CD1" }} className="py-20 lg:py-24">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p
            className="uppercase tracking-widest mb-3"
            style={{
              fontFamily: "'Roboto', Arial, sans-serif",
              fontWeight: 900,
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              color: "#FFFFFF",
            }}
          >
            Got Questions?
          </p>
          <h2
            className="leading-tight text-white"
            style={{
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(1.6rem, 2.5vw, 2.15rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Stormwater Compliance, Done Right.
          </h2>
        </motion.div>

        {/* FAQ list — each item matches the "Beyond the 72-Hour Delivery"
            service-card layout: light-tint card, dark-navy icon circle on
            the left with an orange icon, white title, white/90 body. */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  overflow: "hidden",
                }}
              >
                {/* Clickable question row */}
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start gap-4 p-3.5 text-left"
                >
                  {/* Icon circle — dark navy with orange icon, matches the
                      service cards above */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "#0D1F2B",
                      border: "1px solid rgba(255,255,255,0.20)",
                    }}
                  >
                    <HelpCircle size={20} style={{ color: "#DE863F" }} />
                  </div>

                  {/* Question */}
                  <div className="flex-1 min-w-0">
                    <h3
                      style={{
                        fontFamily:
                          "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontWeight: 700,
                        fontSize: "1rem",
                        lineHeight: 1.25,
                        color: "#FFFFFF",
                        margin: 0,
                      }}
                    >
                      {faq.q}
                    </h3>
                  </div>

                  {/* Open/close indicator */}
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                    style={{
                      background: isOpen ? "#0D1F2B" : "rgba(13,31,43,0.5)",
                      border: "1px solid rgba(255,255,255,0.20)",
                    }}
                  >
                    {isOpen ? (
                      <Minus size={14} style={{ color: "#DE863F" }} />
                    ) : (
                      <Plus size={14} style={{ color: "#DE863F" }} />
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
                      {/* Answer body — indented to align with the question
                          text (matches the service-card body alignment) */}
                      <div className="px-3.5 pb-3.5" style={{ paddingLeft: "calc(3.5rem + 0.875rem)" }}>
                        <div
                          className="h-px w-full mb-3"
                          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        />
                        <p
                          style={{
                            fontFamily: "'Roboto', Arial, sans-serif",
                            fontSize: "0.875rem",
                            lineHeight: 1.55,
                            color: "rgba(255,255,255,0.90)",
                            margin: 0,
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
      </div>
    </section>
  );
}
