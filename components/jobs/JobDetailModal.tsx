'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, CheckCircle2, AlertCircle, X } from '@/components/ui/Icon';

interface JobDetailModalProps {
  jobId: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  open: boolean;
  onClose: () => void;
}

interface JobInsights {
  keywords: string[];
  resume_tips: string[];
  application_advice: string;
  specific_gaps: string[];
  strengths: string[];
}

interface JobDetails {
  description: string;
  location: string | null;
  job_role: string;
  url: string | null;
}

export default function JobDetailModal({
  jobId,
  jobTitle,
  company,
  matchScore,
  open,
  onClose,
}: JobDetailModalProps) {
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [insights, setInsights] = useState<JobInsights | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && jobId) {
      fetchJobDetails();
      // Reset insights when opening a new job
      setInsights(null);
    }
  }, [open, jobId]);

  async function fetchJobDetails() {
    setLoadingDetails(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/jobs/saved/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        // Fallback: fetch from Supabase directly
        const { data, error: supabaseError } = await supabase
          .from('user_target_jobs')
          .select('description, location, job_role, external_url')
          .eq('id', jobId)
          .single();

        if (supabaseError) throw supabaseError;

        setJobDetails({
          description: data.description || 'No description available',
          location: data.location,
          job_role: data.job_role,
          url: data.external_url,
        });
      } else {
        const data = await response.json();
        setJobDetails({
          description: data.description || 'No description available',
          location: data.location,
          job_role: data.job_role,
          url: data.external_url || data.url,
        });
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details');
    } finally {
      setLoadingDetails(false);
    }
  }

  async function fetchInsights() {
    setLoadingInsights(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/jobs/saved/${jobId}/insights`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch insights');
      }

      const data = await response.json();
      setInsights(data);
    } catch (err) {
      console.error('Error fetching job insights:', err);
      setError(err instanceof Error ? err.message : 'Failed to load insights');
    } finally {
      setLoadingInsights(false);
    }
  }

  function getMatchScoreColor(score: number): string {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{jobTitle}</DialogTitle>
          <DialogDescription className="text-base">
            {company} • Match Score: <span className={getMatchScoreColor(matchScore)}>{Math.round(matchScore)}%</span>
          </DialogDescription>
        </DialogHeader>

        {loadingDetails && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="ml-3 text-neutral-400">Loading job details...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 mb-4">
            <AlertCircle className="w-5 h-5 inline mr-2" />
            {error}
          </div>
        )}

        {jobDetails && !loadingDetails && (
          <div className="space-y-6">
            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Description</h3>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg max-h-96 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-neutral-300 whitespace-pre-wrap">
                  {jobDetails.description}
                </p>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex items-center gap-4 text-sm text-neutral-400">
              {jobDetails.location && (
                <span>📍 {jobDetails.location}</span>
              )}
              {jobDetails.job_role && (
                <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded">
                  {jobDetails.job_role}
                </span>
              )}
              {jobDetails.url && (
                <a
                  href={jobDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Original Posting →
                </a>
              )}
            </div>

            {/* Get Insights Button */}
            {!insights && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={fetchInsights}
                  disabled={loadingInsights}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  {loadingInsights ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5" />
                      Get AI Insights
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {insights && (
          <div className="space-y-6 pt-6 border-t border-white/10">
            <h3 className="text-xl font-bold">AI-Powered Insights</h3>

            {/* Match Score Visual */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Match Analysis</h3>
                <div className={`text-3xl font-bold ${getMatchScoreColor(matchScore)}`}>
                  {Math.round(matchScore)}%
                </div>
              </div>
              <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${matchScore}%` }}
                  className={`h-full rounded-full transition-all duration-1000 ${
                    matchScore >= 90
                      ? 'bg-emerald-500'
                      : matchScore >= 75
                      ? 'bg-blue-500'
                      : matchScore >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            {/* Key Keywords */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Key Keywords for Resume</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Your Strengths */}
            {insights.strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold">Your Strengths for This Role</h3>
                </div>
                <div className="space-y-2">
                  {insights.strengths.map((strength, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-neutral-300">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specific Gaps */}
            {insights.specific_gaps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold">Areas to Address</h3>
                </div>
                <div className="space-y-2">
                  {insights.specific_gaps.map((gap, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-neutral-300">{gap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Tips */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Resume Optimization Tips</h3>
              </div>
              <div className="space-y-2">
                {insights.resume_tips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-3 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <p className="text-sm text-neutral-300">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Advice */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Application Strategy</h3>
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
                <p className="text-sm text-neutral-300">{insights.application_advice}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
