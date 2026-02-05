'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, Zap } from 'lucide-react';

export default function Benchmarks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Performance That Matters</h2>
          <p className="text-xl text-gray-400">Real-world benchmarks from production systems</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-2xl text-center">
            <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <div className="text-5xl font-bold text-white mb-2">8.3ms</div>
            <p className="text-gray-400">Average Response Time</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-2xl text-center">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <div className="text-5xl font-bold text-white mb-2">50K</div>
            <p className="text-gray-400">Requests per Second</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass p-8 rounded-2xl text-center">
            <Activity className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <div className="text-5xl font-bold text-white mb-2">99.99%</div>
            <p className="text-gray-400">Uptime SLA</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}