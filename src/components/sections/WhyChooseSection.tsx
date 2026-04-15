'use client';
/*
 * Why Choose + 72-Hour Guarantee Section — ProSWPPP Redesign
 * Design: Two-column split — orange left, light gray right
 * Then full-width feature grid below
 *
 * Copy is verbatim from the proswppp.com content dump.
 * NOTE: The original source contained a spam/casino affiliate link injected into
 * the "How can we guarantee 72 hour delivery?" copy (line 178 of dump). That link
 * has been removed — it is not part of the legitimate site content.
 */

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const leftFeatures = [
  {
    title: "20+ Years of Experience",
    desc: "With a long-standing track record, we bring extensive expertise to ensure your SWPPP is done right.",
  },
  {
    title: "Reliable Intervention",
    desc: "If a Local Inspector or Regulator raises any concerns with your SWPPP Documents we take full responsibility and resolve the matter on your behalf. We support our projects from start to finish regardless of time frame.",
  },
  {
    title: "Zero Compliance Issues",
    desc: "Our sterling track record on compliance assures your SWPPP Solution will be Certified, and 100% Compliant with all Federal, State, & Local requirements.",
  },
  {
    title: "Expert Resolution",
    desc: "Our team at Pro SWPPP is well versed in the ever changing and updated regulations and requirements. Just let us know how we can help as we are a resource for you before, during, and after your project.",
  },
  {
    title: "Streamlined Process",
    desc: "Our efficient processes allow us to navigate any obtuse compliance concerns with precision and accuracy ensuring you can focus on your buildout instead of getting bogged down with rules and regulations.",
  },
  {
    title: "Full Responsibility",
    desc: "We take full ownership of any and all of your SWPPP Compliance concerns for your project and we support you from start to finish.",
  },
  {
    title: "Hassle Free",
    desc: "We design every aspect of our systems to make it as simple as possible for our customers to remain in full compliance with all Federal, State, & Local requirements.",
  },
];

const rightFeatures = [
  {
    title: "Exclusive SWPPP Focus",
    desc: "With over 20 years of experience we know the regulations inside and out so we can streamline our process to deliver a full compliant solution with full speed and efficiency.",
  },
  {
    title: "Customer Focused",
    desc: "Need it faster? We realize SWPPP compliance can hold up your project so we can often respond with a solution for you in 24 hours or less.",
  },
  {
    title: "Appreciation",
    desc: "Our Customers are our #1 Priority and we work tirelessly to ensure they get what they need quickly and efficiently.",
  },
  {
    title: "Uncompromised Quality",
    desc: "We are both FAST & Accurate. Our experienced Quality Control team will ensure our delivery is 100% compliant with all of your SWPPP requirements.",
  },
  {
    title: "Helpful",
    desc: "We believe in helping any and all. Have a question about your local regulations, but don't need an SWPPP immediately? No problem, give us a call at 833-GET-SWPPP and we'll answer any questions you may have with our SWPPP Expertise.",
  },
  {
    title: "Trustworthy Partner",
    desc: "Our track record proves our commitment to our customers. We do what we say we are going to do, and customer satisfaction is our #1 priority.",
  },
  {
    title: "Peace of Mind",
    desc: "You can sleep soundly knowing your project is in full compliance when you hire Pro SWPPP as your Stormwater Consultants.",
  },
];

export default function WhyChooseSection() {
  return (
    <>
      {/* Three-Column Hero Split — orange | black logo | orange */}
      <section className="relative overflow-hidden">
        {/* Full-bleed color bands: 3 columns */}
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-[1fr_340px_1fr] pointer-events-none">
          <div className="bg-[#EF7C3B]" />
          <div className="bg-[#000000]" />
          <div className="bg-[#EF7C3B]" />
        </div>
        {/* Content grid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_340px_1fr]">
          {/* Left: Why Choose — flush right */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-16 lg:py-20 px-8 lg:px-12 xl:px-16 text-right"
          >
            <h2 className="section-heading text-white text-4xl lg:text-6xl mb-4 leading-tight">
              Why Should I Choose<br />Pro SWPPP?
            </h2>
            <p className="text-white/90 font-semibold text-lg italic">
              BECAUSE… We are America's #1 SWPPP
            </p>
            <p className="text-white/80 font-medium mt-2">
              The Fastest Most Affordable &amp; Reliable SWPPP period
            </p>
          </motion.div>

          {/* Center: Black column with 72 Hours logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center py-10 px-6"
          >
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663497382802/VjZJtgwgQ4REmFrCDkU6Nc/PROSWPPP-72hrsorItisFree_25198493.webp"
              alt="72 Hours or It's Free!"
              className="w-full max-w-[280px] h-auto object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Right: 72-Hour Guarantee */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="py-16 lg:py-20 px-8 lg:px-12 xl:px-16"
          >
            <h2 className="section-heading text-white text-4xl lg:text-6xl mb-4 leading-tight">
              How Can We Guarantee<br />72 Hour Delivery?
            </h2>
            <p className="text-white/90 font-semibold italic text-lg">
              When others take two weeks to deliver a fully compliant SWPPP, we can have it done fully compliant in just 72 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 lg:py-20" style={{ background: '#000000' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
            {/* Left Column */}
            <div>
              {leftFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="check-item"
                >
                  <CheckCircle2
                    size={20}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#EF7C3B" }}
                  />
                  <div>
                  <span className="font-bold text-white">{f.title} – </span>
                  <span className="text-gray-300 leading-relaxed">{f.desc}</span>
                </div>
                </motion.div>
              ))}
            </div>

            {/* Right Column */}
            <div>
              {rightFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="check-item"
                >
                  <CheckCircle2
                    size={20}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#EF7C3B" }}
                  />
                  <div>
                    <span className="font-bold text-white">{f.title} – </span>
                    <span className="text-gray-300 leading-relaxed">{f.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
