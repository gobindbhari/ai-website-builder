"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <>
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10 -z-50!"></div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-orange-500/10 via-transparent to-transparent dark:from-orange-500/5"></div>

      {/* Animated blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </motion.div>
    </>
  );
}