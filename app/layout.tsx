import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rajora AI - World-Class LLM Platform',
  description: 'Enterprise-grade open-source LLM chatbot with admin CMS, multi-model support, and zero-downtime deployment',
  keywords: ['AI', 'LLM', 'Chatbot', 'Open Source', 'Enterprise', 'AWS'],
  authors: [{ name: 'Rajora AI Team' }],
  openGraph: {
    title: 'Rajora AI Platform',
    description: 'World-class LLM platform for enterprises',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}