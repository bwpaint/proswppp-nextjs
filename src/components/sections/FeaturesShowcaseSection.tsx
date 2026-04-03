'use client';
/*
 * Features Showcase Section — ProSWPPP Redesign
 * Design: Full-width edge-to-edge 50/50 split — NO container, no white background gaps
 *   Left col:  Construction workers image, absolute fill, full height
 *   Right col: #6B9ED1 blue background with bullet list, full height
 */

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const WORKERS_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/workers-section-6of6dUBt5RszU3ej7QLzYg.webp";

const features = [
  {
    title: "17+ Years of Experience",
    desc: "With a long-standing track record, we bring extensive expertise to ensure your SWPPP is done right.",
  },
  {
    title: "Reliable Intervention",
    desc: "If a Local Inspector or Regulator raises any concerns with your SWPPP Documents we take full responsibility and resolve the matter on your behalf.",
  },
  {
    title: "Zero Compliance Issues",
    desc: "Our sterling track record on compliance assures your SWPPP Solution will be Certified, and 100% Compliant with all Federal, State, & Local requirements.",
  },
  {
    title: "Expert Resolution",
    desc: "Our team at Pro SWPPP is well versed in the ever-changing and updated regulations and requirements.",
  },
  {
    title: "Streamlined Process",
    desc: "Our efficient processes allow us to navigate any obtuse compliance concerns with precision and accuracy.",
  },
  {
    title: "Full Responsibility",
    desc: "We take full ownership of any and all of your SWPPP Compliance concerns for your project.",
  },
  {
    title: "Hassle Free",
    desc: "We design every aspect of our systems to make it as simple as possible for our customers to remain in full compliance.",
  },
];

export default function FeaturesShowcaseSection() {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-2"
      style={{ minHeight: "600px" }}
    >
      {/* Left: Full-height image — absolute fill */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden order-2 lg:order-1"
        style={{ minHeight: "420px" }}
      >
        <img
          src={WORKERS_IMG}
          alt="Construction site managers reviewing plans"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </motion.div>

      {/* Right: Blue background, full height, bullet list */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="bg-[#6B9ED1] px-8 lg:px-12 py-14 lg:py-16 flex flex-col justify-center order-1 lg:order-2"
      >
        <h2 className="section-heading text-white text-2xl lg:text-3xl mb-2 leading-tight">
          How Do I Know My SWPPP<br />Will Be Done Right?
        </h2>
        <p className="text-white/90 italic font-medium mb-8">
          If you were to order your SWPPP today you know…
        </p>
        <div className="space-y-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2
                size={20}
                className="flex-shrink-0 mt-0.5 text-white"
              />
              <div>
                <span className="font-bold text-white">{f.title} – </span>
                <span className="text-white/90">{f.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
