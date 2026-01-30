"use client";

import React from "react";
import { Cpu, ArrowUpRight } from "@/components/ui/Icon";

type AIAdvisorCardProps = {
  missingSkills: string[];
};

export const AIAdvisorCard: React.FC<AIAdvisorCardProps> = ({
  missingSkills,
}) => {
  const [first, second] = missingSkills;

  return (
    <div className="col-span-1 md:col-span-4 bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
      <div>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary border border-primary/20">
          <Cpu className="w-4 h-4" />
        </div>
        <h3 className="text-base font-semibold mb-2">AI Advisor</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          {first ? (
            <>
              You are missing{" "}
              <span className="text-white font-medium">{first}</span>
              {second ? (
                <>
                  {" "}
                  and <span className="text-white font-medium">
                    {second}
                  </span>{" "}
                  experience.
                </>
              ) : (
                <> experience.</>
              )}
              Building a focused project would boost your score.
            </>
          ) : (
            "Add skills and target roles to unlock AI guidance."
          )}
        </p>
      </div>
      <button className="group relative w-full mt-5 py-2.5 bg-white text-black font-semibold rounded-lg overflow-hidden transition-transform active:scale-95">
        <span className="absolute inset-0 overflow-hidden rounded-md">
          <span className="absolute top-0 left-0 h-full w-[20px] -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        </span>
        <span className="relative z-10 flex items-center justify-center gap-2">
          Generate Project Spec <ArrowUpRight className="w-4 h-4" />
        </span>
      </button>
    </div>
  );
};
