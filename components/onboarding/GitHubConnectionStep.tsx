'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface GitHubConnectionStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function GitHubConnectionStep({ onComplete, onBack }: GitHubConnectionStepProps) {
  const [connecting, setConnecting] = useState(false);

  const handleGitHubConnect = async () => {
    setConnecting(true);
    try {
      // Redirect to GitHub OAuth flow
      // Backend will handle the OAuth flow and redirect back
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      window.location.href = `${backendUrl}/api/v1/github-oauth/authorize`;
    } catch (error) {
      console.error('Failed to initiate GitHub connection:', error);
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Connect Your GitHub</h2>
        <p className="text-sm text-neutral-400 max-w-md mx-auto">
          Import your repositories as projects to showcase your work and demonstrate your skills.
        </p>
      </div>

      {/* Benefits section */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white mb-3">What you'll get:</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Automatic project import</p>
              <p className="text-xs text-neutral-400">We'll analyze your repositories and extract technologies used</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Skills detection</p>
              <p className="text-xs text-neutral-400">Languages and frameworks automatically added to your profile</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Boost your match score</p>
              <p className="text-xs text-neutral-400">More projects = higher match scores with employers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy note */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="flex-shrink-0 w-5 h-5 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-xs font-medium text-blue-300">We only read public repository data</p>
            <p className="text-xs text-blue-400/70 mt-1">
              We cannot access private repos or modify any of your code. You can disconnect anytime from your profile.
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onBack}
          disabled={connecting}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={onComplete}
          disabled={connecting}
          variant="outline"
          className="flex-1"
        >
          Skip for now
        </Button>
      </div>

      <div className="text-center">
        <Button
          onClick={handleGitHubConnect}
          disabled={connecting}
          className="inline-flex items-center gap-2 bg-[#24292F] hover:bg-[#2c3237]"
        >
          {connecting ? (
            <>
              <span className="animate-spin">⏳</span>
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Connect with GitHub
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-center text-neutral-500">
        You can also connect GitHub later from your profile page
      </p>
    </div>
  );
}
