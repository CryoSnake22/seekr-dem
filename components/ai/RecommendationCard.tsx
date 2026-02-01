'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Target, Code2, TrendingUp } from '@/components/ui/Icon';
import ChatPanel from './ChatPanel';

interface Skill {
  skill_name: string;
}

interface SkillGap {
  skill_name: string;
  priority: 'High' | 'Medium' | 'Low';
  frequency_in_jobs: number;
}

interface ProjectIdea {
  title: string;
  description: string;
  skills_demonstrated: string[];
}

interface RecommendationCardProps {
  userId: string;
  accessToken: string;
  userSkills: Skill[];
}

export default function RecommendationCard({
  userId,
  accessToken,
  userSkills,
}: RecommendationCardProps) {
  const [loading, setLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [generatingProjects, setGeneratingProjects] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  async function fetchRecommendations() {
    setLoading(true);
    try {
      // Fetch skill gaps from backend
      const response = await fetch('http://localhost:8000/api/v1/skills-gap', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Get top 3 missing skills sorted by priority and frequency
        const topGaps = (data.missing_skills || [])
          .sort((a: SkillGap, b: SkillGap) => {
            // Sort by priority first (High > Medium > Low)
            const priorityOrder = { High: 3, Medium: 2, Low: 1 };
            const priorityDiff =
              priorityOrder[b.priority] - priorityOrder[a.priority];
            if (priorityDiff !== 0) return priorityDiff;
            // Then by frequency
            return b.frequency_in_jobs - a.frequency_in_jobs;
          })
          .slice(0, 3);

        setSkillGaps(topGaps);

        // Generate insights based on gaps
        const newInsights = [];
        if (userSkills.length === 0) {
          newInsights.push('No skills added to profile yet - start by adding your current skills');
        }
        if (topGaps.length > 0) {
          newInsights.push(`Missing ${topGaps.length} high-demand skills from target roles`);
        }
        if (data.match_score < 60) {
          newInsights.push('Match score below competitive threshold - focus on closing skill gaps');
        }
        setInsights(newInsights);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateProjectIdeas() {
    if (projectIdeas.length > 0) return; // Already generated

    setGeneratingProjects(true);
    try {
      const response = await fetch('/api/backend/ai/generate-project', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          // Convert single project to array format
          const project: ProjectIdea = {
            title: data.data.title,
            description: data.data.description,
            skills_demonstrated: data.data.tech_stack || [],
          };
          setProjectIdeas([project]);

          // TODO: Generate a second project idea
          // For now, just show one
        }
      }
    } catch (error) {
      console.error('Error generating project ideas:', error);
    } finally {
      setGeneratingProjects(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center">
        <div className="w-8 h-8 mx-auto border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-neutral-400">Loading recommendations...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Next Best Move</h2>
            <p className="text-sm text-neutral-400">
              Based on your profile and skill gaps, here's what to focus on
            </p>
          </div>
          <Button
            onClick={() => setChatOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Start Conversation
          </Button>
        </div>

        {/* Skills to Learn */}
        {skillGaps.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Skills to Learn</h3>
            </div>
            <div className="space-y-2">
              {skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-neutral-600">{idx + 1}</span>
                    <div>
                      <p className="font-medium text-white">{gap.skill_name}</p>
                      <p className="text-xs text-neutral-400">
                        Appears in {Math.round(gap.frequency_in_jobs * 100)}% of jobs
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      gap.priority === 'High'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : gap.priority === 'Medium'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-neutral-700 text-neutral-400'
                    }`}
                  >
                    {gap.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Ideas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Recommended Projects</h3>
            </div>
            {projectIdeas.length === 0 && (
              <Button
                onClick={generateProjectIdeas}
                size="sm"
                disabled={generatingProjects}
                className="flex items-center gap-2"
              >
                {generatingProjects ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Ideas'
                )}
              </Button>
            )}
          </div>

          {projectIdeas.length === 0 ? (
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg text-center text-sm text-neutral-400">
              Click "Generate Ideas" to get AI-powered project suggestions based on your skill gaps
            </div>
          ) : (
            <div className="space-y-3">
              {projectIdeas.map((project, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2"
                >
                  <h4 className="font-semibold text-white">{project.title}</h4>
                  <p className="text-sm text-neutral-300">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills_demonstrated.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">What You're Missing</h3>
            </div>
            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg"
                >
                  <span className="text-orange-400 mt-0.5">•</span>
                  <p className="text-sm text-neutral-300">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Slide-in Chat Panel */}
      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        accessToken={accessToken}
      />
    </>
  );
}
