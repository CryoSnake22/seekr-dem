import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RecommendationCard from '@/components/ai/RecommendationCard';
import ProjectEnhancements from '@/components/ai/ProjectEnhancements';

export const metadata = {
  title: 'AI Recommendations | Seekr',
  description: 'Get personalized recommendations to improve your profile and skills',
};

export default async function AIRecommendationsPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  const userId = user.id;

  // Get access token for AI chat
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token || '';

  // Fetch user's projects for enhancement recommendations
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Fetch user's skills to determine gaps
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_name')
    .eq('user_id', userId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Recommendations</h1>
        <p className="text-neutral-400">
          Personalized guidance to improve your profile and close skill gaps
        </p>
      </div>

      {/* Main Recommendation Card */}
      <RecommendationCard
        userId={userId}
        accessToken={accessToken}
        userSkills={userSkills || []}
      />

      {/* Project Enhancements Section */}
      {projects && projects.length > 0 && (
        <ProjectEnhancements
          projects={projects}
          accessToken={accessToken}
        />
      )}
    </div>
  );
}
