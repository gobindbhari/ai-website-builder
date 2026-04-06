'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Code, Rocket } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

      <div className="absolute inset-0 bg-linear-to-b from-orange-500/10 via-transparent to-transparent dark:from-orange-500/5"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatePresence mode='wait' >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 mb-8"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                AI-Powered Development
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div
                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6"
              >
                Build Websites
                <br />
                <span className="bg-linear-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
                  In Seconds
                </span>
              </div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Turn your ideas into production-ready websites using natural
              language. Bolt.new leverages AI to build, deploy, and iterate on
              full-stack applications instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <Link href="/chat">
                <Button
                  size="lg"
                  className="cursor-pointer bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-6 text-lg group"
                >
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Watch Demo
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <Code className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold">Full-Stack Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Complete with frontend, backend, and database
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <Rocket className="w-6 h-6 text-pink-500" />
                </div>
                <h3 className="font-semibold">Instant Deploy</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy to production in one click
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Natural language to production code
                </p>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      </div>
    </section>
  );
}
