'use client';
/*
 * Hero Section — ProSWPPP Redesign (v3)
 * - Orange tagline banner directly under the nav, full-width: "America's Number
 *   One Stormwater Pollution Prevention Plan Service"
 * - Two-column layout below:
 *     LEFT  (50%): Stars + Google review count (moved to TOP) + brand
 *                  headline + "Get My SWPPP" CTA (single CTA; no Take the Quiz)
 *     RIGHT (50%): "Who We Are — Built for Builders" panel with a 2-slide
 *                  rotating card:
 *                    Slide 1 — Derek Chinners promise card
 *                              (headline + photo + quote + signature)
 *                    Slide 2 — Team photo with descriptive text overlay
 * - Trust badges row at the bottom; no separate tagline below the badges
 *   (that tagline now lives in the orange banner at the top).
 *
 * Backup of the previous design lives at:
 *   /backups/HeroSection-v2-rotating-team-card.tsx (if needed for revert)
 */

import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/hero-construction-9KtSzH7kq5P7L5DYyJm6oT.webp";
const TEAM_PHOTO = "/images/proswppp-team-800.webp";
const CEO_PHOTO = "https://proswppp.com/wp-content/uploads/2024/08/IMG_4484.jpg";

// TODO: wire this to Google Places API for live count. Hard-coded for now.
const GOOGLE_REVIEW_COUNT = "200+";

const PHASES = ["derek", "team"] as const;
type Phase = (typeof PHASES)[number];
// Dwell time per phase, in ms.
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
  // Right-column rotating card cycles two slides (Derek card -> Team photo
  // with text) on a continuous loop. Hovering pauses rotation.
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
      {/* Dark gradient overlay — lightest top-left, darkest toward bottom-right center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(158deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.68) 35%, rgba(0,0,0,0.78) 65%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* ────────────────────────────────────────────────────────────────
          Orange tagline banner — directly under the navigation, full-width
          ──────────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full"
        style={{ background: "#EF7C3B" }}
      >
        <div className="container py-2.5">
          <p
            className="text-center text-white uppercase"
            style={{
              fontFamily: "'Roboto', Arial, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(0.85rem, 1.15vw, 1rem)",
              letterSpacing: "0.18em",
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
      <div className="relative z-10 container pt-12 lg:pt-20 pb-2.5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ────────────────────────────────────────────────────────────
              LEFT: Stars + reviews (top) + headline + single CTA
              ──────────────────────────────────────────────────────────── */}
          <div>
            {/* Stars + Google review count — moved to TOP per owner */}
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

            {/* Single CTA — "Get My SWPPP" (no Take the Quiz) */}
            <motion.div
              custom={0.3}
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
            </motion.div>
          </div>

          {/* ────────────────────────────────────────────────────────────
              RIGHT: Who We Are — Built for Builders (2-slide rotator)
              ──────────────────────────────────────────────────────────── */}
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

            {/* Rotating card. Team photo stays in the DOM at all times so
                it dictates the card height at its natural aspect ratio.
                Slides fade in/out on top of it. */}
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
                {/* Team photo — always in the DOM. Visible only on the "team"
                    slide; otherwise sits behind the Derek overlay. */}
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
                          "linear-gradient(135deg, rgba(13,31,43,0.92) 0%, rgba(26,58,74,0.92) 100%)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      {/* Headline links to the order page */}
                      <a
                        href="/get-your-swppp/"
                        style={{ textDecoration: "none", display: "block", marginBottom: "1.1rem" }}
                      >
                        <h3
                          style={{
                            color: "#ffffff",
                            fontFamily:
                              "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontSize: "clamp(1.15rem, 1.7vw, 1.55rem)",
                            fontWeight: 900,
                            lineHeight: 1.15,
                            letterSpacing: "-0.01em",
                            margin: "0 0 0.4rem",
                          }}
                        >
                          Order Your SWPPP Now and Your Site Will Be
                        </h3>
                        <h4
                          style={{
                            color: "#EF7C3B",
                            fontFamily:
                              "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontSize: "clamp(1rem, 1.45vw, 1.3rem)",
                            fontWeight: 900,
                            lineHeight: 1.15,
                            letterSpacing: "-0.01em",
                            margin: 0,
                          }}
                        >
                          Fully Compliant in Just 72 Hours, Guaranteed
                        </h4>
                      </a>

                      {/* Derek photo + quote */}
                      <div
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "flex-start",
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          borderRadius: "12px",
                          padding: "0.9rem 1rem",
                        }}
                      >
                        <img
                          src={CEO_PHOTO}
                          alt="Derek E. Chinners – CEO, Pro SWPPP"
                          style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "9999px",
                            objectFit: "cover",
                            border: "3px solid #EF7C3B",
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p
                            style={{
                              fontFamily: "'Roboto', Arial, sans-serif",
                              fontStyle: "italic",
                              fontSize: "0.85rem",
                              lineHeight: 1.45,
                              color: "rgba(255,255,255,0.92)",
                              margin: "0 0 0.4rem",
                            }}
                          >
                            &ldquo;I guarantee full service &amp; support
                            throughout the duration of your project.&rdquo;
                          </p>
                          <p
                            style={{
                              fontFamily:
                                "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                              fontWeight: 800,
                              fontSize: "0.72rem",
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                              color: "#FFD9A8",
                              margin: 0,
                            }}
                          >
                            Derek E. Chinners – CEO, Pro SWPPP
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {phase === "team" && (
                    <motion.div
                      key="team"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        pointerEvents: "none",
                      }}
                    >
                      {/* Dark gradient at the bottom for text readability */}
                      <div
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
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges — bottom of hero. Four uniformly-sized icons with
            a small caption underneath each. */}
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
