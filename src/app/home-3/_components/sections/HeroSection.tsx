'use client';
/*
 * Hero Section — /home-3/ benchmark (stripped to a single static panel)
 * Removed: rotation timer, AnimatePresence, phase slides (photo/text/risk),
 * risk-gauge SVG + US_STATES + needle keyframes, nav arrow buttons, the
 * "Construction Doesn't Wait" subhead, and the "Meet Our Team" button.
 * Kept: LEFT column verbatim + the v2 first-slide CTA panel as a static
 * block + trust badges + bottom tagline + the next/image hero bg.
 */

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const HERO_BG = "/images/hero-construction.webp";
const TEAM_PHOTO = "/images/proswppp-team-800.webp";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <Image
        src={HERO_BG}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center top", zIndex: 0 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(158deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.68) 35%, rgba(0,0,0,0.78) 65%, rgba(0,0,0,0.88) 100%)",
        }}
      />
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
              RIGHT: Static "Get Your SWPPP Now" CTA panel (frozen first slide)
              ──────────────────────────────────────────────────────────────── */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                padding: "2rem 1.75rem",
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, rgba(13,31,43,0.85) 0%, rgba(26,58,74,0.85) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
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
                Get Your <span style={{ color: "#EF7C3B" }}>SWPPP</span> Now
              </h3>
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
                Select your state below to get started. Your fully compliant
                SWPPP delivered within 72 hours — guaranteed.
              </p>
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
