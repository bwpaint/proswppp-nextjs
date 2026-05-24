'use client';
/*
 * Testimonials Section — "What Our Customers Are Saying"
 * Design: Dark background, three quote cards in a responsive grid.
 * Replace placeholder content with real client testimonials when supplied.
 */

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
}

// TODO: replace with real testimonials from the client.
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Pro SWPPP turned what used to be a 45-day permit backlog into a 3-day delivery. They've saved every single one of our build schedules this year.",
    name: 'Sarah Mitchell',
    title: 'Project Manager',
    company: 'Holland Construction',
  },
  {
    quote:
      "I've worked with three SWPPP firms over fifteen years. Pro SWPPP is the only one I've ever called twice. Their plans are clean, inspectors love them, and the turnaround is unreal.",
    name: 'David Park',
    title: 'Site Superintendent',
    company: 'The MAPP Group',
  },
  {
    quote:
      "The 72-hour guarantee is real. We've never been late on a permit because of them, and we've never failed an inspection on one of their plans. Worth every penny.",
    name: 'Jennifer Russo',
    title: 'Construction Manager',
    company: 'Triad Construction',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' as const },
  }),
};

export default function TestimonialsSection() {
  return (
    <section
      className="relative py-20 lg:py-24"
      style={{ background: '#000000' }}
    >
      <div className="container">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="uppercase tracking-widest mb-4"
            style={{
              fontFamily: "'Roboto', Arial, sans-serif",
              fontWeight: 900,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: '#DE863F',
            }}
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="text-white uppercase leading-none"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.03em',
            }}
          >
            What Our <span style={{ color: '#DE863F' }}>Customers</span> Are Saying
          </motion.h2>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              className="relative rounded-2xl p-7 lg:p-8 flex flex-col"
              style={{
                background:
                  'linear-gradient(160deg, rgba(26,58,74,0.6) 0%, rgba(13,31,43,0.85) 100%)',
                border: '1px solid rgba(222,134,63,0.25)',
                boxShadow: '0 18px 48px rgba(0,0,0,0.4)',
              }}
            >
              {/* Decorative quote mark */}
              <Quote
                size={36}
                style={{
                  color: '#DE863F',
                  opacity: 0.85,
                  marginBottom: '12px',
                }}
              />

              {/* 5-star rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className="fill-[#FFB800] text-[#FFB800]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontFamily: "'Roboto', Arial, sans-serif",
                  fontSize: '1rem',
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.92)',
                  flex: 1,
                  marginBottom: '18px',
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '14px' }}>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  {t.name}
                </p>
                <p
                  style={{
                    fontFamily: "'Roboto', Arial, sans-serif",
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.6)',
                    margin: '2px 0 0',
                  }}
                >
                  {t.title} &middot;{' '}
                  <span style={{ color: '#DE863F', fontWeight: 600 }}>{t.company}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
