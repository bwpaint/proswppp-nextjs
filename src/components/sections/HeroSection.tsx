'use client';
/*
 * Hero Section — ProSWPPP Redesign
 * Design: Full-bleed construction site background, two-column layout
 * LEFT (50%): Brand headline copy + star rating + two CTAs (orange + light blue)
 * RIGHT (50%): Eyebrow line + Contact form — First/Last, Company, Email/Phone, Interest
 * Both columns flush to top with items-start alignment
 */

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/hero-construction-9KtSzH7kq5P7L5DYyJm6oT.webp";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const INTEREST_OPTIONS = [
  "New SWPPP",
  "SWPPP Revision",
  "SWPPP Inspection",
  "Annual Report",
  "General Question",
];

export default function HeroSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    interest: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will be wired to Fluent Forms REST API endpoint
    window.location.href = "https://proswppp.com/get-your-swppp/";
  };

  return (
    <section
      className="relative min-h-[50vh] flex items-center"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      {/* Dark gradient overlay — lightened left by 15%, right by 8% per design */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.78) 40%, rgba(0,0,0,0.65) 65%, rgba(0,0,0,0.47) 100%)' }} />

      {/* Two-column content — items-start so both columns flush to top */}
      <div className="relative z-10 container py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* ── LEFT: Copy ── */}
          <div>
            {/* Eyebrow — same style as right column eyebrow */}
            <motion.p
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="uppercase tracking-widest text-sm mb-4"
              style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400, letterSpacing: "0.2em", color: "#FFB800" }}
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

            {/* Subheadline — mixed case */}
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
              In 72 hrs.,<br />or it's FREE!
            </motion.h2>

            {/* Supporting text */}
            <motion.div
              custom={0.3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-5"
            >
              <p className="text-white uppercase tracking-wide text-base mb-1"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400 }}>
                Order Now… Because We're America's #1 SWPPP
              </p>
              <p className="text-gray-300 uppercase tracking-wide text-sm"
                style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400 }}>
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
              <span className="text-white text-sm" style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400 }}>
                5.0 Google Reviews
              </span>
            </motion.div>

            {/* CTAs — two buttons side by side */}
            <motion.div
              custom={0.5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-wrap gap-4"
            >
              <a
                href="https://proswppp.com/get-your-swppp/"
                className="btn-orange btn-hero-sweep text-base px-8 py-4 inline-block"
              >
                Get My SWPPP
              </a>
              <a
                href=""
                className="btn-blue text-base px-8 py-4 inline-block"
              >
                Start Free Quotation
              </a>
            </motion.div>
          </div>

          {/* ── RIGHT: Eyebrow + Contact Form ── */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            {/* Eyebrow above form — same size/style as left column eyebrow */}
            <p
              className="text-[#EF7C3B] uppercase tracking-widest text-sm mb-4 text-center"
              style={{ fontFamily: "'Roboto', Arial, sans-serif", fontWeight: 400, letterSpacing: "0.2em" }}
            >
              Number One Stormwater Pollution Prevention<br />
              Plan Service in the U.S.
            </p>

            <div
              className="rounded-2xl p-6 lg:p-8"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <h3
                className="text-white mb-1 uppercase"
                style={{
                  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: "1.25rem",
                  letterSpacing: "-0.01em",
                }}
              >
                Contact for FREE Consultation
              </h3>
              <p className="text-gray-400 text-sm mb-5" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                We'll get back to you within 1 business hour.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Row 1: First + Last name */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="hero-input"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="hero-input"
                    required
                  />
                </div>

                {/* Row 2: Company (full width) */}
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company"
                  className="hero-input w-full"
                />

                {/* Row 3: Email + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="hero-input"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="hero-input"
                  />
                </div>

                {/* Row 4: Interest (full width) */}
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="hero-input w-full"
                  style={{ color: formData.interest ? "white" : "rgba(255,255,255,0.45)" }}
                >
                  <option value="" disabled>Interest</option>
                  {INTEREST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} style={{ color: "#000" }}>{opt}</option>
                  ))}
                </select>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full btn-orange text-base py-3.5 mt-1"
                >
                  Get My Free Estimate
                </button>
              </form>

              {/* Catchphrase below form */}
              <p
                style={{
                  fontFamily: "'Roboto', Arial, sans-serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "0.9375rem",
                  textAlign: "center",
                  marginTop: "1rem",
                  background: "linear-gradient(90deg, #EF7C3B 0%, #6B9ED1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "0.01em",
                }}
              >
                Get Compliant Today. Stay Compliant Tomorrow.
              </p>

              {/* SWPPP definition paragraph */}
              <div style={{ marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: "1rem" }}>
                <p
                  style={{
                    fontFamily: "'Roboto', Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: "calc(11rem / 16)",
                    color: "rgba(200,210,220,0.85)",
                    lineHeight: "1.65",
                    margin: 0,
                  }}
                >
                  A Stormwater Pollution Prevention Plan (SWPPP) is a site-specific document designed to minimize environmental impact from construction or industrial projects. It identifies potential pollutant sources and outlines Best Management Practices (BMPs) to control erosion and runoff. Regulated under NPDES standards, it ensures compliance through site mapping and regular inspections.{" "}
                  <a
                    href="/swppp-glossary/"
                    style={{
                      color: "#EF7C3B",
                      fontWeight: 600,
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Read More →
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
