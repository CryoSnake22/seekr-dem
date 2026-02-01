'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import StepIndicator from './StepIndicator';
import ResumeUploadStep from './ResumeUploadStep';
import RoleSelectionStep from './RoleSelectionStep';
import GitHubConnectionStep from './GitHubConnectionStep';

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [completing, setCompleting] = useState(false);

  const totalSteps = 3;

  const handleResumeNext = () => {
    setCurrentStep(2);
  };

  const handleResumeSkip = () => {
    setCurrentStep(2);
  };

  const handleRoleNext = (roles: string[]) => {
    setSelectedRoles(roles);
    setCurrentStep(3);
  };

  const handleRoleBack = () => {
    setCurrentStep(1);
  };

  const handleGitHubBack = () => {
    setCurrentStep(2);
  };

  const handleComplete = async () => {
    setCompleting(true);

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Save selected roles to user_tracked_roles table
      if (selectedRoles.length > 0) {
        const rolesToInsert = selectedRoles.map((role) => ({
          user_id: userData.user.id,
          job_role: role,
        }));

        await supabase
          .from('user_tracked_roles')
          .insert(rolesToInsert);
      }

      // Mark onboarding as completed in users table
      // First check if onboarding_completed column exists
      await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', userData.user.id);

      // Redirect to dashboard
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Even if there's an error, redirect to dashboard (graceful degradation)
      router.push('/dashboard');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Seekr</h1>
          <p className="text-neutral-400 text-sm">Let's get you set up</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {/* Step Content */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
          {currentStep === 1 && (
            <ResumeUploadStep onNext={handleResumeNext} onSkip={handleResumeSkip} />
          )}
          {currentStep === 2 && (
            <RoleSelectionStep onNext={handleRoleNext} onBack={handleRoleBack} />
          )}
          {currentStep === 3 && (
            <GitHubConnectionStep onComplete={handleComplete} onBack={handleGitHubBack} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-neutral-500">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* Completing overlay */}
      {completing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-white font-medium">Setting up your dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}
