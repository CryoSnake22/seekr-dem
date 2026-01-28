import { createClient } from '@/lib/supabase/server'
import { jsonError, jsonSuccess } from '@/lib/api/responses'
import type { Database } from '@/types/database'
import type { NextRequest } from 'next/server'

type SkillMarketRow = Database['public']['Tables']['skills_market_data']['Row']

function dedupeSkills(rows: SkillMarketRow[]) {
  return rows.reduce<SkillMarketRow[]>((acc, row) => {
    const exists = acc.some((item) => item.skill_name.toLowerCase() === row.skill_name.toLowerCase())
    return exists ? acc : [...acc, row]
  }, [])
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData.user) {
    return jsonError('Unauthorized', 401, 'auth')
  }

  const query = request.nextUrl.searchParams.get('query')?.trim()
  if (!query) {
    return jsonSuccess([])
  }

  const { data, error } = await supabase
    .from('skills_market_data')
    .select('skill_name, frequency_count, frequency_percentage, priority_level')
    .ilike('skill_name', `%${query}%`)
    .order('frequency_percentage', { ascending: false })
    .limit(25)

  if (error) {
    return jsonError(error.message, 500, error.code)
  }

  const unique = dedupeSkills((data || []) as SkillMarketRow[])
  const suggestions = unique.map((row) => ({
    skill_name: row.skill_name,
    frequency_percentage: row.frequency_percentage,
    priority_level: row.priority_level,
  }))

  return jsonSuccess(suggestions)
}
