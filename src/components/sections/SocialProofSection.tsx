'use client';
/*
 * Social Proof / Reviews CTA Section — ProSWPPP Redesign
 * Design: Dark overlay on construction crane image
 * Large heading + reviews CTA
 */

import { motion } from "framer-motion";

export default function SocialProofSection() {
  return (
    <section
      className="relative py-20 lg:py-24"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay — darkens top-to-bottom for text readability */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.96) 100%)' }} />

      <div className="relative z-10 container text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-heading text-[#7B9CD1] text-3xl lg:text-5xl mb-6 leading-tight">
            Don't Believe Us? See What Our Customer's Say…
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Most companies that offer SWPPPs will bundle them with other services, and have a large staff and overhead to cover, so they need to charge more.
          </p>
          <a
            href="https://www.google.com/search?q=proswppp&oq=proswppp&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIKCAEQABiABBiiBDIKCAIQABiABBiiBDIGCAMQRRg9MgYIBBBFGD3SAQgxMzA0ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#lrd=0x8640ac2d6bdc430d:0x746cb5aa6bc76e9,1,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-orange text-base px-10 py-4"
          >
            Read Reviews
          </a>
        </motion.div>
      </div>
    </section>
  );
}
