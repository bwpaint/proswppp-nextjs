'use client';
/*
 * CEO Guarantee Section — ProSWPPP Redesign
 * Design: Full-width edge-to-edge 50/50 split — NO container, no background gaps
 *   Left col:  White background — headline, CEO photo + quote
 *   Right col: #6B9ED1 blue background — "Fully Certified SWPPP's Since 2007" bullet list
 * Then: black Confidence Statement banner
 *
 * CEO photo sourced from proswppp.com/wp-content/uploads/2024/08/IMG_4484.jpg
 */

import { motion } from "framer-motion";
import { CheckCircle2, Phone } from "lucide-react";

const CEO_PHOTO = "https://proswppp.com/wp-content/uploads/2024/08/IMG_4484.jpg";

const inclusions = [
  "Fully Certified SWPPP's Since 2007",
  "All Reports Included",
  "72 Hour Turnaround – STANDARD",
  "Compliance Guaranteed",
  "Project Support from Start to Finish",
  "Premium Customer Service – Call Us Anytime",
  "Full Responsibility for Any Compliance Concerns",
];

export default function CEOGuaranteeSection() {
  return (
    <>
      {/* Full-width 50/50 split */}
      <section
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{ minHeight: "520px" }}
      >
        {/* Left: White — headline + CEO quote */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white px-8 lg:px-12 py-14 lg:py-16 flex flex-col justify-center"
        >
          <h2 className="section-heading text-[#1A3A4A] text-2xl lg:text-3xl mb-1 leading-tight">
            Order Your SWPPP Now and Your Site Will Be
          </h2>
          <h3 className="section-heading text-[#EF7C3B] text-xl lg:text-2xl mb-8">
            Fully Compliant in Just 72 Hours, Guaranteed
          </h3>

          {/* CEO Photo + Quote */}
          <div className="flex flex-col sm:flex-row items-start gap-6 bg-gray-50 rounded-2xl p-6">
            <div className="flex-shrink-0">
              <img
                src={CEO_PHOTO}
                alt="Derek – CEO, Pro SWPPP"
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-[#EF7C3B]"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const div = document.createElement("div");
                  div.className =
                    "w-24 h-24 rounded-full bg-[#1A3A4A] flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-[#EF7C3B]";
                  div.textContent = "D";
                  target.parentNode?.insertBefore(div, target);
                }}
              />
            </div>
            <div className="flex-1">
              <blockquote className="text-gray-700 italic leading-relaxed mb-3">
                "I guarantee full service &amp; support throughout the duration of your project.
                At ProSWPPP our #1 Goal is to take care of our Customers. We stand by our
                customers 110%."
              </blockquote>
              <p className="font-bold text-[#1A3A4A] uppercase tracking-wide text-sm">
                Derek – CEO, Pro SWPPP
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right: Blue — bullet inclusions */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-[#6B9ED1] px-8 lg:px-12 py-14 lg:py-16 flex flex-col justify-center"
        >
          <h3 className="section-heading text-white text-xl lg:text-2xl mb-2 leading-tight">
            Fully Certified SWPPP's Since 2007…
          </h3>
          <p className="text-white/90 italic font-medium mb-8">
            All Reports Include:
          </p>
          <div className="space-y-4 mb-8">
            {inclusions.map((item, i) => (
              <motion.div
                key={item}
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
                <span className="text-white font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
          <a
            href="tel:8334387977"
            className="btn-black-hover-orange inline-flex items-center gap-2 self-start"
          >
            <Phone size={16} />
            Or Call Us Today
          </a>
        </motion.div>
      </section>


    </>
  );
}
