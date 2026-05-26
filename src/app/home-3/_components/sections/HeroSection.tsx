'use client';
/*
 * Hero Section — ProSWPPP Redesign (v2 — Built for Builders / Team rotation)
 * Design: Full-bleed construction site background, two-column layout
 *   LEFT  (50%): Brand headline + star rating + two CTAs (Get My SWPPP, Take the Quiz)
 *   RIGHT (50%): "Who We Are — Built for Builders" panel with a rotating card that
 *                cycles between the team photo and the descriptive "Pro SWPPP is a
 *                nationwide stormwater pollution prevention plan service..." copy
 *                every 4 seconds, then "Construction doesn't wait..." subhead and
 *                a "Meet Our Team" CTA.
 *
 * Backup of the previous form-on-the-right design lives at:
 *   /backups/HeroSection-v1-with-contact-form.tsx
 */

import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

// Local copy of the construction-site hero — was a 263 KB CloudFront WebP
// (1920x1072). Served locally through next/image so Vercel generates
// responsive variants (640w/750w/828w/1080w/1200w/1920w) and picks the
// right size for each viewport. Big LCP win vs. the CSS background-image
// approach which can't be optimized.
const HERO_BG = "/images/hero-construction.webp";
const TEAM_PHOTO = "/images/proswppp-team-800.webp";
const PHASES = ["cta", "photo", "text", "risk"] as const;
type Phase = (typeof PHASES)[number];
// Dwell time per phase, in ms.
//   cta   — 'Get Your SWPPP Now' call-to-action slide (first)
//   photo — team photo
//   text  — descriptive copy
//   risk  — live risk-score gauge with state dropdown
const PHASE_DURATIONS_MS: Record<Phase, number> = {
  cta: 8000,
  photo: 4000,
  text: 6000,
  risk: 10000,
};
const NEEDLE_LOOP_MS = 10000;

// US states for the Live Risk Score dropdown — selecting one jumps to the quiz.
const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HeroSection() {
  // Right-column rotating card cycles photo -> descriptive text -> live risk score.
  // Auto-plays once through all 3 phases, then hands control to the user via
  // the left/right nav dots. Hovering inside the card pauses auto-rotation.
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const phase: Phase = PHASES[phaseIdx];

  useEffect(() => {
    if (paused || manualMode) return;
    const t = setTimeout(() => {
      // After the last phase (risk), loop back to the CTA slide and stop
      // auto-rotating. The user takes over via the nav arrows from there.
      if (phaseIdx === PHASES.length - 1) {
        setPhaseIdx(0);
        setManualMode(true);
      } else {
        setPhaseIdx((i) => i + 1);
      }
    }, PHASE_DURATIONS_MS[phase]);
    return () => clearTimeout(t);
  }, [paused, manualMode, phase, phaseIdx]);

  const goPrev = () => {
    setManualMode(true);
    setPhaseIdx((i) => (i - 1 + PHASES.length) % PHASES.length);
  };
  const goNext = () => {
    setManualMode(true);
    setPhaseIdx((i) => (i + 1) % PHASES.length);
  };

  const handleStatePick = (code: string) => {
    if (!code) return;
    window.location.href = `/quiz-form/?state=${encodeURIComponent(code)}`;
  };

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Hero background — next/image generates responsive WebP variants
          per viewport, priority hint marks this as LCP. */}
      <Image
        src={HERO_BG}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center top", zIndex: 0 }}
      />

      {/* Dark gradient overlay — lightest top-left, darkest toward bottom-right center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(158deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.68) 35%, rgba(0,0,0,0.78) 65%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* CSS keyframes for the risk-score needle — runs whenever the
          `.ww-needle` element is in the DOM. More reliable than SMIL. */}
      <style>{`
        @keyframes wwNeedleSweep {
          0%   { transform: rotate(-30deg); }
          25%  { transform: rotate(15deg); }
          50%  { transform: rotate(-10deg); }
          75%  { transform: rotate(65deg); }
          100% { transform: rotate(-30deg); }
        }
        .ww-needle {
          transform-box: view-box;
          transform-origin: 100px 100px;
          animation: wwNeedleSweep 10s ease-in-out infinite;
        }
      `}</style>

      {/* Two-column content */}
      <div className="relative z-10 container pt-20 lg:pt-32 pb-2.5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ────────────────────────────────────────────────────────────────
              LEFT: Brand copy + star rating + CTAs (unchanged from v1)
              ──────────────────────────────────────────────────────────────── */}
          <div>
            {/* Eyebrow */}
            <motion.p
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="uppercase tracking-widest text-sm mb-4"
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontWeight: 400,
                letterSpacing: "0.2em",
                color: "#FFB800",
              }}
            >
              Fast, Affordable, and 100% Compliant<br />
              SWPPP Solution
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              custom={0.1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-white uppercase leading-none mb-2"
              style={{
                fontSize: "clamp(3.36rem, 6.6vw, 6rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Get Your <span style={{ fontSize: "130%", display: "inline-block" }}>SWPPP</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.h2
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="leading-none mb-6"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#EF7C3B",
              }}
            >
              In 72 hrs.,<br />or it&apos;s FREE!
            </motion.h2>

            {/* Supporting text */}
            <motion.div
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-5"
            >
              <p
                className="text-white uppercase tracking-wide text-base mb-1"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400 }}
              >
                Order Now… Because We&apos;re America&apos;s #1 SWPPP
              </p>
              <p
                className="text-gray-300 uppercase tracking-wide text-sm"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400 }}
              >
                5-Star Rated Google Business
              </p>
            </motion.div>

            {/* Star Rating */}
            <motion.div
              custom={0.4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center gap-2 mb-8"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} className="fill-[#FFB800] text-[#FFB800]" />
                ))}
              </div>
              <span
                className="text-white text-sm"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400 }}
              >
                5.0 Google Reviews
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4"
            >
              <a
                href="/get-your-swppp/?start=map"
                className="btn-orange btn-hero-sweep text-base px-8 py-4 inline-block"
              >
                Get My SWPPP
              </a>
              <a
                href="/quiz-form/"
                className="btn-blue text-base px-8 py-4 inline-block"
              >
                Take the Quiz
              </a>
            </motion.div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              RIGHT: Who We Are — Built for Builders (with rotating card)
              ──────────────────────────────────────────────────────────────── */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Eyebrow */}
            <p
              className="uppercase tracking-widest text-sm mb-3"
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "0.2em",
                color: "#EF7C3B",
                textAlign: "center",
              }}
            >
              Who We Are
            </p>

            {/* Heading: Built for Builders */}
            <h2
              className="text-white uppercase leading-none mb-6"
              style={{
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textAlign: "center",
              }}
            >
              Built for <span style={{ color: "#EF7C3B" }}>Builders</span>
            </h2>

            {/* Rotating card. Outer wrapper has overflow: visible so the
                nav arrows can sit slightly outside the rounded card edges.
                Inner div has overflow: hidden + border-radius so the photo
                and panels stay clipped to the rounded shape. */}
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              tabIndex={0}
              style={{
                position: "relative",
                width: "100%",
                marginBottom: "1.25rem",
                outline: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
              >
              {/* Photo — always in the DOM so it dictates the card height at
                  its natural aspect. Fades out when another phase is active. */}
              <motion.img
                src={TEAM_PHOTO}
                alt="The Pro SWPPP Team"
                initial={false}
                animate={{ opacity: phase === "photo" ? 1 : 0 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                }}
              />

              <AnimatePresence mode="wait" initial={false}>
                {phase === "cta" && (
                  <motion.div
                    key="cta"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "1.5rem 1.75rem",
                      background:
                        "linear-gradient(135deg, rgba(13,31,43,0.85) 0%, rgba(26,58,74,0.85) 100%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* Eyebrow */}
                    <p
                      style={{
                        color: "#EF7C3B",
                        fontFamily: "'Roboto', Arial, sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        margin: "0 0 0.6rem",
                      }}
                    >
                      Get Started
                    </p>

                    {/* Headline */}
                    <h3
                      style={{
                        color: "#ffffff",
                        fontFamily:
                          "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontSize: "1.95rem",
                        fontWeight: 900,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                        margin: "0 0 0.75rem",
                      }}
                    >
                      Get Your{" "}
                      <span style={{ color: "#EF7C3B" }}>SWPPP</span> Now
                    </h3>

                    {/* Body */}
                    <p
                      style={{
                        fontFamily: "'Roboto', Arial, sans-serif",
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        color: "rgba(255,255,255,0.88)",
                        margin: "0 0 1.1rem",
                        maxWidth: "92%",
                      }}
                    >
                      Select your state below to get started. Your fully
                      compliant SWPPP delivered within 72 hours — guaranteed.
                    </p>

                    {/* Primary CTA */}
                    <a
                      href="/get-your-swppp/?start=map"
                      style={{
                        display: "inline-block",
                        background: "#EF7C3B",
                        color: "#ffffff",
                        padding: "0.7rem 1.6rem",
                        borderRadius: "10px",
                        fontFamily:
                          "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontWeight: 800,
                        fontSize: "0.95rem",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        marginBottom: "1rem",
                        boxShadow: "0 6px 18px rgba(239,124,59,0.35)",
                      }}
                    >
                      Start My Order →
                    </a>

                    {/* Trust points */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "0.4rem 1.1rem",
                        fontFamily: "'Roboto', Arial, sans-serif",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.82)",
                        marginBottom: "0.9rem",
                      }}
                    >
                      <span>✓ 100% Compliant</span>
                      <span>✓ 72-Hour Delivery</span>
                      <span>✓ 20+ Years Experience</span>
                    </div>

                    {/* Phone */}
                    <a
                      href="tel:8334387977"
                      style={{
                        color: "#EF7C3B",
                        fontFamily:
                          "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                        fontWeight: 900,
                        fontSize: "1.05rem",
                        textDecoration: "none",
                        letterSpacing: "0.02em",
                      }}
                    >
                      📞 833-GET-SWPP
                    </a>
                  </motion.div>
                )}

                {phase === "text" && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "1.75rem 2rem",
                      background:
                        "linear-gradient(135deg, rgba(13,31,43,0.85) 0%, rgba(26,58,74,0.85) 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.92)",
                      fontFamily: "'Roboto', Arial, sans-serif",
                      lineHeight: 1.6,
                      fontSize: "1.15rem",
                    }}
                  >
                    <p style={{ margin: "0 0 0.875rem" }}>
                      Pro SWPPP is a nationwide stormwater pollution prevention plan
                      service built for contractors, developers, and site managers who
                      need compliance fast — without the runaround.
                    </p>
                    <p style={{ margin: "0 0 0.875rem" }}>
                      Federal law requires a SWPPP on every project disturbing one or
                      more acres. We deliver fully compliant, site-specific plans in
                      72 hours — engineered to meet EPA and state NPDES permit
                      requirements, across 48 states.
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontStyle: "italic",
                        color: "#EF7C3B",
                        fontWeight: 700,
                      }}
                    >
                      No waiting weeks. No confusing templates. Just a permit-ready
                      plan in your inbox.
                    </p>
                  </motion.div>
                )}

                {phase === "risk" && (
                  <motion.div
                    key="risk"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: "1rem 1.25rem",
                      background:
                        "linear-gradient(135deg, rgba(13,31,43,0.85) 0%, rgba(26,58,74,0.85) 100%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {/* Header */}
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          color: "#EF7C3B",
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontSize: "0.85rem",
                          fontWeight: 900,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          margin: "0 0 0.25rem",
                        }}
                      >
                        Live SWPPP Risk Score
                      </p>
                      <h3
                        style={{
                          color: "#fff",
                          fontFamily:
                            "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                          fontSize: "1.85rem",
                          fontWeight: 900,
                          margin: 0,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.1,
                        }}
                      >
                        Is Your Project at Risk?
                      </h3>
                    </div>

                    {/* Animated gauge — smooth needle sweep */}
                    <svg
                      viewBox="0 0 200 130"
                      style={{ width: "100%", maxWidth: "380px", height: "auto" }}
                      aria-hidden="true"
                    >
                      {/* LOW arc (left, green) */}
                      <path
                        d="M 30 100 A 70 70 0 0 1 100 30"
                        stroke="#22C55E"
                        strokeWidth="14"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* HIGH arc (right, red) */}
                      <path
                        d="M 100 30 A 70 70 0 0 1 170 100"
                        stroke="#EF4444"
                        strokeWidth="14"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Needle — CSS keyframe animation (more reliable than
                          SMIL on dynamic mount). transform-box: view-box +
                          transform-origin: 100px 100px pins the rotation at
                          the gauge base. */}
                      <g className="ww-needle">
                        <line
                          x1="100"
                          y1="100"
                          x2="100"
                          y2="42"
                          stroke="#EF7C3B"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </g>
                      {/* Center pivot cap */}
                      <circle
                        cx="100"
                        cy="100"
                        r="9"
                        fill="#0D1F2B"
                        stroke="#EF7C3B"
                        strokeWidth="2"
                      />
                      {/* Labels */}
                      <text
                        x="22"
                        y="120"
                        fill="#22C55E"
                        fontSize="11"
                        fontWeight="800"
                        fontFamily="'Inter', Arial, sans-serif"
                      >
                        LOW
                      </text>
                      <text
                        x="178"
                        y="120"
                        textAnchor="end"
                        fill="#EF4444"
                        fontSize="11"
                        fontWeight="800"
                        fontFamily="'Inter', Arial, sans-serif"
                      >
                        HIGH
                      </text>
                    </svg>

                    {/* State dropdown */}
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontSize: "1rem",
                          fontWeight: 500,
                          margin: "0 0 0.4rem",
                        }}
                      >
                        Pick your state to check your risk:
                      </p>
                      <select
                        defaultValue=""
                        onChange={(e) => handleStatePick(e.target.value)}
                        style={{
                          width: "100%",
                          maxWidth: "320px",
                          background:
                            "rgba(255,255,255,0.08) url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='white'><path d='M2 4l4 4 4-4z'/></svg>\") no-repeat right 20px center",
                          border: "1px solid rgba(239,124,59,0.45)",
                          borderRadius: "8px",
                          color: "#fff",
                          padding: "0.7rem 40px 0.7rem 0.95rem",
                          fontSize: "1rem",
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontWeight: 600,
                          outline: "none",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                        }}
                      >
                        <option value="" style={{ color: "#222" }}>
                          Select your state…
                        </option>
                        {US_STATES.map((s) => (
                          <option key={s.code} value={s.code} style={{ color: "#222" }}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>

              {/* Manual navigation dots — left/right at the bottom corners,
                  aligned with the "Select your state" dropdown row. Sit
                  slightly outside the rounded card to draw the eye. Always
                  present; click forces manual mode. */}
              <motion.button
                type="button"
                onClick={goPrev}
                aria-label="Previous"
                initial={{ opacity: 0 }}
                animate={{ opacity: manualMode ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: "-22px",
                  bottom: "50px",
                  pointerEvents: manualMode ? "auto" : "none",
                  width: "42px",
                  height: "42px",
                  borderRadius: "9999px",
                  background: "rgba(40, 70, 90, 0.92)",
                  border: "2px solid rgba(255,255,255,0.85)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 5,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
                  transition: "background 0.2s, transform 0.15s",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(70, 110, 135, 0.95)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.08)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(40, 70, 90, 0.92)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </motion.button>

              <motion.button
                type="button"
                onClick={goNext}
                aria-label="Next"
                initial={{ opacity: 0 }}
                animate={{ opacity: manualMode ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  right: "-22px",
                  bottom: "50px",
                  pointerEvents: manualMode ? "auto" : "none",
                  width: "42px",
                  height: "42px",
                  borderRadius: "9999px",
                  background: "rgba(40, 70, 90, 0.92)",
                  border: "2px solid rgba(255,255,255,0.85)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 5,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
                  transition: "background 0.2s, transform 0.15s",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(70, 110, 135, 0.95)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1.08)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(40, 70, 90, 0.92)";
                  (e.currentTarget as HTMLButtonElement).style.transform =
                    "scale(1)";
                }}
              >
                <ChevronRight size={24} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* Subheading below the rotating card */}
            <p
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "clamp(1.2rem, 1.7vw, 1.45rem)",
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                fontStyle: "italic",
                marginBottom: "1.25rem",
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
              }}
            >
              Construction Doesn&apos;t Wait.
              <br />
              Neither Should Your{" "}
              <span style={{ color: "#EF7C3B" }}>Stormwater Compliance.</span>
            </p>

            {/* Meet Our Team button */}
            <div style={{ textAlign: "center" }}>
              <a
                href="/about/"
                className="btn-orange text-base px-8 py-3.5 inline-block"
              >
                Meet Our Team
              </a>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges — bottom of hero. Three uniformly-sized icons with
            a small caption underneath each.
              Left:   100% Compliance Guaranteed
              Middle: Certified SWPPP
              Right:  Women-Owned Business */}
        <motion.div
          custom={0.7}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap justify-center items-start gap-12 mt-28 pb-2"
        >
          {([
            {
              src: "/images/Guarantee-com-300x300.png",
              label: "100% Compliance Guaranteed",
              whiteBg: false,
              href: null,
            },
            {
              src: "/images/cpesc-logo-trans.webp",
              label: "Certified SWPPP",
              whiteBg: true,
              href: null,
            },
            {
              src: "/images/icon-woman-owned-seal-300x300.png",
              label: "Women-Owned Business",
              whiteBg: false,
              href: null,
            },
            {
              src: "/images/BBB_PrimaryLogo_White.svg",
              label: "BBB Accredited Business",
              whiteBg: false,
              href: "https://www.bbb.org/us/tx/kingwood/profile/water-pollution-control/pro-swppp-llc-0915-90073436",
            },
          ] as const).map((badge) => {
            const inner = (
              <>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: badge.whiteBg ? "#ffffff" : "transparent",
                    borderRadius: badge.whiteBg ? "50%" : "0",
                    padding: badge.whiteBg ? "4px" : "0",
                    boxShadow: badge.whiteBg
                      ? "0 2px 10px rgba(0,0,0,0.25)"
                      : "none",
                  }}
                >
                  <img
                    src={badge.src}
                    alt={badge.label}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </div>
                <p
                  style={{
                    marginTop: "8px",
                    fontFamily: "'Roboto', Arial, sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#ffffff",
                    textAlign: "center",
                    lineHeight: 1.3,
                    margin: "8px 0 0",
                  }}
                >
                  {badge.label}
                </p>
              </>
            );

            return badge.href ? (
              <a
                key={badge.label}
                href={badge.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
                style={{ width: "120px", textDecoration: "none" }}
                aria-label={`${badge.label} (opens in a new tab)`}
              >
                {inner}
              </a>
            ) : (
              <div
                key={badge.label}
                className="flex flex-col items-center"
                style={{ width: "120px" }}
              >
                {inner}
              </div>
            );
          })}
        </motion.div>

        {/* Tagline H2 — sits ~10px above the bottom edge of the hero section,
            matched in size/style to the right-column "Who We Are" eyebrow. */}
        <motion.h2
          custom={0.8}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center uppercase tracking-widest text-sm mt-8"
          style={{
            fontFamily: "'Roboto', Arial, sans-serif",
            fontWeight: 900,
            letterSpacing: "0.2em",
            color: "#EF7C3B",
            margin: "2rem 0 0",
          }}
        >
          Number One Stormwater Pollution Prevention Plan Service in the U.S.
        </motion.h2>
      </div>
    </section>
  );
}
