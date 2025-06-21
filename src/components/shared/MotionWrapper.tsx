'use client';

import { motion } from 'framer-motion';

export function MotionWrapper({ children, className, id }: { children: React.ReactNode; className?: string, id: string }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
