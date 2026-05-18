'use client';
/*
 * CEO Guarantee Section — ProSWPPP Redesign (v2)
 * Design: Full-width edge-to-edge 50/50 split.
 *   LEFT (white):  Headline + Derek photo + Derek's personal quote — unchanged.
 *   RIGHT (blue):  "Beyond the 72-Hour Delivery" — five service cards
 *                  describing what happens AFTER the SWPPP is delivered.
 *                  New content that doesn't repeat stats/claims made
 *                  elsewhere on the page (revisions, inspection coaching,
 *                  annual reports, NOT filing, agency liaison).
 *
 * CEO photo sourced from proswppp.com/wp-content/uploads/2024/08/IMG_4484.jpg
 */

import { motion } from "framer-motion";
import {
  Phone,
  RefreshCw,
  ClipboardCheck,
  CalendarCheck,
  FileCheck,
  Headphones,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const CEO_PHOTO = "https://proswppp.com/wp-content/uploads/2024/08/IMG_4484.jpg";

interface BeyondService {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const beyondServices: BeyondService[] = [
  {
    icon: RefreshCw,
    title: "Unlimited Revisions for 30 Days",
    desc: "Site plans change mid-build. Your SWPPP changes with them — at no extra cost.",
  },
  {
    icon: ClipboardCheck,
    title: "Pre-Inspection Coaching",
    desc: "When the state inspector arrives, you're ready. We brief you on every BMP on the plan.",
  },
  {
    icon: CalendarCheck,
    title: "Annual Permit Reports",
    desc: "We prepare and file your NPDES annual reports on time, every year. Required for compliance.",
  },
  {
    icon: FileCheck,
    title: "Project-Close NOT Filing",
    desc: "When construction wraps, we file the Notice of Termination — so you're properly done.",
  },
  {
    icon: Headphones,
    title: "Direct Agency Liaison",
    desc: "EPA or state agency questions? We handle the call so you don't have to.",
  },
];

export default function CEOGuaranteeSection() {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-2"
      style={{ minHeight: "560px" }}
    >
      {/* ─────────────────────────────────────────────────────────────
          LEFT: White background — Derek's headline + photo + quote
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-white px-8 lg:px-12 py-14 lg:py-16 flex flex-col justify-center"
      >
        <div style={{ maxWidth: "75%", marginLeft: "12%" }}>
          <h2 className="section-heading text-[#1A3A4A] text-2xl lg:text-3xl mb-1 leading-tight">
            Order Your SWPPP Now and Your Site Will Be
          </h2>
          <h3 className="section-heading text-[#EF7C3B] text-xl lg:text-2xl mb-8">
            Fully Compliant in Just 72 Hours, Guaranteed
          </h3>

          {/* Derek photo + quote */}
          <div className="flex flex-col sm:flex-row items-start gap-6 bg-gray-50 rounded-2xl p-6">
            <div className="flex-shrink-0">
              <img
                src={CEO_PHOTO}
                alt="Derek – CEO, Pro SWPPP"
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-[#EF7C3B]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const div = document.createElement("div");
                  div.className =
                    "w-24 h-24 rounded-full bg-[#1A3A4A] flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-[#EF7C3B]";
                  div.textContent = "D";
                  target.parentNode?.insertBefore(div, target);
                }}
              />
            </div>
            <div className="flex-1">
              <blockquote className="text-gray-700 italic leading-relaxed mb-3">
                &ldquo;I guarantee full service &amp; support throughout the
                duration of your project. At ProSWPPP our #1 Goal is to take
                care of our Customers. We stand by our customers 110%.&rdquo;
              </blockquote>
              <p className="font-bold text-[#1A3A4A] uppercase tracking-wide text-sm">
                Derek – CEO, Pro SWPPP
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: Gradient blue — "Beyond the 72-Hour Delivery"
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative overflow-hidden px-8 lg:px-12 py-14 lg:py-16 flex flex-col justify-center"
        style={{
          background: "linear-gradient(135deg, #6B9ED1 0%, #4A7DA8 60%, #355E83 100%)",
        }}
      >
        {/* Subtle radial light source for depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.18) 0%, transparent 45%)",
          }}
        />

        <div className="relative z-10">
          {/* Eyebrow */}
          <p
            className="uppercase tracking-widest mb-3"
            style={{
              fontFamily: "'Roboto', Arial, sans-serif",
              fontWeight: 900,
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.78)",
            }}
          >
            After You Order
          </p>

          {/* Headline */}
          <h3
            className="section-heading text-white leading-tight mb-2"
            style={{
              fontSize: "clamp(1.6rem, 2.5vw, 2.15rem)",
              letterSpacing: "-0.01em",
            }}
          >
            Beyond the <span className="text-[#FFD9A8]">72-Hour</span> Delivery
          </h3>

          {/* Subhead */}
          <p className="text-white/85 italic font-medium mb-7">
            Your SWPPP doesn&rsquo;t end when the plan hits your inbox.
          </p>

          {/* 5 service cards */}
          <div className="space-y-3 mb-8">
            {beyondServices.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.45 }}
                  className="flex items-start gap-4 rounded-xl p-3.5"
                  style={{
                    background: "rgba(255,255,255,0.10)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {/* Icon circle */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.18)",
                      border: "1px solid rgba(255,255,255,0.30)",
                    }}
                  >
                    <Icon size={20} className="text-white" />
                  </div>

                  <div>
                    <h4
                      className="text-white font-bold mb-0.5"
                      style={{
                        fontFamily:
                          "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: "1rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {s.title}
                    </h4>
                    <p
                      className="text-white/85"
                      style={{
                        fontFamily: "'Roboto', Arial, sans-serif",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <a
            href="tel:8334387977"
            className="btn-black-hover-orange inline-flex items-center gap-2 self-start"
          >
            <Phone size={16} />
            Or Call Us Today
          </a>
        </div>
      </motion.div>
    </section>
  );
}
