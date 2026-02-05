'use client';

import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Code, Database, Workflow } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Multi-Model Support',
    description: 'Switch between Llama, Mistral, Qwen, and custom models instantly',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Sub-10ms latency with optimized vLLM inference and Redis caching',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'WAF, prompt injection guards, SOC 2 compliance ready',
    color: 'from-green-400 to-emerald-500',
  },
  {
    icon: Code,
    title: 'Developer First',
    description: 'REST API, WebSocket streaming, SDKs for Python, Node.js, Go',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: Database,
    title: 'Production Ready',
    description: 'PostgreSQL, Redis, Vector DB with auto-scaling and backups',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: Workflow,
    title: 'Zero Downtime',
    description: 'Blue-green deployments with automatic rollback on AWS ECS',
    color: 'from-pink-400 to-rose-500',
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Enterprise-Grade Capabilities
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale AI applications
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass p-6 rounded-2xl hover:scale-105 transition-transform duration-300 group"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}