"use client";

import React, { useState } from "react";
import { Cpu, ArrowUpRight } from "@/components/ui/Icon";
import ProjectSpecModal, { ProjectSpec } from "./ProjectSpecModal";
import { createClient } from "@/lib/supabase/client";

type AIAdvisorCardProps = {
  missingSkills: string[];
};

export const AIAdvisorCard: React.FC<AIAdvisorCardProps> = ({
  missingSkills,
}) => {
  const [first, second] = missingSkills;
  const [generating, setGenerating] = useState(false);
  const [projectSpec, setProjectSpec] = useState<ProjectSpec | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateProject = async () => {
    setGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/backend/ai/generate-project', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.detail || result.error.message || 'Failed to generate project');
        return;
      }

      if (result.data) {
        setProjectSpec(result.data);
      }
    } catch (err) {
      console.error('Error generating project:', err);
      setError('Failed to generate project. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveProject = async () => {
    if (!projectSpec) return;

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Save project to profile
      const { error } = await supabase.from('projects').insert({
        user_id: userData.user.id,
        title: projectSpec.title,
        description: projectSpec.description,
        technologies: projectSpec.tech_stack,
      });

      if (error) throw error;

      // Close modal and show success
      setProjectSpec(null);
      alert('Project saved to your profile!');
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project. Please try again.');
    }
  };

  return (
    <>
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
          {error && (
            <p className="text-xs text-red-400 mt-2">{error}</p>
          )}
        </div>
        <button
          onClick={handleGenerateProject}
          disabled={generating || !first}
          className="group relative w-full mt-5 py-2.5 bg-white text-black font-semibold rounded-lg overflow-hidden transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 overflow-hidden rounded-md">
            <span className="absolute top-0 left-0 h-full w-[20px] -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          </span>
          <span className="relative z-10 flex items-center justify-center gap-2">
            {generating ? (
              <>
                <span className="animate-spin">⏳</span>
                Generating...
              </>
            ) : (
              <>
                Generate Project Spec <ArrowUpRight className="w-4 h-4" />
              </>
            )}
          </span>
        </button>
      </div>

      {/* Project Spec Modal */}
      {projectSpec && (
        <ProjectSpecModal
          spec={projectSpec}
          onClose={() => setProjectSpec(null)}
          onSave={handleSaveProject}
        />
      )}
    </>
  );
};
