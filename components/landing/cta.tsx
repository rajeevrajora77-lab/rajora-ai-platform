'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-32 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto glass p-12 rounded-3xl text-center space-y-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-white">
          Ready to Build the Future?
        </h2>
        <p className="text-xl text-gray-300">
          Deploy your own Rajora AI instance in minutes. Open source, fully customizable.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all">
            Start Building <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="https://github.com/rajeevrajora77-lab/rajora-ai-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 glass hover:bg-white/20 text-white rounded-xl font-semibold transition-all">
            <Github className="w-5 h-5" /> View on GitHub
          </a>
        </div>
      </motion.div>
    </section>
  );
}