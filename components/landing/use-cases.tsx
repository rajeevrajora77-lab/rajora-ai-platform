'use client';

import { motion } from 'framer-motion';
import { Building2, Code2, GraduationCap, Stethoscope, TrendingUp, Users } from 'lucide-react';

const useCases = [
  { icon: Building2, title: 'Enterprise', desc: 'Internal knowledge bases, customer support automation' },
  { icon: Code2, title: 'Development', desc: 'Code generation, debugging, documentation' },
  { icon: GraduationCap, title: 'Education', desc: 'Personalized tutoring, research assistance' },
  { icon: Stethoscope, title: 'Healthcare', desc: 'Medical research, patient communication' },
  { icon: TrendingUp, title: 'Finance', desc: 'Market analysis, risk assessment, compliance' },
  { icon: Users, title: 'SaaS', desc: 'AI-powered features for your products' },
];

export default function UseCases() {
  return (
    <section className="py-20 px-4 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Built for Every Industry</h2>
          <p className="text-xl text-gray-400">Trusted by companies across sectors</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((use, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-6 rounded-xl hover:bg-white/10 transition-all">
              <use.icon className="w-8 h-8 text-cyan-400 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{use.title}</h3>
              <p className="text-sm text-gray-400">{use.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}