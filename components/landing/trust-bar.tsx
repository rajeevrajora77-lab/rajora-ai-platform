'use client';

import { Shield, Lock, Eye, FileCheck } from 'lucide-react';

export default function TrustBar() {
  return (
    <section className="py-16 px-4 bg-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Shield className="w-8 h-8 text-green-400" />
            <span className="text-white font-semibold">SOC 2 Ready</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Lock className="w-8 h-8 text-blue-400" />
            <span className="text-white font-semibold">GDPR Compliant</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Eye className="w-8 h-8 text-purple-400" />
            <span className="text-white font-semibold">Open Source</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <FileCheck className="w-8 h-8 text-cyan-400" />
            <span className="text-white font-semibold">Audit Logs</span>
          </div>
        </div>
      </div>
    </section>
  );
}