'use client';

import { X } from '@/components/ui/Icon';

export interface ProjectSpec {
  title: string;
  description: string;
  tech_stack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_time: string;
  getting_started: string[];
}

interface ProjectSpecModalProps {
  spec: ProjectSpec;
  onClose: () => void;
  onSave: () => void;
}

export default function ProjectSpecModal({ spec, onClose, onSave }: ProjectSpecModalProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Intermediate':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Advanced':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0A0A0A] border-b border-white/10 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-white">{spec.title}</h2>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getDifficultyColor(spec.difficulty)}`}>
                {spec.difficulty}
              </span>
            </div>
            <p className="text-sm text-neutral-400">{spec.description}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tech Stack */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {spec.tech_stack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Time Estimate */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-white">Estimated Time:</span>
              <span className="text-sm text-neutral-400">{spec.estimated_time}</span>
            </div>
          </div>

          {/* Getting Started */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Getting Started</h3>
            <ol className="space-y-3">
              {spec.getting_started.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center border border-primary/40">
                    {index + 1}
                  </span>
                  <p className="text-sm text-neutral-300 flex-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0A0A0A] border-t border-white/10 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white/5 text-neutral-300 rounded-lg font-medium hover:bg-white/10 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2.5 bg-primary text-black rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
          >
            Save to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
