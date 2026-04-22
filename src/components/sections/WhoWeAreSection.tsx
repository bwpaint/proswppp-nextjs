'use client';

import { motion } from 'framer-motion';

const HELMET_BG = '/images/proswppp-helmets.webp';
const TEAM_PHOTO = '/images/proswppp-team-800.webp';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function WhoWeAreSection() {
  return (
    <section
      className="relative py-20 lg:py-28"
      style={{
        backgroundImage: `url(${HELMET_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark mask — 85% at top fading to 50% at bottom */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.50) 100%)' }} />

      <div className="relative z-10 container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Copy */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <p
              className="section-label mb-4"
              style={{
                fontFamily: "'Roboto', Arial, sans-serif",
                fontWeight: 900,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: '#EF7C3B',
              }}
            >
              Who We Are
            </p>
            <h2
              className="text-white uppercase leading-none mb-7"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              Built for <span style={{ color: '#EF7C3B' }}>Builders</span>
            </h2>
            <div
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontFamily: "'Roboto', Arial, sans-serif",
                fontSize: '1rem',
                lineHeight: 1.85,
              }}
            >
              <p style={{ marginBottom: '1rem' }}>
                Pro SWPPP is a nationwide stormwater pollution prevention plan service built
                for contractors, developers, and site managers who need compliance fast —
                without the runaround.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                Federal law requires a SWPPP on every project disturbing one or more acres.
                We deliver fully compliant, site-specific plans in 72 hours — engineered to
                meet EPA and state NPDES permit requirements, with documentation inspectors
                actually want to see, across 48 states.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                No waiting weeks for an engineering firm. No confusing templates. Just a
                purpose-built SWPPP service that lands a permit-ready plan in your inbox.
              </p>
              <p style={{ fontStyle: 'italic', color: '#EF7C3B', fontWeight: 700 }}>
                Construction doesn&apos;t wait. Neither should your stormwater compliance.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/get-your-swppp" className="btn-orange">Get My SWPPP</a>
              <a href="/about" className="btn-blue">Meet the Team</a>
              <a href="/quiz-form/" className="btn-orange">Take the Quiz</a>
            </div>
          </motion.div>

          {/* Right: Team Photo */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="flex justify-center"
          >
            <img
              src={TEAM_PHOTO}
              alt="The Pro SWPPP Team"
              className="w-full rounded-2xl"
              style={{
                maxWidth: '520px',
                border: '2px solid rgba(239,124,59,0.35)',
                boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
              }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
