'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, TrendingUp } from 'lucide-react';
import { ButtonBeam, BeamTexture } from '../ui/Effects';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-32 pb-20 w-full max-w-7xl mx-auto z-20">
      <BeamTexture />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live Job Market Data for 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-neutral-500"
        >
          Stop Guessing. <br />
          Start Learning <span className="text-white">What Matters.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          6.1% unemployment for CS grads is a choice. Seekr analyzes 100+ job postings weekly to tell you exactly which skills to prioritize and what to build.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group relative px-8 py-3.5 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all hover:scale-105"
          >
            <ButtonBeam />
            <span className="relative z-10 flex items-center gap-2">
              Get Your Match Score <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-neutral-900 border border-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            View Live Demo
          </Link>
        </motion.div>
      </div>

      {/* Hero Visual */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-20 w-full max-w-5xl mx-auto relative group z-10"
      >
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
        <div className="relative glass-card rounded-xl border border-white/10 overflow-hidden shadow-2xl">
           {/* Mock Dashboard UI Header */}
           <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-black/40">
             <div className="w-3 h-3 rounded-full bg-red-500/50" />
             <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
             <div className="w-3 h-3 rounded-full bg-green-500/50" />
             <div className="ml-4 h-5 w-64 bg-white/5 rounded text-[10px] flex items-center px-2 text-neutral-500 font-mono">seekr.app/dashboard/analytics</div>
           </div>

           {/* Mock Dashboard Content */}
           <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#050505]">
                <div className="col-span-2 space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-textSecondary text-sm mb-1">Target Role Match</div>
                            <div className="text-3xl font-bold text-white">72<span className="text-neutral-500">/100</span></div>
                        </div>
                        <div className="text-primary text-sm font-medium flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> +12% this week
                        </div>
                    </div>
                    {/* Fake Chart */}
                    <div className="h-40 flex items-end gap-2 border-b border-white/5 pb-2">
                        {[40, 65, 45, 80, 55, 90, 72].map((h, i) => (
                            <div key={i} className="flex-1 bg-neutral-800 hover:bg-primary/50 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 border border-white/10 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Score: {h}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-neutral-900/50 border border-white/5">
                            <div className="text-xs text-textSecondary uppercase tracking-wider mb-2">Missing Skills</div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded-md bg-red-900/20 text-red-400 text-xs border border-red-900/30">Docker (68%)</span>
                                <span className="px-2 py-1 rounded-md bg-yellow-900/20 text-yellow-400 text-xs border border-yellow-900/30">AWS (55%)</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-neutral-900/50 border border-white/5">
                            <div className="text-xs text-textSecondary uppercase tracking-wider mb-2">Recommended Action</div>
                            <div className="text-sm text-white">Build &quot;Containerized Task Manager&quot;</div>
                        </div>
                    </div>
                </div>

                {/* Side Panel Mock */}
                <div className="col-span-1 border-l border-white/5 pl-6 space-y-4">
                    <div className="text-sm font-medium text-white mb-4">Live Market Intelligence</div>
                    {[
                        { skill: "React", pct: "85%", trend: "up" },
                        { skill: "TypeScript", pct: "72%", trend: "up" },
                        { skill: "Docker", pct: "68%", trend: "up" },
                        { skill: "GraphQL", pct: "23%", trend: "down" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-neutral-700 group-hover:bg-primary transition-colors" />
                                <span className="text-sm text-textSecondary group-hover:text-white transition-colors">{item.skill}</span>
                            </div>
                            <span className="text-xs font-mono text-neutral-500">{item.pct}</span>
                        </div>
                    ))}

                    <div className="mt-8 pt-6 border-t border-white/5">
                         <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="flex gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                    <BrainCircuit className="w-3 h-3 text-primary" />
                                </div>
                                <span className="text-xs font-semibold text-primary">AI Advisor</span>
                            </div>
                            <p className="text-[11px] text-neutral-300 leading-relaxed">
                                &quot;Based on your missing Docker skills, you should build a microservice app...&quot;
                            </p>
                         </div>
                    </div>
                </div>
           </div>
        </div>
      </motion.div>
    </section>
  );
};
