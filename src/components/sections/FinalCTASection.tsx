'use client';
/*
 * Final CTA Section — ProSWPPP Redesign (v3)
 * Design: Three full-width banded rows, each one a distinct conversion
 * path. Intro headline + "Why Order Now?" callout sit above; address +
 * phone footer sit below.
 *
 *   Row 1 (white)  — "Not sure if you need one?"     -> Take the Quiz
 *   Row 2 (black)  — "Want to talk to Derek?"        -> Free Consultation
 *   Row 3 (blue)   — "Seen enough, ready to order?"  -> Get My SWPPP (shake)
 */

import { motion } from "framer-motion";

const BRAND_ORANGE = "#DE863F";
const BRAND_BLUE   = "#7B9CD1";

type Row = {
  bg: string;
  text: string;
  subtleText: string;
  heading: string;
  body: string;
  buttonHref: string;
  buttonLabel: string;
  buttonClass: string;
  buttonShake?: boolean;
  buttonTarget?: string;
};

const rows: Row[] = [
  {
    // Row 1 — WHITE
    bg: "#ffffff",
    text: "#1A1A1A",
    subtleText: "#4A4A4A",
    heading: "Do you even need a stormwater pollution prevention plan?",
    body:
      "Take the SWPPP quiz to assess your risk profile and find out in 2 minutes — no engineering knowledge required.",
    buttonHref: "/quiz-form/",
    buttonLabel: "Take the Quiz",
    buttonClass: "btn-orange",
  },
  {
    // Row 2 — BLACK
    bg: "#000000",
    text: "#ffffff",
    subtleText: "rgba(255,255,255,0.78)",
    heading: "Need to speak with America's #1 SWPPP expert?",
    body:
      "Schedule a call with Derek E. Chinners — founder, stormwater consultant, CPESC, with 20 years of SWPPP experience across all 50 states.",
    buttonHref: "https://calendly.com/proswppp/swpppconsult?month=2026-04",
    buttonLabel: "Get Free SWPPP Consultation",
    buttonClass: "btn-outline-white",
    buttonTarget: "_blank",
  },
  {
    // Row 3 — BRAND BLUE
    bg: BRAND_BLUE,
    text: "#ffffff",
    subtleText: "rgba(255,255,255,0.92)",
    heading: "Seen enough? You know we're America's #1 SWPPP service.",
    body:
      "Skip the wait and the runaround. Order now and have your fully compliant SWPPP in your inbox within 72 hours — guaranteed.",
    buttonHref: "/get-your-swppp/?start=map",
    buttonLabel: "Get My SWPPP",
    buttonClass: "btn-orange",
    buttonShake: true,
  },
];

export default function FinalCTASection() {
  return (
    <section className="pt-8 lg:pt-10 pb-16 lg:pb-20" style={{ background: "#000000" }}>
      {/* ── Intro ─────────────────────────────────────────────────────── */}
      <div className="container text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-semibold uppercase tracking-widest text-sm mb-3" style={{ color: BRAND_ORANGE }}>
            Fast, Affordable, &amp; 100% Compliant SWPPP Solution
          </p>
          <h2 className="section-heading text-white text-3xl lg:text-5xl mb-4 leading-tight">
            Your SWPPP Delivered<br />In 72 Hours, Or It&apos;s Free!
          </h2>
          <p className="text-white/90 font-medium text-lg mb-2">
            Three ways forward — pick the one that fits you.
          </p>
        </motion.div>
      </div>

      {/* ── Three full-width banded rows ──────────────────────────────── */}
      <div className="mt-10 lg:mt-14">
        {rows.map((row, i) => (
          <motion.div
            key={row.heading}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="w-full"
            style={{ background: row.bg, color: row.text }}
          >
            <div className="container py-10 lg:py-14">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 items-center">
                <div className="md:col-span-2">
                  <h3
                    className="font-black text-2xl lg:text-3xl leading-tight mb-3"
                    style={{
                      fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                      letterSpacing: "-0.01em",
                      color: row.text,
                    }}
                  >
                    {row.heading}
                  </h3>
                  <p
                    className="text-base lg:text-lg leading-relaxed"
                    style={{ fontFamily: "'Roboto', Arial, sans-serif", color: row.subtleText }}
                  >
                    {row.body}
                  </p>
                </div>
                <div className="md:text-right">
                  <a
                    href={row.buttonHref}
                    target={row.buttonTarget}
                    rel={row.buttonTarget === "_blank" ? "noopener noreferrer" : undefined}
                    className={`${row.bg === BRAND_BLUE ? "" : row.buttonClass}${row.buttonShake ? " nav-order-btn" : ""} block whitespace-nowrap text-center w-full`}
                    style={{
                      fontSize: "1.05rem",
                      padding: "1rem 2rem",
                      borderRadius: "12px",
                      fontWeight: 900,
                      letterSpacing: "0.04em",
                      // On the blue row, force a solid white pill with dark
                      // text instead of the orange CTA — orange on blue lacks
                      // contrast per owner.
                      ...(row.bg === BRAND_BLUE && {
                        background: "#FFFFFF",
                        color: "#1A1A1A",
                      }),
                      textTransform: "uppercase",
                      boxShadow: row.buttonShake
                        ? (row.bg === BRAND_BLUE
                          ? "0 6px 18px rgba(0,0,0,0.30)"
                          : "0 6px 18px rgba(222,134,63,0.45)")
                        : undefined,
                    }}
                  >
                    {row.buttonLabel}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
