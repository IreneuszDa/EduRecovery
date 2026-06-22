"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LessonStepProps {
  title: string;
  children: ReactNode;
}

export default function LessonStep({ title, children }: LessonStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/50 dark:border-slate-700/50"
    >
      <h2 className="mb-6 text-2xl md:text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {children}
      </div>
    </motion.div>
  );
}