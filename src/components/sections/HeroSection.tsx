'use client';
/*
 * Hero Section — ProSWPPP Redesign (v5)
 * Design: Full-bleed construction site background, two-column layout
 *   LEFT  (50%): Brand headline + star rating + single "Get My SWPPP" CTA
 *                with shake animation matching the top-nav order button.
 *   RIGHT (50%): "Built for Builders" headline + static team photo.
 *                No rotator, no CTA slide, no risk gauge, no Meet Our Team.
 */

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star } from "lucide-react";
import TrustBadgesSection from "./TrustBadgesSection";
import ClientLogosSection from "./ClientLogosSection";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/hero-construction-9KtSzH7kq5P7L5DYyJm6oT.webp";
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
                color: "#7B9CD1",
                lineHeight: 1,
              }}
            >
              America&apos;s #1 SWPPP
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              custom={0.1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="uppercase leading-none mb-0"
              style={{
                fontSize: "clamp(3.36rem, 6.6vw, 6rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                color: "#7B9CD1",
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
              }}
            >
              Get Your <span style={{ fontSize: "130%", display: "inline-block", lineHeight: 0.9 }}>SWPPP</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.h2
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="leading-none mb-0"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#DE863F",
                lineHeight: 0.9,
              }}
            >
              In 72 hrs., or it&apos;s FREE!
            </motion.h2>

            {/* Supporting text */}
            <motion.div
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-0"
            >
              <p
                className="text-gray-300 uppercase tracking-wide text-sm mb-0"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400, lineHeight: 1 }}
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
              className="flex items-center gap-2 mb-0"
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

            {/* CTA — single big "Get My SWPPP" (uses the same prominent
                styling as the right-column 'Start My Order' slide button). */}
            <motion.div
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4"
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
            {/* Heading: Built for Builders */}
            <h2
              className="text-white uppercase leading-none mb-0"
              style={{
                fontSize: "clamp(2rem, 3.8vw, 3rem)",
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                textAlign: "center",
                lineHeight: 0.9,
              }}
            >
              Built for <span style={{ color: "#DE863F" }}>Builders</span>
            </h2>

            {/* Static team photo — no slider, no overlays */}
            <img
              src={TEAM_PHOTO}
              alt="The Pro SWPPP Team"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "10px",
                marginTop: "0.5rem",
              }}
            />
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
          className="flex flex-wrap justify-center items-start gap-12 mt-1 pb-0"
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
