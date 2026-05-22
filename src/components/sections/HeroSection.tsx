'use client';
/*
 * Hero Section — ProSWPPP Redesign (v4)
 * - Orange-TYPE tagline directly under the orange announcement bar:
 *   "America's Number One Stormwater Pollution Prevention Plan Service"
 *   (orange #EF7C3B text on the dark hero, no orange band)
 * - LEFT column:
 *     stars + 200+ 5-Star Google Reviews
 *     H1 "Get Your SWPPP" — the SWPPP word is in brand blue
 *     H2 "In 72 hrs., or it's FREE!"
 *     "Get My SWPPP" CTA with an attention-grabbing animated SVG circle +
 *     curved arrow that draws after the page loads
 * - RIGHT column: "Built for Builders" headline + 2-slide rotator:
 *     Slide A — TEAM photo. Descriptive text overlay FADES IN then FADES OUT
 *               within the slide window so the photo is the final state.
 *     Slide B — DEREK card (full-card replacement, not laid over the photo).
 *               Larger Derek photo + larger quote + new single-line headline:
 *               "Order your SWPPP now, and your site will be fully compliant
 *                in just 72 hours, guaranteed!"
 * - Trust badges row at the bottom. No tagline below the badges (that
 *   content now lives in the orange-type line at the top).
 */

import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/hero-construction-9KtSzH7kq5P7L5DYyJm6oT.webp";
const TEAM_PHOTO = "/images/proswppp-team-800.webp";
const CEO_PHOTO = "https://proswppp.com/wp-content/uploads/2024/08/IMG_4484.jpg";

// TODO: wire to Google Places API for live count. Hard-coded placeholder.
const GOOGLE_REVIEW_COUNT = "200+";

const PHASES = ["derek", "team"] as const;
type Phase = (typeof PHASES)[number];
const PHASE_DURATIONS_MS: Record<Phase, number> = {
  derek: 8000,
  team: 8000,
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HeroSection() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const phase: Phase = PHASES[phaseIdx];

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      setPhaseIdx((i) => (i + 1) % PHASES.length);
    }, PHASE_DURATIONS_MS[phase]);
    return () => clearTimeout(t);
  }, [paused, phase, phaseIdx]);

  return (
    <section
      className="relative min-h-[70vh] flex flex-col"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(158deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.68) 35%, rgba(0,0,0,0.78) 65%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* ────────────────────────────────────────────────────────────────
          Tagline — orange TYPE on the dark hero, directly under the nav
          ──────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full">
        <div className="container pt-5 pb-1">
          <p
            className="text-center uppercase"
            style={{
              color: "#EF7C3B",
              fontFamily: "'Roboto', Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(0.85rem, 1.15vw, 1rem)",
              letterSpacing: "0.2em",
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            America&apos;s Number One Stormwater Pollution Prevention Plan Service
          </p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────
          Two-column hero content
          ──────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 container pt-8 lg:pt-14 pb-2.5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ────────────────────────────────────────────────────────────
              LEFT
              ──────────────────────────────────────────────────────────── */}
          <div>
            {/* Stars + Google review count — TOP */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center gap-2 mb-5"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={22} className="fill-[#FFB800] text-[#FFB800]" />
                ))}
              </div>
              <span
                className="text-white text-sm"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 600 }}
              >
                {GOOGLE_REVIEW_COUNT} 5-Star Google Reviews
              </span>
            </motion.div>

            {/* Main Headline — SWPPP in brand blue */}
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
              Get Your{" "}
              <span
                style={{
                  fontSize: "130%",
                  display: "inline-block",
                  color: "#6B9ED1",
                }}
              >
                SWPPP
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.h2
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="leading-none mb-10"
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

            {/* Single CTA — wrapped in a relative container that hosts the
                animated SVG circle + arrow overlay. */}
            <motion.div
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4"
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                <a
                  href="/get-your-swppp/?start=map"
                  className="btn-orange btn-hero-sweep text-base px-8 py-4 inline-block relative z-10"
                >
                  Get My SWPPP
                </a>

                {/* Attention-grabbing circle + arrow that draws after a
                    short delay once the page is loaded. */}
                <svg
                  aria-hidden="true"
                  width="380"
                  height="220"
                  viewBox="0 0 380 220"
                  style={{
                    position: "absolute",
                    left: "-60px",
                    top: "-80px",
                    pointerEvents: "none",
                    overflow: "visible",
                  }}
                >
                  {/* Ellipse "circle" around the CTA */}
                  <motion.ellipse
                    cx="170"
                    cy="110"
                    rx="135"
                    ry="46"
                    fill="none"
                    stroke="#FFB800"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 1.8,
                      duration: 1.3,
                      ease: "easeInOut",
                    }}
                  />
                  {/* Curved arrow shaft — comes in from the upper right */}
                  <motion.path
                    d="M 345 15 C 370 70, 360 105, 305 110"
                    fill="none"
                    stroke="#FFB800"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 3.2,
                      duration: 0.9,
                      ease: "easeOut",
                    }}
                  />
                  {/* Arrowhead — appears once the shaft finishes drawing */}
                  <motion.polygon
                    points="305,110 320,100 320,120"
                    fill="#FFB800"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 4.1,
                      duration: 0.3,
                      ease: "backOut",
                    }}
                    style={{ transformOrigin: "305px 110px" }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>

          {/* ────────────────────────────────────────────────────────────
              RIGHT — Built for Builders + 2-slide rotator
              ──────────────────────────────────────────────────────────── */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Heading — "Who We Are" eyebrow removed per owner */}
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
                {/* Team photo — always in the DOM, dictates card height */}
                <img
                  src={TEAM_PHOTO}
                  alt="The Pro SWPPP Team"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />

                <AnimatePresence mode="wait" initial={false}>
                  {phase === "derek" && (
                    <motion.div
                      key="derek"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        padding: "1.5rem 1.75rem",
                        background:
                          "linear-gradient(135deg, rgba(13,31,43,0.96) 0%, rgba(26,58,74,0.96) 100%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "1.1rem",
                      }}
                    >
                      {/* Headline — single line, linked to the order page */}
                      <a
                        href="/get-your-swppp/"
                        style={{ textDecoration: "none", display: "block" }}
                      >
                        <h3
                          style={{
                            color: "#ffffff",
                            fontFamily:
                              "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontSize: "clamp(1.05rem, 1.55vw, 1.45rem)",
                            fontWeight: 900,
                            lineHeight: 1.2,
                            letterSpacing: "-0.01em",
                            margin: 0,
                            textAlign: "center",
                          }}
                        >
                          Order your{" "}
                          <span style={{ color: "#EF7C3B" }}>SWPPP</span> now,
                          and your site will be fully compliant in just{" "}
                          <span style={{ color: "#EF7C3B" }}>72 hours</span>,
                          guaranteed!
                        </h3>
                      </a>

                      {/* Larger Derek photo + larger quote, centered */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.8rem",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: "14px",
                          padding: "1.1rem 1.25rem",
                        }}
                      >
                        <img
                          src={CEO_PHOTO}
                          alt="Derek E. Chinners – CEO, Pro SWPPP"
                          style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "9999px",
                            objectFit: "cover",
                            border: "4px solid #EF7C3B",
                            flexShrink: 0,
                            boxShadow: "0 6px 22px rgba(0,0,0,0.45)",
                          }}
                        />
                        <blockquote
                          style={{
                            fontFamily: "'Roboto', Arial, sans-serif",
                            fontStyle: "italic",
                            fontSize: "1.02rem",
                            lineHeight: 1.5,
                            color: "rgba(255,255,255,0.95)",
                            margin: 0,
                            textAlign: "center",
                          }}
                        >
                          &ldquo;I guarantee full service &amp; support
                          throughout the duration of your project.&rdquo;
                        </blockquote>
                        <p
                          style={{
                            fontFamily:
                              "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontWeight: 800,
                            fontSize: "0.78rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "#FFD9A8",
                            margin: 0,
                            textAlign: "center",
                          }}
                        >
                          Derek E. Chinners – CEO, Pro SWPPP
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {phase === "team" && (
                    <motion.div
                      key="team"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        pointerEvents: "none",
                      }}
                    >
                      {/* Text fades IN, holds, then fades OUT within the
                          slide window — leaving just the team photo. */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{
                          duration: 7.5,
                          times: [0, 0.18, 0.72, 1],
                          ease: "easeInOut",
                        }}
                        style={{
                          padding: "2.5rem 1.5rem 1.25rem",
                          background:
                            "linear-gradient(180deg, rgba(13,31,43,0) 0%, rgba(13,31,43,0.78) 35%, rgba(13,31,43,0.95) 100%)",
                          color: "rgba(255,255,255,0.95)",
                          fontFamily: "'Roboto', Arial, sans-serif",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.92rem",
                            lineHeight: 1.5,
                            margin: "0 0 0.55rem",
                          }}
                        >
                          Pro SWPPP is a nationwide stormwater pollution
                          prevention plan service built for contractors,
                          developers, and site managers who need compliance
                          fast — without the runaround.
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontStyle: "italic",
                            color: "#EF7C3B",
                            fontWeight: 700,
                            fontSize: "0.92rem",
                            lineHeight: 1.5,
                          }}
                        >
                          No waiting weeks. No confusing templates. Just a
                          permit-ready plan in your inbox.
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          custom={0.7}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-wrap justify-center items-start gap-12 mt-20 pb-2"
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
      </div>
    </section>
  );
}
