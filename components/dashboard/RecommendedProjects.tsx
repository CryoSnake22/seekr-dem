'use client'

import React from 'react';
import { LayoutDashboard, Plus } from 'lucide-react';

export const RecommendedProjects: React.FC = () => {
  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recommended Projects</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-[#0A0A0A] border border-white/10 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 rounded bg-neutral-900 border border-white/5">
              <LayoutDashboard className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
            </div>
            <div className="text-xs font-mono text-emerald-500">+15% Score</div>
          </div>
          <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">Microservice Task Manager</h4>
          <p className="text-xs text-neutral-500 mb-4 line-clamp-2">Build a task API using Express and Docker, deploy to ECS.</p>
          <div className="flex gap-2">
            <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-neutral-400">Docker</span>
            <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-neutral-400">AWS</span>
          </div>
        </div>
        <div className="p-5 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-neutral-400" />
          </div>
          <span className="text-sm font-medium text-neutral-300">Generate New Project</span>
        </div>
      </div>
    </div>
  );
};
