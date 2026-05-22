'use client';
/*
 * How It Works Section — ProSWPPP
 * 4-step process strip with arrows, guarantee callout, CTA.
 * Sits directly below the hero on the homepage.
 *
 * Conversion sequence:
 *   Hero -> How It Works -> Stats -> Scrolling testimonials -> Final CTA
 */

import { motion } from "framer-motion";
import {
  ClipboardList,
  Users,
  Mail,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  num: number;
  icon: LucideIcon;
  title: string;
  body: string;
  tag: string;
}

const steps: Step[] = [
  {
    num: 1,
    icon: ClipboardList,
    title: "Answer a few quick questions",
    body:
      "Tell us about your project — site location, acreage, and type of construction. Our 2-minute quiz does the heavy lifting. No engineering knowledge required.",
    tag: "2-minute quiz",
  },
  {
    num: 2,
    icon: Users,
    title: "Our experts get to work",
    body:
      "A CPESC-certified stormwater professional builds your site-specific SWPPP — tailored to your state's regulations, local requirements, and project scope.",
    tag: "CPESC certified",
  },
  {
    num: 3,
    icon: Mail,
    title: "Plan delivered in 72 hours",
    body:
      "Your complete, inspector-ready SWPPP arrives in your inbox — stamped, signed, and ready to present on-site. Delivered within 72 hours, guaranteed. Or it's free.",
    tag: "72-hr guarantee",
  },
  {
    num: 4,
    icon: CheckCircle2,
    title: "Pass inspection. Stay compliant.",
    body:
      "Use your plan on-site with full confidence. If an inspector has questions or regulations change, our team is here to support you — at no extra charge.",
    tag: "100% compliant",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      style={{ background: "#0D1F2B" }}
      className="py-16 lg:py-24"
    >
      <div className="container">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center uppercase mb-2"
          style={{
            color: "#EF7C3B",
            fontFamily: "'Roboto', Arial, sans-serif",
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.22em",
          }}
        >
          Simple process
        </motion.p>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="text-center text-white mb-3"
          style={{
            fontFamily:
              "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.85rem, 3.2vw, 2.6rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Your <span style={{ color: "#EF7C3B" }}>SWPPP</span> in 4 easy steps
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-center mx-auto mb-12"
          style={{
            color: "#9CA3AF",
            maxWidth: "580px",
            fontFamily: "'Roboto', Arial, sans-serif",
            fontSize: "1rem",
            lineHeight: 1.6,
          }}
        >
          No engineering background needed. No back-and-forth. Just a compliant
          plan in your inbox — fast.
        </motion.p>

        {/* Steps row */}
        <div className="flex flex-col lg:flex-row items-stretch gap-5 lg:gap-0">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="flex items-stretch flex-col lg:flex-row flex-1"
              >
                {/* Step card */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="flex-1 rounded-2xl p-7"
                  style={{
                    background: "#1F2937",
                    border: "1px solid #374151",
                  }}
                >
                  {/* Number badge */}
                  <div
                    className="flex items-center justify-center mb-4"
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "9999px",
                      background: "#EF7C3B",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      fontFamily:
                        "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                    }}
                  >
                    {s.num}
                  </div>

                  {/* Icon */}
                  <Icon
                    size={26}
                    style={{ color: "#EF7C3B", marginBottom: "0.75rem" }}
                  />

                  {/* Title */}
                  <h3
                    className="text-white mb-2"
                    style={{
                      fontFamily:
                        "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      lineHeight: 1.2,
                      margin: "0 0 0.55rem",
                    }}
                  >
                    {s.title}
                  </h3>

                  {/* Body */}
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontFamily: "'Roboto', Arial, sans-serif",
                      fontSize: "0.92rem",
                      lineHeight: 1.55,
                      margin: "0 0 0.9rem",
                    }}
                  >
                    {s.body}
                  </p>

                  {/* Tag pill */}
                  <span
                    className="inline-block"
                    style={{
                      background: "rgba(239,124,59,0.12)",
                      color: "#EF7C3B",
                      fontFamily: "'Roboto', Arial, sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.28rem 0.75rem",
                      borderRadius: "9999px",
                      border: "1px solid rgba(239,124,59,0.30)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.tag}
                  </span>
                </motion.div>

                {/* Arrow between cards (skipped after last) */}
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:flex items-center justify-center px-2"
                    style={{ color: "#EF7C3B" }}
                  >
                    <ArrowRight size={22} strokeWidth={2.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Guarantee callout */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="mx-auto mt-10 rounded-2xl flex items-start sm:items-center gap-5 flex-col sm:flex-row"
          style={{
            background: "rgba(239,124,59,0.10)",
            border: "1px solid rgba(239,124,59,0.30)",
            maxWidth: "740px",
            padding: "1.25rem 1.6rem",
          }}
        >
          <ShieldCheck
            size={36}
            style={{ color: "#EF7C3B", flexShrink: 0 }}
          />
          <div>
            <p
              className="text-white"
              style={{
                fontFamily:
                  "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 800,
                fontSize: "1rem",
                margin: 0,
              }}
            >
              The ProSWPPP guarantee — delivered in 72 hours or it&apos;s free
            </p>
            <p
              style={{
                color: "#9CA3AF",
                fontFamily: "'Roboto', Arial, sans-serif",
                fontSize: "0.88rem",
                lineHeight: 1.55,
                margin: "0.3rem 0 0",
              }}
            >
              Every plan is backed by our 100% compliance guarantee. If your
              inspector finds a problem with our plan, we fix it — free of
              charge.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-10">
          <a
            href="/get-your-swppp/"
            className="btn-orange btn-hero-sweep inline-block"
            style={{
              fontSize: "1rem",
              padding: "0.95rem 2.6rem",
              letterSpacing: "0.04em",
            }}
          >
            Get My SWPPP →
          </a>
          <p
            className="mt-3"
            style={{
              color: "#6B7280",
              fontFamily: "'Roboto', Arial, sans-serif",
              fontSize: "0.78rem",
              letterSpacing: "0.02em",
            }}
          >
            America&apos;s #1 SWPPP service · 5.0 Google Reviews · BBB Accredited
          </p>
        </div>
      </div>
    </section>
  );
}
