'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Target, CheckCircle2, AlertCircle, ArrowLeft, Plus } from '@/components/ui/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import JobDetailModal from '@/components/jobs/JobDetailModal';

interface MatchedSkill {
  skill_name: string;
  proficiency: string | null;
}

interface MissingSkill {
  skill_name: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface JobAnalysisResult {
  job_id: string | null;
  title: string;
  company: string;
  location: string | null;
  job_role: string;
  source: string;
  url: string | null;
  match_score: number;
  matched_skills_count: number;
  total_skills_count: number;
  matched_skills: MatchedSkill[];
  missing_skills: MissingSkill[];
  recommendations: string[];
  saved: boolean;
}

interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string | null;
  job_role: string;
  match_score: number;
  saved_at: string;
  url: string | null;
  required_skills: string[];
}

export default function JobsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysisResult | null>(null);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [viewingJob, setViewingJob] = useState<SavedJob | null>(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  async function fetchSavedJobs() {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/jobs/saved', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch saved jobs');
      }

      const data = await response.json();
      setSavedJobs(data.jobs || []);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    }
  }

  async function analyzeJob() {
    if (!jobUrl && !jobText) {
      setError('Please provide a job URL or paste the job description');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const requestBody = {
        url: inputType === 'url' ? jobUrl : null,
        text: inputType === 'text' ? jobText : null,
        save_job: false,
      };

      const response = await fetch('http://localhost:8000/api/v1/jobs/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze job');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function saveAnalyzedJob() {
    if (!analysis) return;

    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const requestBody = {
        url: analysis.url,
        text: inputType === 'text' ? jobText : null,
        save_job: true,
      };

      const response = await fetch('http://localhost:8000/api/v1/jobs/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to save job');
      }

      await fetchSavedJobs();
      setAnalysis((prev) => prev ? { ...prev, saved: true, job_id: null } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save job');
    } finally {
      setSaving(false);
    }
  }

  async function deleteSavedJob(jobId: string) {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return;
      }

      const response = await fetch(`http://localhost:8000/api/v1/jobs/saved/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      await fetchSavedJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  }

  function resetAnalysis() {
    setAnalysis(null);
    setJobUrl('');
    setJobText('');
    setError(null);
    setDialogOpen(false);
  }

  function getMatchScoreColor(score: number): string {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }

  function getMatchScoreBg(score: number): string {
    if (score >= 90) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 75) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 50) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Jobs</h1>
        <p className="text-neutral-400">
          Track your job applications and analyze your match scores
        </p>
      </div>

      <Tabs defaultValue="my-jobs" className="w-full">
        {/* Tabs and Add Job Button */}
        <div className="flex items-center justify-between gap-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
            <TabsTrigger value="my-jobs">My Jobs</TabsTrigger>
          </TabsList>

          <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Job
          </Button>
        </div>

        {/* All Jobs Tab */}
        <TabsContent value="all-jobs" className="space-y-6 mt-6">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center">
            <Target className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scraped jobs yet</h3>
            <p className="text-sm text-neutral-400">
              Job scraping will be added in a future update
            </p>
          </div>
        </TabsContent>

        {/* My Jobs Tab */}
        <TabsContent value="my-jobs" className="space-y-6 mt-6">
          {savedJobs.length === 0 ? (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-12 text-center">
              <Target className="w-12 h-12 mx-auto text-neutral-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved jobs yet</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Start by adding a job to analyze your match score
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                Add Your First Job
              </Button>
            </div>
          ) : (
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Saved Jobs ({savedJobs.length})</h2>
              <div className="space-y-3">
                {savedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{job.title}</h3>
                      <p className="text-sm text-neutral-400 truncate">
                        {job.company}
                        {job.location && ` • ${job.location}`}
                      </p>
                      <span className="inline-block mt-1 text-xs px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded">
                        {job.job_role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getMatchScoreColor(job.match_score)}`}>
                          {Math.round(job.match_score)}%
                        </div>
                        <div className="text-xs text-neutral-500">match</div>
                      </div>
                      <Button
                        onClick={() => setViewingJob(job)}
                        variant="outline"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => deleteSavedJob(job.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-400 opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Job Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Job</DialogTitle>
            <DialogDescription>
              Analyze how well you match with a job by providing the URL or pasting the description
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Input Section - Hide when showing analysis */}
            {!analysis && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setInputType('url')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputType === 'url'
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Job URL
                  </button>
                  <button
                    onClick={() => setInputType('text')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      inputType === 'text'
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Paste Description
                  </button>
                </div>

                {inputType === 'url' ? (
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Job Posting URL
                    </label>
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                      placeholder="https://company.com/careers/job-posting..."
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      Supports company career pages and public job boards. Note: LinkedIn URLs are not supported - please paste the description instead.
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Job Description
                    </label>
                    <textarea
                      value={jobText}
                      onChange={(e) => setJobText(e.target.value)}
                      placeholder="Paste the full job description here..."
                      rows={10}
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                    />
                  </div>
                )}

                <button
                  onClick={analyzeJob}
                  disabled={loading || (!jobUrl && !jobText)}
                  className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      Analyze Job Match
                    </>
                  )}
                </button>

                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Results - Takes center stage */}
            {analysis && (
              <div className="space-y-6">
                {/* Back button */}
                <button
                  onClick={resetAnalysis}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Analyze Another Job
                </button>

                <div className="space-y-6">
                  {/* Job Header */}
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{analysis.title}</h2>
                    <p className="text-neutral-400">
                      {analysis.company}
                      {analysis.location && ` • ${analysis.location}`}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                        {analysis.job_role}
                      </span>
                      {analysis.source && (
                        <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-neutral-400 rounded-full text-xs">
                          {analysis.source}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className={`p-6 rounded-xl border ${getMatchScoreBg(analysis.match_score)}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Match Score</h3>
                        <p className="text-sm text-neutral-400">
                          You have {analysis.matched_skills_count} of {analysis.total_skills_count} required skills
                        </p>
                      </div>
                      <div className={`text-5xl font-bold ${getMatchScoreColor(analysis.match_score)}`}>
                        {Math.round(analysis.match_score)}%
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${analysis.match_score}%` }}
                        className={`h-full rounded-full transition-all duration-1000 ${
                          analysis.match_score >= 90
                            ? 'bg-emerald-500'
                            : analysis.match_score >= 75
                            ? 'bg-blue-500'
                            : analysis.match_score >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  {!analysis.saved && (
                    <button
                      onClick={saveAnalyzedJob}
                      disabled={saving}
                      className="w-full px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Save This Job
                        </>
                      )}
                    </button>
                  )}

                  {analysis.saved && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Job saved successfully!</span>
                    </div>
                  )}

                  {/* Recommendations */}
                  {analysis.recommendations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                            <span className="text-primary mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills Breakdown */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Matched Skills */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        Your Skills ({analysis.matched_skills_count})
                      </h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                        {analysis.matched_skills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg"
                          >
                            <span className="text-sm text-neutral-200">{skill.skill_name}</span>
                            {skill.proficiency && (
                              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                {skill.proficiency}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing Skills */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                        Skills to Add ({analysis.missing_skills.length})
                      </h3>
                      <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                        {analysis.missing_skills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg"
                          >
                            <span className="text-sm text-neutral-200">{skill.skill_name}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                skill.priority === 'High'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : skill.priority === 'Medium'
                                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                  : 'bg-neutral-700 text-neutral-400'
                              }`}
                            >
                              {skill.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Detail Modal */}
      {viewingJob && (
        <JobDetailModal
          jobId={viewingJob.id}
          jobTitle={viewingJob.title}
          company={viewingJob.company}
          matchScore={viewingJob.match_score}
          open={!!viewingJob}
          onClose={() => setViewingJob(null)}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
