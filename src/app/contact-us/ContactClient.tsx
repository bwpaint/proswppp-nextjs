'use client';
/*
 * Contact Us Page — ProSWPPP Redesign
 * Design: Dark hero + two-column layout (contact info left, form right)
 * Slug: /contact-us/
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Phone, MapPin, Mail, MessageSquare, Clock } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const INTEREST_OPTIONS = [
  'New SWPPP',
  'SWPPP Revision',
  'SWPPP Inspection',
  'Annual Report',
  'General Question',
];

const inputClass =
  'w-full bg-white/5 border border-white/15 rounded-xl text-white text-sm placeholder-white/40 px-4 py-3 outline-none focus:border-[#DE863F] focus:bg-white/10 transition-all';

export default function ContactClient() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_slug: 'contact', fields: form }),
      });
      if (res.ok) {
        alert("Thanks — we'll be in touch shortly!");
        setForm({ firstName: '', lastName: '', email: '', phone: '', interest: '', message: '' });
      } else {
        alert("Sorry, something went wrong. Please call us at 833-GET-SWPP or try again.");
      }
    } catch {
      alert("Sorry, something went wrong. Please call us at 833-GET-SWPP or try again.");
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-20 lg:pt-28 pb-4 lg:pb-6"
        style={{ background: '#000000' }}
      >
        <div className="relative z-10 container text-center">
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
            style={{ background: 'rgba(222,134,63,0.15)', border: '1px solid rgba(222,134,63,0.3)' }}
          >
            <MessageSquare size={13} style={{ color: '#DE863F' }} />
            <span className="text-[#DE863F] text-xs font-bold uppercase tracking-widest">We&apos;re Here to Help</span>
          </motion.div>

          <motion.h1
            custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-white uppercase leading-none mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.03em',
            }}
          >
            Contact <span style={{ color: '#DE863F' }}>Us</span>
          </motion.h1>
          <motion.p
            custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-gray-400 text-lg max-w-lg mx-auto"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            Questions about your SWPPP? Ready to get started? We&apos;re a phone call or message away.
          </motion.p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="pt-2 lg:pt-4 pb-16 lg:pb-24" style={{ background: '#000000' }}>
        <div className="container">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

            {/* ── Left: Contact Info ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Call card */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(222,134,63,0.15)' }}>
                    <Phone size={16} style={{ color: '#DE863F' }} />
                  </div>
                  <h3
                    className="font-black text-sm uppercase"
                    style={{ fontFamily: "'Inter', sans-serif", color: '#ffffff', letterSpacing: '0.04em' }}
                  >
                    Call Us
                  </h3>
                </div>
                <a
                  href="tel:8334387977"
                  className="text-white font-bold text-xl hover:text-[#DE863F] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  833-GET-SWPP
                </a>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Roboto', sans-serif" }}>
                  (833) 438-7977
                </p>
              </motion.div>

              {/* Hours card */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.08}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(222,134,63,0.15)' }}>
                    <Clock size={16} style={{ color: '#DE863F' }} />
                  </div>
                  <h3
                    className="font-black text-sm uppercase"
                    style={{ fontFamily: "'Inter', sans-serif", color: '#ffffff', letterSpacing: '0.04em' }}
                  >
                    Business Hours
                  </h3>
                </div>
                <div className="space-y-1 text-sm" style={{ fontFamily: "'Roboto', sans-serif", color: 'rgba(255,255,255,0.75)' }}>
                  <p>Mon – Fri: 8:00 AM – 5:00 PM CT</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)' }}>Saturday – Sunday: Closed</p>
                </div>
              </motion.div>

              {/* Address card */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.16}
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(222,134,63,0.15)' }}>
                    <MapPin size={16} style={{ color: '#DE863F' }} />
                  </div>
                  <h3
                    className="font-black text-sm uppercase"
                    style={{ fontFamily: "'Inter', sans-serif", color: '#ffffff', letterSpacing: '0.04em' }}
                  >
                    Our Office
                  </h3>
                </div>
                <a
                  href="https://maps.app.goo.gl/rKcDY3vvTKsJTqnQ9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-relaxed hover:text-[#DE863F] transition-colors"
                  style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Roboto', sans-serif" }}
                >
                  17904 W Lake Houston Pkwy.<br />
                  STE 303<br />
                  Atascocita, TX 77346
                </a>
              </motion.div>

              {/* Quick note */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.24}
                className="rounded-2xl p-5"
                style={{ background: 'rgba(222,134,63,0.08)', border: '1px solid rgba(222,134,63,0.25)' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Roboto', sans-serif" }}>
                  <span className="font-bold" style={{ color: '#DE863F' }}>Need your SWPPP fast?</span> Most plans are delivered within 72 hours of order — or it&apos;s FREE.
                </p>
              </motion.div>

            </div>

            {/* ── Right: Contact Form ── */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
              className="lg:col-span-3 rounded-2xl p-8"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <h2
                className="font-black uppercase mb-1"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.25rem', letterSpacing: '-0.01em', color: '#ffffff' }}
              >
                Send Us a Message
              </h2>
              <p className="text-sm mb-7" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Roboto', sans-serif" }}>
                Fill out the form below and our team will get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Row 1: First + Last */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={inputClass}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={inputClass}
                    required
                  />
                </div>

                {/* Row 2: Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={inputClass}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={inputClass}
                  />
                </div>

                {/* Row 3: Interest */}
                <select
                  name="interest"
                  value={form.interest}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ color: form.interest ? 'white' : 'rgba(255,255,255,0.4)' }}
                >
                  <option value="" disabled style={{ color: '#888', background: '#111' }}>
                    What can we help you with?
                  </option>
                  {INTEREST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} style={{ color: 'white', background: '#111' }}>
                      {opt}
                    </option>
                  ))}
                </select>

                {/* Row 4: Message */}
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project or question..."
                  rows={5}
                  className={inputClass}
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />

                {/* Submit */}
                <button
                  type="submit"
                  className="btn-orange w-full text-center text-base py-4"
                >
                  Send Message →
                </button>

                <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Roboto', sans-serif" }}>
                  We typically respond within one business day.
                </p>

              </form>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
