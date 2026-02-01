import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!userData.user) {
    redirect('/login');
  }

  // Check if user has already completed onboarding
  const { data: userProfile } = await supabase
    .from('users')
    .select('onboarding_completed')
    .eq('id', userData.user.id)
    .single();

  // If onboarding is already completed, redirect to dashboard
  if (userProfile?.onboarding_completed) {
    redirect('/dashboard');
  }

  return <OnboardingWizard />;
}
