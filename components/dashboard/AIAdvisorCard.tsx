'use client'

import React from 'react';
import { Cpu, ArrowUpRight } from 'lucide-react';
import { ButtonBeam } from '../ui/Effects';

export const AIAdvisorCard: React.FC = () => {
  return (
    <div className="col-span-1 md:col-span-4 bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary border border-primary/20">
          <Cpu className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold mb-2">AI Advisor</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          You are missing <span className="text-white font-medium">Docker</span> and <span className="text-white font-medium">AWS</span> experience.
          Building a containerized microservice would boost your score by ~15%.
        </p>
      </div>
      <button className="group relative w-full mt-6 py-3 bg-white text-black font-semibold rounded-lg overflow-hidden transition-transform active:scale-95">
        <ButtonBeam />
        <span className="relative z-10 flex items-center justify-center gap-2">
          Generate Project Spec <ArrowUpRight className="w-4 h-4" />
        </span>
      </button>
    </div>
  );
};
