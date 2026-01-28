'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowUpRight } from 'lucide-react';

type MatchScoreCardProps = {
  roleLabel: string
  score: number
  deltaLabel: string
}

export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ roleLabel, score, deltaLabel }) => {
  return (
    <div className="col-span-1 md:col-span-8 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-30 transition-opacity">
        <BarChart3 className="w-48 h-48 text-primary" />
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Match Score</h2>
          <p className="text-neutral-400">Based on &quot;{roleLabel}&quot; market demand</p>
        </div>
        <div className="flex items-end gap-4 mt-8">
          <span className="text-7xl font-bold tracking-tighter">{score}<span className="text-3xl text-neutral-500 font-normal">%</span></span>
          <div className="mb-3 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" /> {deltaLabel}
          </div>
        </div>
        <div className="mt-6 h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-primary rounded-full relative"
          >
            <div className="absolute top-0 right-0 bottom-0 w-[100px] bg-gradient-to-r from-transparent to-white/20" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
