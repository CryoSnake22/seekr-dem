'use client'

import React from 'react';
import { MoreHorizontal } from '@/components/ui/Icon';

type Trend = {
  name: string
  value: string
  priority: 'High' | 'Medium' | 'Low'
}

const priorityColor = {
  High: 'text-emerald-400',
  Medium: 'text-yellow-400',
  Low: 'text-neutral-400',
}

export const MarketTrends: React.FC<{ trends: Trend[] }> = ({ trends }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Trending Now</h3>
        <MoreHorizontal className="w-4 h-4 text-neutral-500" />
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 space-y-4">
        {trends.length === 0 && (
          <div className="text-sm text-neutral-400">No market data yet.</div>
        )}
        {trends.map((trend, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <span className="text-sm text-neutral-300">{trend.name}</span>
            <span className={`text-xs font-mono ${priorityColor[trend.priority]}`}>
              {trend.value}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-b from-primary/10 to-transparent border border-primary/20 rounded-xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="font-semibold text-primary mb-2">Upgrade to Pro</h4>
          <p className="text-xs text-neutral-300 mb-4">
            Get unlimited AI project generation and resume deep-scans.
          </p>
          <button className="w-full py-2 bg-primary text-black text-xs font-bold rounded hover:bg-emerald-400 transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
};
