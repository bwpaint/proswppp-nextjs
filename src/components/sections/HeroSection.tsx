'use client';
/*
 * Hero Section — ProSWPPP Redesign (v5)
 * Design: Full-bleed construction site background, two-column layout
 *   LEFT  (50%): Brand headline + star rating + single "Get My SWPPP" CTA
 *                with shake animation matching the top-nav order button.
 *   RIGHT (50%): "Built for Builders" headline + static team photo.
 *                No rotator, no CTA slide, no risk gauge, no Meet Our Team.
 */

import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import TrustBadgesSection from "./TrustBadgesSection";
import ClientLogosSection from "./ClientLogosSection";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/hero-construction-9KtSzH7kq5P7L5DYyJm6oT.webp";
const TEAM_PHOTO = "/images/proswppp-team-800.webp";
const CEO_PHOTO = "https://proswppp.com/wp-content/uploads/2024/08/IMG_4484.jpg";
const PROSWPPP_LOGO = "https://proswppp.com/wp-content/uploads/2023/07/Asset-1-1-logo-2.png";

// Right-column rotator slides
const PHASES = ["photo", "derek", "will"] as const;
type Phase = (typeof PHASES)[number];
const PHASE_DURATIONS_MS: Record<Phase, number> = {
  photo: 6000,
  derek: 8000,
  will:  8000,
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
  // Right-column slider — auto-rotates every 6-8s, pauses on hover.
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

      {/* Two-column content — sits 20px below the nav, every gap collapsed */}
      <div className="relative z-10 container pt-5 pb-0">
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
              className="uppercase tracking-widest text-sm mb-0"
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "0.2em",
                color: "#FFFFFF",
                lineHeight: 1,
              }}
            >
              America&apos;s #1 SWPPP
            </motion.p>

            {/* Main Headline — reduced + whitespace-nowrap so it stays on
                a single line at every viewport width. */}
            <motion.h1
              custom={0.1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="uppercase leading-none mb-0 whitespace-nowrap"
              style={{
                fontSize: "clamp(1.6rem, 4.2vw, 3.25rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                color: "#7B9CD1",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
              }}
            >
              Get Your <span style={{ fontSize: "130%", display: "inline-block", lineHeight: 0.9 }}>SWPPP</span>
            </motion.h1>

            {/* Subheadline — single line; font sized so it matches the
                H1 "Get Your SWPPP" width (H1 has ~15-char effective length
                thanks to the SWPPP 130% scale; H2 is 24 chars, so the H2
                base font is ~45% smaller than the H1 base). */}
            <motion.h2
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="leading-none mb-0 whitespace-nowrap uppercase"
              style={{
                fontSize: "clamp(1.2rem, 3.2vw, 2.5rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#DE863F",
                lineHeight: 0.9,
              }}
            >
              In 72 hrs. or it&apos;s FREE!
            </motion.h2>

            {/* CTA — single big "Get My SWPPP" (uses the same prominent
                styling as the right-column 'Start My Order' slide button). */}
            <motion.div
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4 mt-4"
            >
              <a
                href="/get-your-swppp/?start=map"
                className="btn-orange btn-hero-sweep nav-order-btn inline-block"
                style={{
                  fontSize: "1.5rem",
                  padding: "1rem 2.4rem",
                  borderRadius: "12px",
                  fontWeight: 900,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  boxShadow: "0 6px 18px rgba(222,134,63,0.35)",
                }}
              >
                Get My SWPPP →
              </a>
            </motion.div>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              RIGHT: Built for Builders + static team photo
              ──────────────────────────────────────────────────────────────── */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Heading above the rotator — half the previous height per owner */}
            <h2
              className="uppercase leading-none mb-0"
              style={{
                fontSize: "clamp(1rem, 1.9vw, 1.5rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textAlign: "center",
                lineHeight: 0.9,
                color: "#CFCFCF",
              }}
            >
              Peace of Mind for Your Permitting
            </h2>

            {/* 3-slide rotator: team photo -> Derek quote -> Will M review.
                Hovering pauses rotation. Team photo stays in the DOM so it
                dictates the natural card height; other slides fade in over it. */}
            <div
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              tabIndex={0}
              style={{
                position: "relative",
                width: "100%",
                marginTop: "0.5rem",
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
                {/* Team photo — always rendered (dictates card height) */}
                <motion.img
                  src={TEAM_PHOTO}
                  alt="The Pro SWPPP Team"
                  initial={false}
                  animate={{ opacity: phase === "photo" ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />

                <AnimatePresence mode="wait" initial={false}>
                  {phase === "derek" && (
                    <motion.div
                      key="derek"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        padding: "1.75rem 2rem",
                        background: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <img
                        src={CEO_PHOTO}
                        alt="Derek E. Chinners"
                        style={{
                          width: "110px",
                          height: "110px",
                          objectFit: "cover",
                          border: "4px solid #DE863F",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                        }}
                      />
                      <blockquote
                        style={{
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontStyle: "italic",
                          fontSize: "1rem",
                          lineHeight: 1.55,
                          color: "#000000",
                          margin: 0,
                        }}
                      >
                        &ldquo;When you pick Pro SWPPP for your project your
                        calls get returned, your questions get answered, and
                        your permitting becomes one less thing to worry
                        about&hellip; Every Time.&rdquo;
                      </blockquote>
                      <p
                        style={{
                          fontFamily:
                            "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                          fontWeight: 800,
                          fontSize: "0.78rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#DE863F",
                          margin: 0,
                        }}
                      >
                        Derek E. Chinners &mdash; CEO, Pro SWPPP
                      </p>
                    </motion.div>
                  )}

                  {phase === "will" && (
                    <motion.div
                      key="will"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        padding: "1.75rem 2rem",
                        background: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "1rem",
                      }}
                    >
                      {/* 175-5 [★★★★★] Reviews — combined count token + stars + label */}
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                        <span
                          style={{
                            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontWeight: 900,
                            fontSize: "1.5rem",
                            color: "#000000",
                            lineHeight: 1,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          175-5
                        </span>
                        <div style={{ display: "flex", gap: "3px" }}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={22}
                              style={{ fill: "#FFB800", color: "#FFB800" }}
                            />
                          ))}
                        </div>
                        <span
                          style={{
                            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#000000",
                            lineHeight: 1,
                          }}
                        >
                          Reviews
                        </span>
                      </div>

                      {/* Italic quote */}
                      <blockquote
                        style={{
                          fontFamily: "'Roboto', Arial, sans-serif",
                          fontStyle: "italic",
                          fontSize: "0.95rem",
                          lineHeight: 1.55,
                          color: "#000000",
                          margin: 0,
                          textAlign: "center",
                        }}
                      >
                        &ldquo;Pro SWPPP lives up to their name! They are truly
                        pros! Super-fast turnaround, and they were able to
                        modify the documents needed within 24 hours due to a
                        last-minute change in on-site personnel. Could not be
                        happier with their service and performance.&rdquo;
                      </blockquote>

                      {/* Footer: name/title left, ProSWPPP small logo right */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "1rem",
                          paddingTop: "0.5rem",
                          borderTop: "1px solid rgba(0,0,0,0.10)",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              fontFamily:
                                "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                              fontWeight: 900,
                              fontSize: "1rem",
                              color: "#000000",
                              margin: 0,
                              lineHeight: 1.1,
                            }}
                          >
                            Will M.
                          </p>
                          <p
                            style={{
                              fontFamily: "'Roboto', Arial, sans-serif",
                              fontWeight: 600,
                              fontSize: "0.78rem",
                              color: "#DE863F",
                              margin: "2px 0 0",
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                            }}
                          >
                            Construction Owner
                          </p>
                        </div>
                        <img
                          src={PROSWPPP_LOGO}
                          alt="Pro SWPPP"
                          style={{ height: "38px", width: "auto", display: "block" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
          className="flex flex-wrap justify-center items-start gap-12 mt-8 pb-0"
        >
          {([
            {
              src: "/images/google-5-star-badge.svg",
              label: "175 Google Reviews",
              whiteBg: false,
              href: "https://www.google.com/search?q=proswppp#lrd=0x8640ac2d6bdc430d:0x746cb5aa6bc76e9,1",
            },
            {
              src: "/images/Accredited_Business_Seal_NoRating_RGB.svg.svg",
              label: "BBB Accredited Business",
              whiteBg: false,
              href: "https://www.bbb.org/us/tx/kingwood/profile/water-pollution-control/pro-swppp-llc-0915-90073436",
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
              src: "/images/Guarantee-com-300x300.png",
              label: "100% Compliance Guaranteed",
              whiteBg: false,
              href: null,
            },
          ] as const).map((badge) => {
            // BBB seal is a wide 2.65:1 rectangle — give it a larger frame so
            // it stays readable and isn't shrunk into the square 80x80 slot.
            const isBBB     = badge.label === "BBB Accredited Business";
            const frameW    = isBBB ? 212 : 80;
            const frameH    = isBBB ?  80 : 80;
            const wrapperW  = isBBB ? 224 : 120;

            const inner = (
              <>
                <div
                  style={{
                    width: `${frameW}px`,
                    height: `${frameH}px`,
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
                  {isBBB ? "Accredited Business" : badge.label}
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
                style={{ width: `${wrapperW}px`, textDecoration: "none" }}
                aria-label={`${badge.label} (opens in a new tab)`}
              >
                {inner}
              </a>
            ) : (
              <div
                key={badge.label}
                className="flex flex-col items-center"
                style={{ width: `${wrapperW}px` }}
              >
                {inner}
              </div>
            );
          })}
        </motion.div>

      </div>

      {/* Social-proof stack — sits inside the hero, immediately below the
          trust badges row. Reviews first, client logos second. Wrapped in
          a relative z-10 div so they sit above the hero gradient overlay. */}
      <div className="relative z-10 w-full">
        <TrustBadgesSection />
        <ClientLogosSection />
      </div>
    </section>
  );
}
