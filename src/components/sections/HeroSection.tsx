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
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/hero-construction-9KtSzH7kq5P7L5DYyJm6oT.webp";
const TEAM_PHOTO = "/images/proswppp-team-800.webp";
const ROTATE_MS = 4000;
const PHASES = ["photo", "text", "risk"] as const;
type Phase = (typeof PHASES)[number];

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
  // Rotation pauses while the user is hovering or focused inside the card.
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const phase: Phase = PHASES[phaseIdx];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setPhaseIdx((i) => (i + 1) % PHASES.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [paused]);

  const handleStatePick = (code: string) => {
    if (!code) return;
    window.location.href = `/quiz-form/?state=${encodeURIComponent(code)}`;
  };

  return (
    <section
      className="relative min-h-[70vh] flex items-center"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Dark gradient overlay — lightest top-left, darkest toward bottom-right center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(158deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.68) 35%, rgba(0,0,0,0.78) 65%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Two-column content */}
      <div className="relative z-10 container py-10 lg:py-16">
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
                href="/get-your-swppp/"
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
              }}
            >
              Built for <span style={{ color: "#EF7C3B" }}>Builders</span>
            </h2>

            {/* Rotating card: photo ↔ descriptive text every 4 seconds.
                Hovering over the card pauses the rotation. */}
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              tabIndex={0}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "5 / 4",
                borderRadius: "16px",
                overflow: "hidden",
                border: "2px solid rgba(239,124,59,0.35)",
                boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
                marginBottom: "1.25rem",
                outline: "none",
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {phase === "photo" && (
                  <motion.div
                    key="photo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <img
                      src={TEAM_PHOTO}
                      alt="The Pro SWPPP Team"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
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
                        "linear-gradient(135deg, #0D1F2B 0%, #1A3A4A 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.92)",
                      fontFamily: "'Roboto', Arial, sans-serif",
                      lineHeight: 1.7,
                      fontSize: "0.95rem",
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
                      padding: "1.25rem 1.5rem",
                      background:
                        "linear-gradient(135deg, #0D1F2B 0%, #1A3A4A 100%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Header */}
                    <div style={{ textAlign: "center" }}>
                      <p
                        style={{
                          color: "#EF7C3B",
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontSize: "0.7rem",
                          fontWeight: 900,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          margin: "0 0 0.35rem",
                        }}
                      >
                        Live SWPPP Risk Score
                      </p>
                      <h3
                        style={{
                          color: "#fff",
                          fontFamily:
                            "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                          fontSize: "1.45rem",
                          fontWeight: 900,
                          margin: 0,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.15,
                        }}
                      >
                        Is Your Project at Risk?
                      </h3>
                    </div>

                    {/* Animated gauge — smooth needle sweep */}
                    <svg
                      viewBox="0 0 200 130"
                      style={{ width: "100%", maxWidth: "300px", height: "auto" }}
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
                      {/* Needle group — translate to pivot point, then rotate */}
                      <g transform="translate(100, 100)">
                        <motion.g
                          animate={
                            paused
                              ? { rotate: 0 }
                              : { rotate: [-30, 15, -10, 65, -30] }
                          }
                          transition={
                            paused
                              ? { duration: 0.4, ease: "easeOut" }
                              : {
                                  duration: 4,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  times: [0, 0.25, 0.5, 0.75, 1],
                                }
                          }
                        >
                          <line
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="-58"
                            stroke="#EF7C3B"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="0" cy="-58" r="4" fill="#EF7C3B" />
                        </motion.g>
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
                          color: "rgba(255,255,255,0.78)",
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontSize: "0.82rem",
                          margin: "0 0 0.5rem",
                        }}
                      >
                        Pick your state to check your risk:
                      </p>
                      <select
                        defaultValue=""
                        onChange={(e) => handleStatePick(e.target.value)}
                        style={{
                          width: "100%",
                          maxWidth: "260px",
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(239,124,59,0.45)",
                          borderRadius: "8px",
                          color: "#fff",
                          padding: "0.6rem 0.85rem",
                          fontSize: "0.9rem",
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontWeight: 600,
                          outline: "none",
                          cursor: "pointer",
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

            {/* Subheading below the rotating card */}
            <p
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
                fontWeight: 700,
                color: "#fff",
                textAlign: "center",
                fontStyle: "italic",
                marginBottom: "1.25rem",
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
              }}
            >
              Construction Doesn&apos;t Wait. Neither Should Your{" "}
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

        {/* Trust Badges — bottom of hero (unchanged) */}
        <motion.div
          custom={0.7}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap justify-center items-center gap-8 mt-10 pb-2"
        >
          <img
            src="/images/cpesc-logo-trans.webp"
            alt="CPESC Certified SWPPP Professional"
            style={{ height: "60px", width: "auto" }}
          />
          <img
            src="/images/Guarantee-com-300x300.png"
            alt="100% Compliance Guaranteed"
            style={{ height: "60px", width: "auto" }}
          />
          <img
            src="/images/icon-woman-owned-seal-300x300.png"
            alt="Woman Owned Business"
            style={{ height: "60px", width: "auto" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
