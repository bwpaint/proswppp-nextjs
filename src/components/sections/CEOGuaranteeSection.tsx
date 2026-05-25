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
          LEFT: Dark navy background — Derek's headline + photo + quote
          (Larger type, inverted colors so the column fills its height.)
          ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="px-8 lg:px-12 py-14 lg:py-16 flex flex-col justify-center"
        style={{ background: "#7B9CD1" }}
      >
        <div style={{ maxWidth: "88%", marginLeft: "6%" }}>
          {/* Headline block is a single clickable link to the order page. */}
          <a
            href="/get-your-swppp/"
            style={{ textDecoration: "none", display: "block" }}
            className="group"
          >
            <h2
              className="section-heading leading-[1.05] mb-1 transition-colors group-hover:text-[#1A1A1A]"
              style={{
                fontSize: "clamp(2rem, 3.6vw, 3.25rem)",
                letterSpacing: "-0.02em",
                color: "#000000",
              }}
            >
              Order now&hellip;
            </h2>
            <h2
              className="section-heading leading-[1.05] mb-1 transition-colors group-hover:text-[#1A1A1A]"
              style={{
                fontSize: "clamp(2rem, 3.6vw, 3.25rem)",
                letterSpacing: "-0.02em",
                color: "#000000",
              }}
            >
              and your site will be fully compliant&hellip;
            </h2>
            <h3
              className="section-heading mb-10 transition-colors group-hover:text-[#FF9456]"
              style={{
                fontSize: "clamp(1.55rem, 2.8vw, 2.5rem)",
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                color: "#DE863F",
              }}
            >
              in just 72 hours, guaranteed.
            </h3>
          </a>

          {/* Derek photo + quote */}
          <div
            className="flex flex-col sm:flex-row items-start gap-6 rounded-2xl p-7"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div className="flex-shrink-0">
              <img
                src={CEO_PHOTO}
                alt="Derek E. Chinners – Founder &amp; Stormwater Consultant, CPESC"
                className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-[#DE863F]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const div = document.createElement("div");
                  div.className =
                    "w-28 h-28 rounded-full bg-[#0D1F2B] flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-[#DE863F]";
                  div.textContent = "D";
                  target.parentNode?.insertBefore(div, target);
                }}
              />
            </div>
            <div className="flex-1">
              <blockquote
                className="italic leading-relaxed mb-3"
                style={{
                  fontSize: "1.15rem",
                  lineHeight: 1.6,
                  color: "#000000",
                }}
              >
                &ldquo;When you pick Pro SWPPP for your project your calls get returned,
                your questions get answered, and your permitting becomes one less thing
                to worry about&hellip; Every Time.&rdquo;
              </blockquote>
              <p
                className="font-bold uppercase tracking-wide"
                style={{ fontSize: "0.95rem", color: "#000000" }}
              >
                Derek E. Chinners – Founder &amp; Stormwater Consultant, CPESC
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
        style={{ background: "#7B9CD1" }}
      >
        {/* Subtle radial light source for depth on the flat navy */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.07) 0%, transparent 50%)",
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
              color: "#000000",
            }}
          >
            After You Order
          </p>

          {/* Headline */}
          <h3
            className="section-heading leading-tight mb-2"
            style={{
              fontSize: "clamp(1.6rem, 2.5vw, 2.15rem)",
              letterSpacing: "-0.01em",
              color: "#000000",
            }}
          >
            Beyond the <span className="text-[#DE863F]">72-Hour</span> Delivery
          </h3>

          {/* Subhead */}
          <p className="italic font-medium mb-7" style={{ color: "#000000" }}>
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
                    <Icon size={20} style={{ color: "#000000" }} />
                  </div>

                  <div>
                    <h4
                      className="font-bold mb-0.5"
                      style={{
                        fontFamily:
                          "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: "1rem",
                        lineHeight: 1.2,
                        color: "#000000",
                      }}
                    >
                      {s.title}
                    </h4>
                    <p
                      style={{
                        fontFamily: "'Roboto', Arial, sans-serif",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                        margin: 0,
                        color: "#000000",
                      }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA — orange to match the "72-Hour" accent, sized to match
              the "Beyond the 72-Hour Delivery" headline. No underline. */}
          <a
            href="tel:8334387977"
            className="inline-flex items-center gap-3 self-start"
            style={{
              fontFamily:
                "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.6rem, 2.5vw, 2.15rem)",
              fontWeight: 900,
              color: "#DE863F",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#FF9456";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "#DE863F";
            }}
          >
            <Phone size={30} strokeWidth={2.5} />
            Or Call Us Today
          </a>
        </div>
      </motion.div>
    </section>
  );
}
