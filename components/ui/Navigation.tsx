'use client'

import React from 'react';
import Link from 'next/link';
import { Compass } from '@/components/ui/Icon';

export const Navbar: React.FC = () => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-6 px-4 animate-fade-in-down"
    >
      <div className="glass-card rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl bg-black/50 border border-white/10 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="p-1 bg-white/5 rounded-md border border-white/10">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">Seekr</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-textSecondary">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#market-data" className="hover:text-white transition-colors">Market Data</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-textSecondary hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="group relative px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
