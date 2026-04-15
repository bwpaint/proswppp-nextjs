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
        className="relative py-12 lg:py-18 flex items-center"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/70" />
        <div className="relative z-10 container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left column: label, h1, p, stats */}
            <div>
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
                className="text-gray-300 text-lg mb-10 leading-relaxed"
                style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
              >
                17 years of exclusive Stormwater Pollution Prevention expertise. Zero compliance issues.
                Trusted by contractors and developers across all 50 states.
              </motion.p>

              {/* Stats row */}
              <motion.div
                custom={0.3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
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

            {/* Right column: 72-Hour Delivery guarantee card */}
            <motion.div
              custom={0.2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex justify-center items-center h-full"
            >
              <div className="rounded-2xl p-10 text-center max-w-sm w-full"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(239,124,59,0.3)' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'rgba(239,124,59,0.15)', border: '2px solid #EF7C3B' }}>
                  <Shield size={36} style={{ color: '#EF7C3B' }} />
                </div>
                <p className="text-white font-black text-xl uppercase mb-2"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}>
                  72-Hour Delivery
                </p>
                <p className="font-black text-4xl mb-4" style={{ color: '#EF7C3B', fontFamily: "'Inter', sans-serif" }}>
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

      {/* ── CEO Guarantee ── */}
      <section className="py-20 lg:py-28" style={{ background: '#000000' }}>
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
                  color: '#ffffff',
                }}
              >
                You Get My Personal<br />
                <span style={{ color: '#EF7C3B' }}>Guarantee</span>
              </h2>
              <p className="text-base leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Roboto', Arial, sans-serif" }}>
                When you order from Pro SWPPP, you are not handed off to a junior associate or a call center. I personally oversee every project from start to finish and guarantee your complete satisfaction throughout the permitting process.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Roboto', Arial, sans-serif" }}>
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

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.15} className="flex justify-center">
              <img
                src="/images/IMG_4484.jpg"
                alt="Derek Chinners — Founder & CEO, Pro SWPPP"
                className="rounded-2xl w-full"
                style={{ maxWidth: '420px', border: '2px solid rgba(239,124,59,0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Team Bios ── */}
      <section className="py-20 lg:py-28" style={{ background: '#000000' }}>
        <div className="container">
          <div className="text-center mb-14">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="section-label mb-3"
            >
              Our Team
            </motion.p>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.1}
              className="uppercase leading-none"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              Meet The <span style={{ color: '#EF7C3B' }}>Experts</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Derek Chinners',
                title: 'Founder / CEO',
                photo: '/images/team/derek-chinners.jpg',
                bio: 'Derek has served as the fearless leader of Pro SWPPP for the last 20+ years, guiding the company with unmatched integrity and industry expertise. A CPESC-certified professional who understands exactly what it takes to keep your construction site compliant.',
              },
              {
                name: 'Daniela Chinners',
                title: 'Founder / CFO',
                photo: '/images/team/daniela-chinners.jpg',
                bio: 'As co-founder of Pro SWPPP, Daniela has been a steady force behind the company since day one. She serves as the heart of our organization, brings consistency, and an unmatched sharp financial mind as our CFO.',
              },
              {
                name: 'Terry Harris',
                title: 'Chief Estimator',
                photo: '/images/team/terry-harris.jpg',
                bio: "Terry is a key leader at Pro SWPPP known for his responsiveness and precision. He has an exceptional ability to clearly explain scope, pricing, and expectations so customers know exactly what they're getting — often within seconds of calling.",
              },
              {
                name: 'Michael Hill',
                title: 'Chief Project Manager',
                photo: '/images/team/michael-hill.jpg',
                bio: 'Michael brings extensive expertise in the development and implementation of stormwater pollution prevention plans. His proven track record of proper SWPPP documentation and regulatory adherence ensures your plan meets all state and federal EPA standards.',
              },
              {
                name: 'Sarah Romero',
                title: 'Office Manager / Certified Inspector',
                photo: '/images/team/sarah-romero.jpg',
                bio: 'Sarah serves as our certified inspector with a strong focus on ensuring your jobsite is fully compliant from start to finish. Known for her attention to detail, Sarah is a trusted source for both our customers and our team.',
              },
              {
                name: 'Cameron Williams',
                title: 'Project Manager',
                photo: '/images/team/cameron-williams.jpg',
                bio: 'Cameron supports projects daily through the preparation of SWPPPs, permits, and all related EPA documentation including NOIs and CSNs. His calm, approachable presence makes it easy for customers to get the exact support their jobsite needs.',
              },
              {
                name: 'Josie Godfrey',
                title: 'Marketing Manager / Estimator',
                photo: '/images/team/josie-godfrey.jpg',
                bio: 'Josie serves in a dual role as marketing manager and sales estimator. She leads marketing efforts across social media and industry events, and through her consultative approach helps customers clearly understand our services.',
              },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.08}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(239,124,59,0.2)' }}
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="rounded-xl w-full object-cover mb-4"
                  style={{ height: '220px' }}
                />
                <h3
                  className="font-black text-base uppercase mb-1"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em', color: '#ffffff' }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ color: '#EF7C3B', fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  {member.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission / Vision ── */}
      <section className="py-20 lg:py-28" style={{ background: '#000000' }}>
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
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.12)` }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: item.color, fontFamily: "'Roboto', sans-serif" }}
                >
                  {item.label}
                </div>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.8)', fontFamily: "'Roboto', Arial, sans-serif" }}
                >
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="py-20 lg:py-28" style={{ background: '#000000' }}>
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
                color: '#ffffff',
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
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(239,124,59,0.12)' }}
                >
                  <v.icon size={22} style={{ color: '#EF7C3B' }} />
                </div>
                <h3
                  className="font-black text-lg uppercase mb-2"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em', color: '#ffffff' }}
                >
                  {v.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: "'Roboto', Arial, sans-serif" }}>
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

    </>
  );
}
