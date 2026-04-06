'use client';

import { Zap, Code as Code2, Database, Sparkles, Globe, Lock, Layers, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Generate complete web applications in seconds, not hours. Our AI understands context and builds exactly what you need.',
    gradient: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Code2,
    title: 'Clean Code',
    description:
      'Production-ready code following best practices. TypeScript, React, and modern frameworks out of the box.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Database,
    title: 'Database Included',
    description:
      'Supabase integration with automatic schema generation, authentication, and real-time subscriptions.',
    gradient: 'from-orange-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Iteration',
    description:
      'Refine and modify your application using natural language. No manual coding required.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Global Deployment',
    description:
      'Deploy to edge networks worldwide with automatic SSL, CDN, and performance optimization.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Lock,
    title: 'Secure by Default',
    description:
      'Built-in authentication, authorization, and security best practices. Your data is always protected.',
    gradient: 'from-pink-500 to-orange-500',
  },
  {
    icon: Layers,
    title: 'Component Library',
    description:
      'Beautiful, accessible UI components powered by Radix UI and Tailwind CSS. Fully customizable.',
    gradient: 'from-orange-500 to-rose-500',
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description:
      'Every change is tracked. Roll back, branch, and collaborate with full Git integration.',
    gradient: 'from-yellow-500 to-pink-500',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {' '}
              Ship Fast
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features that make building and deploying web applications
            effortless
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              ></div>

              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
