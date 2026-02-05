import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import UseCases from '@/components/landing/use-cases';
import Benchmarks from '@/components/landing/benchmarks';
import TrustBar from '@/components/landing/trust-bar';
import CTA from '@/components/landing/cta';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Hero />
      <Features />
      <UseCases />
      <Benchmarks />
      <TrustBar />
      <CTA />
    </main>
  );
}