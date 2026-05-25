'use client';
/*
 * Stats Section — ProSWPPP Redesign
 * Casino-style count-up that fires once when the section scrolls into view.
 * All four big numbers render in brand blue (#4361AF).
 */

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

type Stat = {
  target: number;
  decimals: number;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  { target: 20,  decimals: 0, suffix: "+",   label: "Years of Experience" },
  { target: 100, decimals: 0, suffix: "%",   label: "Compliance Record" },
  { target: 72,  decimals: 0, suffix: "hrs", label: "Hour Delivery Guarantee" },
  { target: 5,   decimals: 1, suffix: "★",   label: "Google Rating" },
];

const BRAND_BLUE = "#4361AF";

function Counter({ stat, run }: { stat: Stat; run: boolean }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    stat.decimals > 0 ? v.toFixed(stat.decimals) : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    if (!run) return;
    const controls = animate(mv, stat.target, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1], // ease-out-expo: fast start, slow settle
    });
    return controls.stop;
  }, [run, mv, stat.target]);

  return (
    <span style={{ color: BRAND_BLUE, fontVariantNumeric: "tabular-nums" }}>
      <motion.span>{rounded}</motion.span>
      <span className="text-3xl lg:text-4xl">{stat.suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="pt-28 lg:pt-32 pb-8 lg:pb-10"
      style={{ background: "#000000" }}
    >
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-2">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="stat-number text-5xl lg:text-6xl mb-2">
                <Counter stat={stat} run={inView} />
              </div>
              <p className="text-gray-300 font-semibold text-sm uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
