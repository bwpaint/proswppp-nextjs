'use client';
/*
 * About Page — ProSWPPP Redesign
 * Sections:
 *   1. Hero — dark navy, headline + subhead + stats row
 *   2. CEO Guarantee — two-column: copy left, image right
 *   3. Mission / Vision
 *   4. Core Values grid
 *   5. Why Choose Us — differentiators
 *   6. CTA strip
 */

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Shield, Star, Clock, Award, Heart, CheckCircle2, Phone } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/hero-construction-9KtSzH7kq5P7L5DYyJm6oT.webp';

const stats = [
  { value: '17+', label: 'Years Experience' },
  { value: '5★', label: 'Google Rating' },
  { value: '72hr', label: 'Delivery or FREE' },
  { value: '0', label: 'Compliance Issues' },
];

const values = [
  { icon: Heart, label: 'Faith', desc: 'We approach every project with integrity rooted in unwavering principles.' },
  { icon: Shield, label: 'Trust', desc: 'Our clients rely on us completely — and we never let them down.' },
  { icon: Star, label: 'Integrity', desc: 'Honest pricing, transparent process, and accurate documentation every time.' },
  { icon: CheckCircle2, label: 'Reliability', desc: 'On-time delivery guaranteed. 72 hours or your SWPPP is free.' },
  { icon: Award, label: 'Accuracy', desc: 'Precision-drafted SWPPPs that pass inspections the first time.' },
  { icon: Clock, label: 'Simplification', desc: 'We make stormwater compliance simple so you can focus on building.' },
];

const differentiators = [
  {
    title: 'SWPPP-Exclusive Specialists',
    desc: "We write SWPPPs and only SWPPPs. Unlike firms that bundle stormwater as an add-on, it's all we do — making us faster, sharper, and more affordable.",
  },
  {
    title: '17 Years, Zero Compliance Issues',
    desc: 'Every SWPPP we have delivered has passed regulatory inspection. That track record is not luck — it is built on deep expertise and meticulous process.',
  },
  {
    title: 'Faster Turnaround, Lower Cost',
    desc: 'Our streamlined process delivers in 72 hours at a fraction of what traditional engineering firms charge, without sacrificing accuracy or compliance.',
  },
  {
    title: 'Personal CEO Involvement',
    desc: 'Our CEO personally oversees every project and guarantees your support throughout the permitting process — not a call center, a real expert.',
  },
  {
    title: 'Nationwide Coverage',
    desc: 'From California to Georgia, we are licensed and experienced across all 50 states and understand each jurisdiction\'s unique requirements.',
  },
  {
    title: 'Woman-Owned Business',
    desc: 'Proudly woman-owned and operated, bringing a commitment to excellence and a personal touch to every client relationship.',
  },
];

export default function AboutClient() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-24 lg:py-36 flex items-center"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/70" />
        <div className="relative z-10 container">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="section-label mb-4"
          >
            About Pro SWPPP
          </motion.p>
          <motion.h1
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-white uppercase leading-none mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.03em',
            }}
          >
            America&apos;s <span style={{ color: '#EF7C3B' }}>#1</span><br />SWPPP Service
          </motion.h1>
          <motion.p
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-gray-300 text-lg max-w-xl mb-10 leading-relaxed"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            17 years of exclusive stormwater expertise. Zero compliance issues.
            Trusted by contractors and developers across all 50 states.
          </motion.p>

          {/* Stats row */}
          <motion.div
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div
                  className="text-3xl font-black mb-1"
                  style={{ color: '#EF7C3B', fontFamily: "'Inter', sans-serif" }}
                >
                  {s.value}
                </div>
                <div className="text-gray-400 text-xs uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CEO Guarantee ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <p className="section-label mb-4">CEO Guarantee</p>
              <h2
                className="uppercase leading-none mb-6"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: '#1A3A4A',
                }}
              >
                You Get My Personal<br />
                <span style={{ color: '#EF7C3B' }}>Guarantee</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-5" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                When you order from Pro SWPPP, you are not handed off to a junior associate or a call center. I personally oversee every project from start to finish and guarantee your complete satisfaction throughout the permitting process.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-8" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                My mission is to revolutionize stormwater permitting — making it faster, more affordable, and completely stress-free for every contractor and developer we serve. That is a promise I stand behind with our 72-hour delivery guarantee.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/get-your-swppp/" className="btn-orange">Get My SWPPP</a>
                <a href="tel:8334387977" className="btn-blue flex items-center gap-2">
                  <Phone size={14} />
                  833-GET-SWPP
                </a>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.15}
              className="flex justify-center"
            >
              <div
                className="rounded-2xl p-10 text-center max-w-sm w-full"
                style={{ background: '#111111', border: '1px solid rgba(239,124,59,0.3)' }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(239,124,59,0.15)', border: '2px solid #EF7C3B' }}
                >
                  <Shield size={36} style={{ color: '#EF7C3B' }} />
                </div>
                <p
                  className="text-white font-black text-xl uppercase mb-2"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}
                >
                  72-Hour Delivery
                </p>
                <p
                  className="font-black text-4xl mb-4"
                  style={{ color: '#EF7C3B', fontFamily: "'Inter', sans-serif" }}
                >
                  or it&apos;s FREE
                </p>
                <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                  Your SWPPP delivered within 72 hours of receiving your civil drawings — or you pay nothing. No fine print.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission / Vision ── */}
      <section className="py-20 lg:py-28" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                label: 'Our Mission',
                color: '#EF7C3B',
                text: 'To revolutionize stormwater permitting by delivering fast, accurate, and affordable SWPPPs that keep contractors compliant and construction moving — without the bureaucratic headache.',
              },
              {
                label: 'Our Vision',
                color: '#154FC1',
                text: 'To be the trusted stormwater compliance partner for over 1 million contractors and developers nationwide — the first call every builder makes when they need a SWPPP.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.15}
                className="rounded-2xl p-8"
                style={{ background: '#fff', border: `2px solid ${item.color}30` }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: item.color, fontFamily: "'Roboto', sans-serif" }}
                >
                  {item.label}
                </div>
                <p
                  className="text-[#1A3A4A] text-base leading-relaxed"
                  style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What Drives Us</p>
            <h2
              className="uppercase leading-none"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#1A3A4A',
              }}
            >
              Our Core <span style={{ color: '#EF7C3B' }}>Values</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.08}
                className="rounded-2xl p-6"
                style={{ background: '#f8f9fa', border: '1px solid #e9ecef' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(239,124,59,0.12)' }}
                >
                  <v.icon size={22} style={{ color: '#EF7C3B' }} />
                </div>
                <h3
                  className="font-black text-lg uppercase mb-2"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em', color: '#1A3A4A' }}
                >
                  {v.label}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-20 lg:py-28" style={{ background: '#000000' }}>
        <div className="container">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Why Pro SWPPP</p>
            <h2
              className="text-white uppercase leading-none"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.02em',
              }}
            >
              What Sets Us <span style={{ color: '#EF7C3B' }}>Apart</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {differentiators.map((d, i) => (
              <motion.div
                key={d.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.08}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 size={18} style={{ color: '#EF7C3B', flexShrink: 0, marginTop: 2 }} />
                  <h3
                    className="text-white font-black text-base uppercase"
                    style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}
                  >
                    {d.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed pl-7" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                  {d.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Strip ── */}
      <section className="py-16 lg:py-20" style={{ background: '#EF7C3B' }}>
        <div className="container text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-white uppercase leading-none mb-4"
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}
          >
            Ready to Get Compliant?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
            className="text-white/85 text-lg mb-8 max-w-xl mx-auto"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            Order your SWPPP today and receive it in 72 hours — or it is FREE.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.2}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a
              href="/get-your-swppp/"
              className="bg-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ color: '#EF7C3B', fontFamily: "'Roboto', sans-serif" }}
            >
              Order My SWPPP
            </a>
            <a
              href="tel:8334387977"
              className="btn-outline-white flex items-center gap-2"
            >
              <Phone size={14} />
              833-GET-SWPP
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
