'use client';
/*
 * Make a Payment Page — ProSWPPP Redesign
 * Design: Dark hero + payment options card + FAQ
 * Payment link: update PAYMENT_URL to the live Square/PayPal/Stripe link from the client
 */

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Shield, Lock, CreditCard, Phone, CheckCircle2 } from 'lucide-react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// TODO: Replace with live payment processor URL from client
const PAYMENT_URL = 'https://proswppp.com/make-a-payment/';

const faqs = [
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express, Discover) as well as ACH bank transfers for larger orders.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes. All payments are processed through our PCI-compliant payment processor with 256-bit SSL encryption. We never store your card details on our servers.',
  },
  {
    q: 'When will I receive my invoice?',
    a: 'A payment receipt is automatically emailed to you immediately after your transaction is complete. Invoices are also available on request.',
  },
  {
    q: 'Can I pay by check or bank transfer?',
    a: 'Yes, for orders over $500 we can accommodate ACH bank transfers and business checks. Please call us at 833-GET-SWPP to arrange this.',
  },
];

export default function PaymentClient() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-20 lg:pt-28 pb-8 lg:pb-10"
        style={{ background: '#000000' }}
      >
        <div className="relative z-10 container text-center">
          <motion.div
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
            style={{ background: 'rgba(239,124,59,0.15)', border: '1px solid rgba(239,124,59,0.3)' }}
          >
            <Lock size={13} style={{ color: '#EF7C3B' }} />
            <span className="text-[#EF7C3B] text-xs font-bold uppercase tracking-widest">Secure Payment Portal</span>
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
            Make a <span style={{ color: '#EF7C3B' }}>Payment</span>
          </motion.h1>
          <motion.p
            custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-gray-400 text-lg max-w-lg mx-auto"
            style={{ fontFamily: "'Roboto', Arial, sans-serif" }}
          >
            Secure, fast, and hassle-free payment for your Pro SWPPP services.
          </motion.p>
        </div>
      </section>

      {/* ── Payment Card ── */}
      <section className="pt-6 lg:pt-12 pb-10 lg:pb-28" style={{ background: '#000000' }}>
        <div className="container">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{ border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {/* Card header */}
              <div
                className="px-8 py-6"
                style={{ background: '#F8F6F2', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#EF7C3B' }}>Pro SWPPP</p>
                    <h2
                      className="font-black text-xl uppercase"
                      style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em', color: '#111111' }}
                    >
                      Secure Payment
                    </h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={20} style={{ color: '#EF7C3B' }} />
                    <Lock size={16} style={{ color: '#555555' }} />
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-8 py-8" style={{ background: '#F8F6F2' }}>
                <div className="flex items-start gap-4 mb-6 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <CreditCard size={22} style={{ color: '#EF7C3B', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p className="font-bold text-sm mb-1" style={{ fontFamily: "'Inter', sans-serif", color: '#111111' }}>
                      All Major Cards Accepted
                    </p>
                    <p className="text-sm" style={{ fontFamily: "'Roboto', Arial, sans-serif", color: '#444444' }}>
                      Visa, Mastercard, Amex, Discover — processed securely via our payment portal.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    '256-bit SSL encryption',
                    'PCI-compliant payment processing',
                    'Instant email receipt',
                    'No stored card data',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={15} style={{ color: '#EF7C3B', flexShrink: 0 }} />
                      <span className="text-sm" style={{ fontFamily: "'Roboto', Arial, sans-serif", color: '#333333' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={PAYMENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orange w-full text-center text-base py-4 block"
                >
                  Proceed to Secure Payment →
                </a>

                <p className="text-center text-xs mt-4" style={{ fontFamily: "'Roboto', Arial, sans-serif", color: '#666666' }}>
                  You will be redirected to our secure payment portal.
                </p>
              </div>
            </motion.div>

            {/* Call alternative */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.15}
              className="mt-6 rounded-xl p-5 text-center"
              style={{ background: '#F8F6F2', border: '1px solid rgba(0,0,0,0.10)' }}
            >
              <p className="text-sm mb-3" style={{ fontFamily: "'Roboto', Arial, sans-serif", color: '#333333' }}>
                Prefer to pay by phone or need help with your invoice?
              </p>
              <a
                href="tel:8334387977"
                className="btn-blue inline-flex items-center gap-2 text-sm px-6 py-3"
              >
                <Phone size={14} />
                Call 833-GET-SWPP
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 lg:py-24" style={{ background: '#000000' }}>
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-center uppercase leading-none mb-10"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              Payment <span style={{ color: '#EF7C3B' }}>FAQs</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i * 0.08}
                  className="rounded-xl p-6"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <h3
                    className="font-black text-sm uppercase mb-2"
                    style={{ fontFamily: "'Inter', sans-serif", color: '#ffffff', letterSpacing: '-0.01em' }}
                  >
                    {faq.q}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "'Roboto', Arial, sans-serif", color: 'rgba(255,255,255,0.85)' }}>
                    {faq.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
