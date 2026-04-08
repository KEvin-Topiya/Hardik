import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export function AnimatedCounter({ value, label, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 1500;
    const increment = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-[#3D3229]"
      >
        {count.toLocaleString()}
        {suffix}
      </motion.div>

      <p className="text-sm mt-2 text-[#8B7D6B] uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}
