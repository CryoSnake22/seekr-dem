import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (view: 'landing' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-6 px-4"
    >
      <div className="glass-card rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl bg-black/50 border border-white/10 backdrop-blur-md">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate?.('landing')}
        >
            <div className="p-1 bg-white/5 rounded-md border border-white/10">
                <Compass className="w-5 h-5 text-primary" />
            </div>
          <span className="font-bold text-lg tracking-tight text-white">Seekr</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-textSecondary">
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#market-data" className="hover:text-white transition-colors">Market Data</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate?.('dashboard')} className="hidden sm:block text-sm font-medium text-textSecondary hover:text-white transition-colors">Log in</button>
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="group relative px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};