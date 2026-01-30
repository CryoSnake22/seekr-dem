'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, AlertCircle, Code2, TrendingUp } from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface GitHubStatus {
  connected: boolean;
  github_username: string | null;
  repo_count: number;
  last_synced: string | null;
}

interface DetectedSkill {
  skill_name: string;
  proficiency_level: string;
  usage_context: string;
  confidence: number;
}

interface GitHubRepo {
  id: string;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  languages: Record<string, number>;
  stargazers_count: number;
  pushed_at: string | null;
}

interface SyncStats {
  new: number;
  updated: number;
  unchanged: number;
  filtered: number;
}

interface SyncResult {
  synced_count: number;
  detected_skills: DetectedSkill[];
  projects_created: number;
  repositories: GitHubRepo[];
  stats: SyncStats;
}

export default function GitHubConnect() {
  const [status, setStatus] = useState<GitHubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRepoSelection, setShowRepoSelection] = useState(false);
  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    checkGitHubStatus();
  }, []);

  async function checkGitHubStatus() {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/github/status', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check GitHub status');
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error('Error checking GitHub status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check status');
    } finally {
      setLoading(false);
    }
  }

  async function connectGitHub() {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError('Not authenticated');
        return;
      }

      // Redirect to custom GitHub OAuth flow (doesn't log out current user)
      const authorizeUrl = `http://localhost:8000/api/v1/github/oauth/authorize?token=${encodeURIComponent(session.access_token)}`;
      window.location.href = authorizeUrl;
    } catch (err) {
      console.error('Error connecting GitHub:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect GitHub');
    }
  }

  async function syncRepositories() {
    setSyncing(true);
    setError(null);
    setSyncResult(null);
    setShowRepoSelection(false);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:8000/api/v1/github/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          force_refresh: false, // Smart sync by default
          analyze_skills: true,
          min_stars: 0, // Include all repos
          exclude_forks: true, // Exclude forked repos
          max_age_days: 730, // Only repos updated in last 2 years
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to sync repositories');
      }

      const result = await response.json();
      setSyncResult(result);

      // Show repository selection UI
      if (result.repositories && result.repositories.length > 0) {
        setShowRepoSelection(true);
        // Pre-select top 5 starred repos
        const topRepos = [...result.repositories]
          .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
          .slice(0, 5)
          .map(r => r.id);
        setSelectedRepos(new Set(topRepos));
      }

      // Refresh status
      await checkGitHubStatus();
    } catch (err) {
      console.error('Error syncing repositories:', err);
      setError(err instanceof Error ? err.message : 'Failed to sync repositories');
    } finally {
      setSyncing(false);
    }
  }

  async function importSelectedProjects() {
    if (selectedRepos.size === 0) {
      setError('Please select at least one repository to import');
      return;
    }

    setImporting(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:8000/api/v1/github/import-projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(Array.from(selectedRepos)),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to import projects');
      }

      const result = await response.json();

      // Update sync result to show import completion
      if (syncResult) {
        setSyncResult({
          ...syncResult,
          projects_created: result.projects_created,
        });
      }

      setShowRepoSelection(false);
      await checkGitHubStatus();
    } catch (err) {
      console.error('Error importing projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to import projects');
    } finally {
      setImporting(false);
    }
  }

  function toggleRepoSelection(repoId: string) {
    const newSelection = new Set(selectedRepos);
    if (newSelection.has(repoId)) {
      newSelection.delete(repoId);
    } else {
      newSelection.add(repoId);
    }
    setSelectedRepos(newSelection);
  }

  if (loading) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-neutral-400">Checking GitHub connection...</span>
        </div>
      </div>
    );
  }

  if (!status?.connected) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
            <Code2 className="w-6 h-6 text-neutral-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Connect GitHub</h3>
            <p className="text-sm text-neutral-400 mb-4">
              Automatically import your repositories, detect skills from your code, and showcase your best projects.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Auto-detect skills from your repositories
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Import projects with descriptions
              </li>
              <li className="flex items-center gap-2 text-sm text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Keep your profile up-to-date automatically
              </li>
            </ul>
            <Button onClick={connectGitHub} size="lg" className="bg-white text-black hover:bg-neutral-200">
              <Code2 className="w-4 h-4" />
              Connect GitHub Account
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">GitHub Connected</h3>
              <p className="text-sm text-neutral-400">
                {status.github_username && `@${status.github_username} • `}
                {status.repo_count} {status.repo_count === 1 ? 'repository' : 'repositories'} synced
              </p>
              {status.last_synced && (
                <p className="text-xs text-neutral-500 mt-1">
                  Last synced: {new Date(status.last_synced).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <Button onClick={syncRepositories} disabled={syncing} size="sm">
            {syncing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Sync Now
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Repository Selection */}
      {showRepoSelection && syncResult && syncResult.repositories && (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Select Projects to Import</h3>
            <p className="text-sm text-neutral-400">
              Choose which repositories you want to showcase as projects on your profile.
              We've pre-selected your top-starred repos.
            </p>
          </div>

          {/* Repository List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {syncResult.repositories
              .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
              .map((repo) => (
                <label
                  key={repo.id}
                  className="flex items-start gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedRepos.has(repo.id)}
                    onCheckedChange={() => toggleRepoSelection(repo.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white truncate">{repo.name}</span>
                      {repo.stargazers_count > 0 && (
                        <span className="text-xs text-yellow-400">⭐ {repo.stargazers_count}</span>
                      )}
                      {repo.language && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                          {repo.language}
                        </span>
                      )}
                    </div>
                    {repo.description && (
                      <p className="text-sm text-neutral-400 line-clamp-2">{repo.description}</p>
                    )}
                  </div>
                </label>
              ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <p className="text-sm text-neutral-400">
              {selectedRepos.size} {selectedRepos.size === 1 ? 'repository' : 'repositories'} selected
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowRepoSelection(false)}>
                Cancel
              </Button>
              <Button onClick={importSelectedProjects} disabled={importing || selectedRepos.size === 0}>
                {importing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>Import Selected</>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Sync Results */}
      {syncResult && !showRepoSelection && syncResult.projects_created > 0 && (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Import Complete!</h3>

          {/* Sync Stats */}
          {syncResult.stats && (syncResult.stats.new > 0 || syncResult.stats.updated > 0 || syncResult.stats.unchanged > 0) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {syncResult.stats.new > 0 && (
                <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full">
                  {syncResult.stats.new} new
                </span>
              )}
              {syncResult.stats.updated > 0 && (
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
                  {syncResult.stats.updated} updated
                </span>
              )}
              {syncResult.stats.unchanged > 0 && (
                <span className="px-3 py-1 bg-neutral-500/10 border border-neutral-500/20 text-neutral-400 rounded-full">
                  {syncResult.stats.unchanged} unchanged
                </span>
              )}
              {syncResult.stats.filtered > 0 && (
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full">
                  {syncResult.stats.filtered} filtered
                </span>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{syncResult.synced_count}</div>
              <div className="text-sm text-neutral-400 mt-1">Repositories Synced</div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{syncResult.detected_skills.length}</div>
              <div className="text-sm text-neutral-400 mt-1">Skills Detected</div>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{syncResult.projects_created}</div>
              <div className="text-sm text-neutral-400 mt-1">Projects Imported</div>
            </div>
          </div>

          {syncResult.detected_skills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 text-neutral-300">Detected Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {syncResult.detected_skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{skill.skill_name}</span>
                    <span className="text-xs text-emerald-400/60">({skill.proficiency_level})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-neutral-400">
            Your skills and projects have been updated! Check your profile and match scores to see improvements.
          </p>
        </div>
      )}
    </div>
  );
}
