'use client'

import React from 'react';

export const SkillsGapList: React.FC = () => {
  const skills = [
    { name: "Docker", priority: "High", frequency: "68% of jobs", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
    { name: "AWS / Cloud", priority: "Medium", frequency: "55% of jobs", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
    { name: "CI/CD Pipelines", priority: "Medium", frequency: "42% of jobs", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  ];

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Critical Skill Gaps</h3>
        <button className="text-sm text-neutral-400 hover:text-white">View All</button>
      </div>

      <div className="space-y-3">
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-white/5 rounded-xl hover:border-white/20 transition-colors group">
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${skill.color.replace('text', 'bg')}`} />
              <div>
                <div className="font-medium text-white group-hover:text-primary transition-colors">{skill.name}</div>
                <div className="text-xs text-neutral-500">Appears in {skill.frequency}</div>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded text-xs font-medium border ${skill.bg} ${skill.border} ${skill.color}`}>
              {skill.priority} Priority
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
