'use client';
/*
 * Get Your SWPPP Page — ProSWPPP Redesign
 * Sections:
 *   1. Hero — dark bg, headline + trust badges
 *   2. Order Form — anchored as #order_swppp_form, full detail form
 *   3. Process Steps — how it works
 *   4. Guarantee callout
 */

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useState } from 'react';
import { Shield, Clock, Star, CheckCircle2, Phone, Upload, ChevronDown, Download, FileText } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/hero-construction-9KtSzH7kq5P7L5DYyJm6oT.webp';

const SERVICE_OPTIONS = [
  'New SWPPP',
  'SWPPP Revision / Update',
  'SWPPP Inspection',
  'Annual Report',
  'SWPPP Training',
  'General Question',
];

const ACREAGE_OPTIONS = [
  'Under 1 Acre',
  '1 to 5 Acres',
  '5 to 10 Acres',
  '10 to 25 Acres',
  '25+ Acres',
];

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

const steps = [
  {
    num: '01',
    title: 'Submit Your Order',
    desc: 'Fill out the form with your project details and upload or link your civil drawings.',
  },
  {
    num: '02',
    title: 'We Review & Begin',
    desc: 'Our SWPPP experts review your site plans and begin drafting within hours of receiving your documents.',
  },
  {
    num: '03',
    title: 'Receive Your SWPPP',
    desc: 'Your complete, inspection-ready SWPPP is delivered within 72 hours — guaranteed.',
  },
  {
    num: '04',
    title: 'Stay Compliant',
    desc: 'We provide ongoing support for revisions, inspections, and annual reports to keep you compliant.',
  },
];

const included = [
  'Site-specific SWPPP document',
  'Best Management Practices (BMPs)',
  'Site map and drainage analysis',
  'NPDES compliance review',
  'Inspection checklists',
  'Unlimited revisions for 30 days',
];

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  projectName: string;
  projectAddress: string;
  state: string;
  zip: string;
  acreage: string;
  service: string;
  civilDrawingsUrl: string;
  notes: string;
}

export default function GetYourSwpppClient() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    projectName: '',
    projectAddress: '',
    state: '',
    zip: '',
    acreage: '',
    service: '',
    civilDrawingsUrl: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_slug: 'get-swppp', fields: formData }),
      });
    } catch {
      // fail open — submission attempted
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  // Light-theme field styles for white form card
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    background: '#ffffff',
    border: '1.5px solid #dde1e7',
    borderRadius: '8px',
    padding: '0.6875rem 0.875rem',
    color: '#1A3A4A',
    fontFamily: "'Roboto', Arial, sans-serif",
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    appearance: 'none' as const,
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: '#64748b',
    marginBottom: '0.375rem',
    fontFamily: "'Roboto', sans-serif",
  };
  const sectionStyle: React.CSSProperties = {
    padding: '1.75rem 2rem',
    borderBottom: '1px solid #f0f2f5',
  };
  const sectionNumStyle = (n: string): React.CSSProperties => ({
    width: '28px', height: '28px', borderRadius: '50%',
    background: '#EF7C3B', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8125rem', fontWeight: 700, flexShrink: 0,
    fontFamily: "'Inter', sans-serif",
  });

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative py-20 lg:py-28"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95" />
        <div className="relative z-10 container text-center">
          <motion.p
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="section-label mb-4"
          >
            Order Your SWPPP
          </motion.p>
          <motion.h1
            custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-white uppercase leading-none mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 5rem)',
              fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 900,
              letterSpacing: '-0.03em',
            }}
          >
            Get Your SWPPP<br />
            <span style={{ color: '#EF7C3B' }}>in 72 Hours</span>
          </motion.h1>
          <motion.p
            custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-gray-300 text-lg max-w-xl mx-auto mb-8"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            America&apos;s #1 SWPPP service. Fast, affordable, and 100% inspection-ready — or it&apos;s FREE.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            custom={0.3} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-wrap justify-center gap-4 mb-10"
          >
            {[
              { icon: Star, text: '5-Star Google Rating' },
              { icon: Clock, text: '72-Hr Delivery Guarantee' },
              { icon: Shield, text: '100% Compliance Guaranteed' },
            ].map((b) => (
              <div
                key={b.text}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <b.icon size={14} style={{ color: '#EF7C3B' }} />
                {b.text}
              </div>
            ))}
          </motion.div>

          <motion.a
            custom={0.4} initial="hidden" animate="visible" variants={fadeUp}
            href="#order_swppp_form"
            className="btn-orange text-base px-10 py-4 inline-block"
          >
            Start My Order ↓
          </motion.a>
        </div>
      </section>

      {/* ── Order Form ── */}
      <section
        id="order_swppp_form"
        className="py-20 lg:py-28 scroll-mt-20"
        style={{ background: '#eef0f3' }}
      >
        <div className="container">
          <div className="max-w-6xl mx-auto">

            {/* Section heading */}
            <div className="text-center mb-12">
              <p className="section-label mb-3">Let&apos;s Get Started</p>
              <h2
                className="uppercase leading-none mb-3"
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#1A3A4A',
                }}
              >
                Order Your <span style={{ color: '#EF7C3B' }}>SWPPP</span>
              </h2>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                Fill out the form below and a SWPPP expert will contact you within 1 business hour.
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto rounded-2xl p-10 text-center bg-white"
                style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10)', border: '1px solid #e2e8f0' }}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e' }}>
                  <CheckCircle2 size={36} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em', color: '#1A3A4A' }}>
                  Order <span style={{ color: '#EF7C3B' }}>Received!</span>
                </h3>
                <p className="text-gray-500 text-base leading-relaxed mb-2 max-w-md mx-auto">
                  Thank you, <strong className="text-[#1A3A4A]">{formData.firstName}</strong>! A SWPPP expert will contact you at <strong className="text-[#1A3A4A]">{formData.email}</strong> within 1 business hour.
                </p>
                <p className="text-gray-400 text-sm mb-8">Your SWPPP will be delivered within 72 hours of receiving your civil drawings.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/" className="btn-orange text-sm px-8 py-3.5">Back to Home</a>
                  <a href="tel:8334387977" className="btn-blue text-sm px-8 py-3.5 flex items-center justify-center gap-2">
                    <Phone size={14} /> Call 833-GET-SWPP
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

                {/* ── Form Card ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 32px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', overflow: 'hidden' }}
                >
                  <form onSubmit={handleSubmit}>

                    {/* Section 1: Contact */}
                    <div style={sectionStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={sectionNumStyle('1')}>1</div>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: '0.9375rem', color: '#1A3A4A', letterSpacing: '-0.01em', margin: 0 }}>Contact Information</h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label style={labelStyle}>First Name <span style={{ color: '#EF7C3B' }}>*</span></label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" style={fieldStyle} required
                            onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                        </div>
                        <div>
                          <label style={labelStyle}>Last Name <span style={{ color: '#EF7C3B' }}>*</span></label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Smith" style={fieldStyle} required
                            onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label style={labelStyle}>Company / Contractor Name</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="ABC Construction LLC" style={fieldStyle}
                          onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label style={labelStyle}>Email Address <span style={{ color: '#EF7C3B' }}>*</span></label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@company.com" style={fieldStyle} required
                            onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                        </div>
                        <div>
                          <label style={labelStyle}>Phone Number <span style={{ color: '#EF7C3B' }}>*</span></label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 000-0000" style={fieldStyle} required
                            onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Project Details */}
                    <div style={sectionStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={sectionNumStyle('2')}>2</div>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: '0.9375rem', color: '#1A3A4A', letterSpacing: '-0.01em', margin: 0 }}>Project Details</h3>
                      </div>
                      <div className="mb-4">
                        <label style={labelStyle}>Project Name <span style={{ color: '#EF7C3B' }}>*</span></label>
                        <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="Riverside Mixed-Use Development" style={fieldStyle} required
                          onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                      </div>
                      <div className="mb-4">
                        <label style={labelStyle}>Project Address / Location</label>
                        <input type="text" name="projectAddress" value={formData.projectAddress} onChange={handleChange} placeholder="123 Construction Blvd, City" style={fieldStyle}
                          onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label style={labelStyle}>State <span style={{ color: '#EF7C3B' }}>*</span></label>
                          <div style={{ position: 'relative' }}>
                            <select name="state" value={formData.state} onChange={handleChange} required
                              style={{ ...fieldStyle, color: formData.state ? '#1A3A4A' : '#94a3b8' }}
                              onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                              onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }}
                            >
                              <option value="" disabled>Select state...</option>
                              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Zip Code</label>
                          <input type="text" name="zip" value={formData.zip} onChange={handleChange} placeholder="77346" style={fieldStyle}
                            onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label style={labelStyle}>Land Disturbance Area <span style={{ color: '#EF7C3B' }}>*</span></label>
                          <div style={{ position: 'relative' }}>
                            <select name="acreage" value={formData.acreage} onChange={handleChange} required
                              style={{ ...fieldStyle, color: formData.acreage ? '#1A3A4A' : '#94a3b8' }}
                              onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                              onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }}
                            >
                              <option value="" disabled>Select acreage...</option>
                              {ACREAGE_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                          </div>
                        </div>
                        <div>
                          <label style={labelStyle}>Service Needed <span style={{ color: '#EF7C3B' }}>*</span></label>
                          <div style={{ position: 'relative' }}>
                            <select name="service" value={formData.service} onChange={handleChange} required
                              style={{ ...fieldStyle, color: formData.service ? '#1A3A4A' : '#94a3b8' }}
                              onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                              onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }}
                            >
                              <option value="" disabled>Select service...</option>
                              {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Civil Drawings + Notes */}
                    <div style={{ ...sectionStyle, borderBottom: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={sectionNumStyle('3')}>3</div>
                        <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: '0.9375rem', color: '#1A3A4A', letterSpacing: '-0.01em', margin: 0 }}>Civil Drawings &amp; Notes</h3>
                      </div>
                      <div className="mb-4">
                        <label style={labelStyle}>Civil Drawings Link (Google Drive, Dropbox, etc.)</label>
                        <div style={{ position: 'relative' }}>
                          <Upload size={14} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input type="url" name="civilDrawingsUrl" value={formData.civilDrawingsUrl} onChange={handleChange}
                            placeholder="https://drive.google.com/..."
                            style={{ ...fieldStyle, paddingLeft: '2.25rem' }}
                            onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }} />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Additional Notes or Questions</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange}
                          placeholder="Any special requirements, site conditions, or questions for our team..."
                          rows={4}
                          style={{ ...fieldStyle, resize: 'none', lineHeight: '1.6' }}
                          onFocus={e => { e.target.style.borderColor = '#EF7C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(239,124,59,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = '#dde1e7'; e.target.style.boxShadow = 'none'; }}
                        />
                      </div>
                    </div>

                    {/* Submit footer */}
                    <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full btn-orange text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ fontSize: '1rem', letterSpacing: '0.04em' }}
                      >
                        {submitting ? 'Submitting Your Order...' : 'Submit My SWPPP Order →'}
                      </button>
                      <p className="text-gray-400 text-xs text-center mt-3" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                        🔒 Secure submission. No spam. We respond within 1 business hour.
                      </p>
                    </div>
                  </form>
                </motion.div>

                {/* ── Sidebar ── */}
                <div style={{ position: 'sticky', top: '100px' }} className="space-y-4">

                  {/* Why Pro SWPPP */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ background: '#1A3A4A', borderRadius: '14px', padding: '1.5rem' }}
                  >
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#EF7C3B', marginBottom: '1rem' }}>
                      Why Pro SWPPP?
                    </p>
                    <div className="space-y-3">
                      {[
                        '72-Hour Delivery — Guaranteed',
                        '5-Star Google Rating',
                        '17+ Years of Experience',
                        'Zero Compliance Issues — Ever',
                        'Full Project Support, Start to Finish',
                        '100% NPDES Compliant',
                      ].map(item => (
                        <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                          <CheckCircle2 size={15} style={{ color: '#EF7C3B', flexShrink: 0, marginTop: '1px' }} />
                          <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Call us */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ background: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                  >
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '0.8rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      Prefer to speak with someone directly?
                    </p>
                    <a
                      href="tel:8334387977"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        background: '#EF7C3B', color: 'white', borderRadius: '8px',
                        padding: '0.75rem 1rem', fontFamily: "'Roboto', sans-serif",
                        fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}
                    >
                      <Phone size={14} /> 833-GET-SWPP
                    </a>
                  </motion.div>

                  {/* Download PDF */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    style={{ background: '#ffffff', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.625rem' }}>
                      <FileText size={16} style={{ color: '#6B9ED1', flexShrink: 0 }} />
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700, fontSize: '0.8125rem', color: '#1A3A4A', margin: 0 }}>
                        Prefer a paper form?
                      </p>
                    </div>
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                      Download our printable order form, complete it, and email or fax it back to us.
                    </p>
                    <a
                      href="/swppp-order-form.pdf"
                      download
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        border: '1.5px solid #6B9ED1', color: '#6B9ED1', borderRadius: '8px',
                        padding: '0.6875rem 1rem', fontFamily: "'Roboto', sans-serif",
                        fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                        transition: 'background 0.2s, color 0.2s',
                      }}
                      onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#6B9ED1'; el.style.color = '#fff'; }}
                      onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'transparent'; el.style.color = '#6B9ED1'; }}
                    >
                      <Download size={14} /> Download Order Form PDF
                    </a>
                  </motion.div>
                </div>

              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="py-16" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="section-label mb-3 text-center">What You Receive</p>
            <h2
              className="text-center uppercase leading-none mb-10"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#1A3A4A',
              }}
            >
              Every SWPPP <span style={{ color: '#EF7C3B' }}>Includes</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {included.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl p-4 bg-white" style={{ border: '1px solid #e2e8f0' }}>
                  <CheckCircle2 size={18} style={{ color: '#EF7C3B', flexShrink: 0 }} />
                  <span className="text-[#1A3A4A] text-sm font-medium" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <p className="section-label mb-3">The Process</p>
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
              How It <span style={{ color: '#EF7C3B' }}>Works</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.1}
                className="text-center rounded-2xl p-6"
                style={{ background: '#f8f9fa' }}
              >
                <div
                  className="text-5xl font-black mb-3"
                  style={{ color: '#EF7C3B', fontFamily: "'Inter', sans-serif", opacity: 0.3 }}
                >
                  {step.num}
                </div>
                <h3
                  className="font-black text-base uppercase mb-2"
                  style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em', color: '#1A3A4A' }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
