'use client'

import React from 'react';
import { Search, Bell } from '@/components/ui/Icon';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Dashboard', subtitle = 'Overview' }) => {
  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center gap-4 text-sm text-neutral-500">
        <span>{title}</span>
        <span>/</span>
        <span className="text-white">{subtitle}</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            placeholder="Search jobs, skills..."
            className="h-8 w-60 bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
        <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-black"></span>
        </button>
        <UserMenu />
      </div>
    </header>
  );
};
