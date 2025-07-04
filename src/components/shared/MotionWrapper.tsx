// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
'use client';

import { motion } from 'framer-motion';

export function MotionWrapper({ children, className, id }: { children: React.ReactNode; className?: string, id: string }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
