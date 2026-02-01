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

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
}

function getFreshnessIndicator(date: Date): { color: string; status: string } {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return { color: 'bg-green-500', status: 'Fresh' };
  } else if (diffDays < 30) {
    return { color: 'bg-yellow-500', status: 'Recent' };
  } else {
    return { color: 'bg-red-500', status: 'Stale' };
  }
}

export const MarketTrends: React.FC<{
  trends: Trend[];
  lastUpdated?: Date | null;
}> = ({ trends, lastUpdated }) => {
  const freshness = lastUpdated ? getFreshnessIndicator(lastUpdated) : null;
  const timeAgo = lastUpdated ? getTimeAgo(lastUpdated) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Trending Now</h3>
          {freshness && (
            <div className="flex items-center gap-1.5 group relative">
              <span className={`w-2 h-2 rounded-full ${freshness.color} animate-pulse`} />
              <span className="absolute left-0 top-6 bg-black border border-white/10 rounded-lg px-2 py-1 text-xs text-neutral-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {freshness.status} - Updated {timeAgo}
              </span>
            </div>
          )}
        </div>
        <MoreHorizontal className="w-4 h-4 text-neutral-500" />
      </div>

      {lastUpdated && (
        <div className="text-xs text-neutral-500">
          Last updated: {timeAgo}
        </div>
      )}

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
