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
import Image from "next/image";
import TrustBadgesSection from "./TrustBadgesSection";
import ClientLogosSection from "./ClientLogosSection";

// Local copy — was a 263 KB CloudFront WebP (1920x1072). Served through
// next/image so Vercel generates responsive WebP variants per viewport
// (mobile ~60-80 KB instead of 263 KB). Big LCP win vs. the CSS
// background-image approach which can't be optimized.
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
    <section className="relative min-h-[70vh] flex flex-col overflow-hidden">
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

            {/* Brand-intro paragraph under the CTA. ~11-14px responsive. */}
            <motion.p
              custom={0.6}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              style={{
                marginTop: "1rem",
                fontFamily: "'Roboto', Arial, sans-serif",
                fontWeight: 400,
                fontSize: "clamp(0.7rem, 1.1vw, 0.85rem)",
                lineHeight: 1.5,
                color: "#FFFFFF",
                maxWidth: "44ch",
              }}
            >
              Pro SWPPP, LLC is a leading nationwide provider of Stormwater
              Pollution Prevention Plans (SWPPPs). Headquartered in Houston,
              TX, we help clients maintain full environmental compliance with
              all Federal, State, and Local permitting regulations, including
              the NPDES Construction General Permit and Industrial
              multi-sector permits.
            </motion.p>
          </div>

          {/* ────────────────────────────────────────────────────────────────
              RIGHT: Storm Water Pollution Prevention Plan eyebrow + team
              photo + "Peace of Mind for Your Permitting" bottom overlay
              ──────────────────────────────────────────────────────────────── */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Eyebrow above the team photo — sized to match the
                "America's #1 SWPPP" eyebrow on the left column */}
            <h2
              className="text-sm mb-2"
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontWeight: 400,
                letterSpacing: "0.05em",
                textAlign: "center",
                lineHeight: 1.2,
                color: "#FFFFFF",
              }}
            >
              Storm Water Pollution Prevention Plan
            </h2>

            {/* Team photo with a bottom-anchored gradient overlay carrying
                the "Peace of Mind for Your Permitting" headline */}
            <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden" }}>
              <img
                src={TEAM_PHOTO}
                alt="The Pro SWPPP Team"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "2.5rem 1rem 1.25rem",
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.88) 100%)",
                  color: "#FFFFFF",
                  textAlign: "center",
                }}
              >
                <span
                  className="uppercase"
                  style={{
                    fontFamily:
                      "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(1rem, 2.2vw, 1.6rem)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                  }}
                >
                  Peace of Mind for Your Permitting
                </span>
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

      {/* Social-proof stack — restored under the trust badges row. */}
      <div className="relative z-10 w-full">
        <TrustBadgesSection />
        <ClientLogosSection />
      </div>
    </section>
  );
}
