'use client'

import React from 'react';
import { Database, Code2, Target, TrendingUp } from '@/components/ui/Icon';
import { GlowCard } from '../ui/Effects';

export const ValuePropSection: React.FC = () => {
  const cards = [
    {
      title: "Market Intelligence",
      desc: "We analyze 50-100 job postings weekly. Know exactly what companies want right now, not last year.",
      icon: <Database className="w-6 h-6 text-primary" />,
      stat: "85% of jobs require React",
      cols: "md:col-span-2"
    },
    {
      title: "AI Project Advisor",
      desc: "Stop tutorial hell. Get specific project specs that demonstrate the exact skills you're missing.",
      icon: <Code2 className="w-6 h-6 text-purple-400" />,
      stat: "Personalized Specs",
      cols: "md:col-span-1"
    },
    {
      title: "Gap Analysis",
      desc: "Upload your resume. We compare it against live market data to find your critical blind spots.",
      icon: <Target className="w-6 h-6 text-blue-400" />,
      stat: "Match Score™",
      cols: "md:col-span-1"
    },
    {
      title: "10-50x ROI",
      desc: "The same outcome as a $14K bootcamp for a fraction of the cost. Get hired faster.",
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      stat: "$79/mo vs $14,000",
      cols: "md:col-span-2"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 w-full max-w-7xl mx-auto relative z-20 bg-background/50 backdrop-blur-sm md:backdrop-blur-none md:bg-transparent">
      <div className="mb-16 md:text-center max-w-2xl mx-auto">
        <div
           className="animate-fade-in-up"
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don&apos;t fly blind.</h2>
            <p className="text-textSecondary">
                Most CS grads apply to 150+ jobs with no feedback. Seekr gives you the data to apply to 50 jobs and get 5 interviews.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`${card.cols} animate-fade-in-up`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <GlowCard className={`flex flex-col justify-between min-h-[240px]`}>
                <div>
                <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg border border-white/10">
                    {card.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-textSecondary text-sm leading-relaxed mb-6">
                    {card.desc}
                </p>
                </div>
                <div className="pt-4 border-t border-white/5">
                <span className="text-xs font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded">
                    {card.stat}
                </span>
                </div>
            </GlowCard>
          </div>
        ))}
      </div>
    </section>
  );
};
