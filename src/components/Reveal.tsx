import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Fades and lifts its content into view once, as it scrolls onto the screen. */
export default function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduceMotion ? 0 : 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}
