'use client';
/*
 * Stats Section — ProSWPPP Redesign
 * Casino-style count-up that fires when the section scrolls into view,
 * then re-rolls in a sequenced left-to-right wave every 15 seconds.
 * All numbers + suffixes render in brand blue (#7B9CD1).
 */

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  { target: 50,  decimals: 0, suffix: "",    label: "States Served" },
];

const BRAND_BLUE       = "#7B9CD1";
const LOOP_INTERVAL_MS = 15000;  // re-roll every 15s
const STAGGER_MS       = 300;    // tile-to-tile offset for the L->R wave
const ROLL_DURATION_S  = 1.8;

function Counter({
  stat,
  run,
  index,
  tick,
}: {
  stat: Stat;
  run: boolean;
  index: number;
  tick: number;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    stat.decimals > 0 ? v.toFixed(stat.decimals) : Math.round(v).toLocaleString()
  );

  useEffect(() => {
    if (!run) return;
    // Snap back to 0 then roll up, offset by the tile's index for the
    // left-to-right sequenced wave.
    mv.set(0);
    const delayMs = index * STAGGER_MS;
    const t = setTimeout(() => {
      const controls = animate(mv, stat.target, {
        duration: ROLL_DURATION_S,
        ease: [0.16, 1, 0.3, 1],
      });
      controlsRef.current = controls;
    }, delayMs);
    return () => {
      clearTimeout(t);
      if (controlsRef.current) controlsRef.current.stop();
    };
    // re-run on `tick` so every loop pass triggers a fresh roll
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, tick, index, mv, stat.target]);

  const controlsRef = useRef<{ stop: () => void } | null>(null);

  return (
    <span style={{ color: BRAND_BLUE, fontVariantNumeric: "tabular-nums" }}>
      <motion.span>{rounded}</motion.span>
      {stat.suffix && (
        <span className="text-3xl lg:text-4xl" style={{ color: BRAND_BLUE }}>
          {stat.suffix}
        </span>
      )}
    </span>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [tick, setTick] = useState(0);

  // Once the section is in view, kick off a repeating tick every 15s
  // so every Counter re-rolls in sequence on each pass.
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setTick((t) => t + 1), LOOP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section
      ref={ref}
      className="pt-28 lg:pt-32 pb-8 lg:pb-10"
      style={{ background: "#000000" }}
    >
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-2">
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
                <Counter stat={stat} run={inView} index={i} tick={tick} />
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
