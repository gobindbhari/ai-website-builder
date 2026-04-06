'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Wand as Wand2, Rocket, RefreshCw } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    title: 'Describe Your Idea',
    description:
      'Simply tell Bolt what you want to build in natural language. Be as detailed or as brief as you like.',
    color: 'orange',
  },
  {
    icon: Wand2,
    title: 'AI Builds Your App',
    description:
      'Watch as AI generates a complete, production-ready application with frontend, backend, and database.',
    color: 'pink',
  },
  {
    icon: RefreshCw,
    title: 'Refine & Iterate',
    description:
      'Make changes using natural language. Add features, fix bugs, or completely redesign with simple commands.',
    color: 'orange',
  },
  {
    icon: Rocket,
    title: 'Deploy Instantly',
    description:
      'Launch your application to production with one click. Automatic scaling, SSL, and global CDN included.',
    color: 'pink',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 relative overflow-hidden bg-muted/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            How It
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {' '}
              Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From idea to production in four simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-orange-500/20 -translate-y-1/2"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`relative mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${
                    step.color === 'orange'
                      ? 'from-orange-500 to-yellow-500'
                      : 'from-pink-500 to-rose-500'
                  } shadow-lg`}
                >
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
