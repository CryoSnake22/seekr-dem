'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Code2, TrendingUp } from '@/components/ui/Icon';

interface Project {
  id: string;
  title: string;
  description: string | null;
  technologies: string[] | null;
  github_url: string | null;
}

interface Enhancement {
  suggestion: string;
  impact: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface ProjectEnhancementsProps {
  projects: Project[];
  accessToken: string;
}

export default function ProjectEnhancements({
  projects,
  accessToken,
}: ProjectEnhancementsProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [enhancements, setEnhancements] = useState<Record<string, Enhancement[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  async function generateEnhancements(projectId: string, projectTitle: string, projectDescription: string) {
    setLoading({ ...loading, [projectId]: true });

    try {
      // Call backend AI service to generate enhancement suggestions
      const response = await fetch('/api/backend/ai/enhance-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_title: projectTitle,
          project_description: projectDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Mock enhancements for now
        const mockEnhancements: Enhancement[] = [
          {
            suggestion: 'Add CI/CD pipeline with GitHub Actions',
            impact: 'Demonstrates DevOps skills and deployment automation',
            difficulty: 'Medium',
          },
          {
            suggestion: 'Implement comprehensive unit and integration tests',
            impact: 'Shows commitment to code quality and testing best practices',
            difficulty: 'Easy',
          },
          {
            suggestion: 'Add real-time features with WebSockets',
            impact: 'Demonstrates advanced full-stack capabilities',
            difficulty: 'Hard',
          },
        ];

        setEnhancements({ ...enhancements, [projectId]: mockEnhancements });
        setSelectedProject(projectId);
      }
    } catch (error) {
      console.error('Error generating enhancements:', error);
    } finally {
      setLoading({ ...loading, [projectId]: false });
    }
  }

  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Project Enhancements</h2>
        </div>
        <p className="text-sm text-neutral-400">
          AI-powered suggestions to make your projects more impressive
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.slice(0, 5).map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {project.description || 'No description provided'}
                </p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-neutral-800 text-neutral-300 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() =>
                  generateEnhancements(
                    project.id,
                    project.title,
                    project.description || ''
                  )
                }
                size="sm"
                disabled={loading[project.id]}
                className="ml-4"
              >
                {loading[project.id] ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  'Get Suggestions'
                )}
              </Button>
            </div>

            {/* Enhancement Suggestions */}
            {enhancements[project.id] && selectedProject === project.id && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium text-white">Suggested Enhancements</p>
                </div>
                {enhancements[project.id].map((enhancement, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-primary/5 border border-primary/10 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-white">
                        {enhancement.suggestion}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded ml-2 ${
                          enhancement.difficulty === 'Easy'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : enhancement.difficulty === 'Medium'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {enhancement.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{enhancement.impact}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
