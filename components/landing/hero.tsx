'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import LiveChat from './live-chat';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Animated background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Hero content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-cyan-400"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Source • Enterprise Ready • Zero Downtime</span>
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
            Build. Think. Scale.
            <br />
            <span className="text-glow bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              with Rajora AI
            </span>
          </h1>

          <p className="text-xl text-gray-300 leading-relaxed">
            Enterprise-grade LLM platform with admin CMS, multi-model support,
            and production-ready AWS deployment. Built for scale.
          </p>

          {/* Value pillars */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass p-4 rounded-xl text-center space-y-2">
              <Zap className="w-6 h-6 mx-auto text-yellow-400" />
              <p className="text-sm text-gray-300">10ms Latency</p>
            </div>
            <div className="glass p-4 rounded-xl text-center space-y-2">
              <Shield className="w-6 h-6 mx-auto text-green-400" />
              <p className="text-sm text-gray-300">SOC 2 Ready</p>
            </div>
            <div className="glass p-4 rounded-xl text-center space-y-2">
              <Sparkles className="w-6 h-6 mx-auto text-cyan-400" />
              <p className="text-sm text-gray-300">99.99% Uptime</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/chat"
              className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
              Try Chat Demo
            </Link>
            <Link
              href="/docs"
              className="px-8 py-4 glass hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
            >
              View Documentation
            </Link>
          </div>

          {/* Model badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-2 text-sm text-gray-400"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Currently running: Llama 3.1 70B</span>
          </motion.div>
        </motion.div>

        {/* Right: Live chat demo */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <LiveChat />
        </motion.div>
      </div>
    </section>
  );
}