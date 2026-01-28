/**
 * GitHub Repository Analyzer
 * Analyzes GitHub repositories to detect skills and proficiency levels
 */

interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  languages_url: string
  stargazers_count: number
  pushed_at: string
}

interface LanguageStats {
  [language: string]: number
}

export interface DetectedSkill {
  skill_name: string
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  usage_context: string
  confidence: number
}

// Map GitHub languages to skill names
const LANGUAGE_TO_SKILL: Record<string, string> = {
  TypeScript: 'TypeScript',
  JavaScript: 'JavaScript',
  Python: 'Python',
  Java: 'Java',
  'C++': 'C++',
  'C#': 'C#',
  Go: 'Go',
  Rust: 'Rust',
  Ruby: 'Ruby',
  PHP: 'PHP',
  Swift: 'Swift',
  Kotlin: 'Kotlin',
  Dart: 'Dart',
  HTML: 'HTML',
  CSS: 'CSS',
  SCSS: 'CSS',
  Sass: 'CSS',
}

// Detect frameworks and tools from package files
const FRAMEWORK_PATTERNS: Record<string, RegExp> = {
  React: /(react|reactjs|react-dom)/i,
  'Next.js': /(next|nextjs)/i,
  Vue: /(vue|vuejs)/i,
  Angular: /(angular|@angular)/i,
  Svelte: /(svelte)/i,
  'Node.js': /(express|fastify|koa|nest)/i,
  Django: /(django)/i,
  Flask: /(flask)/i,
  'Spring Boot': /(spring-boot|springframework)/i,
  Docker: /(docker|dockerfile)/i,
  Kubernetes: /(kubernetes|k8s)/i,
  PostgreSQL: /(postgres|postgresql)/i,
  MongoDB: /(mongodb|mongoose)/i,
  Redis: /(redis)/i,
  GraphQL: /(graphql|apollo)/i,
  REST: /(rest|restful|api)/i,
  AWS: /(aws-sdk|amazonaws)/i,
  Firebase: /(firebase)/i,
  Terraform: /(terraform)/i,
  Jenkins: /(jenkins)/i,
  'GitHub Actions': /(github.*actions|\.github\/workflows)/i,
}

/**
 * Calculate proficiency level based on repository metrics
 */
function calculateProficiency(
  languagePercentage: number,
  repoCount: number,
  totalCommits: number,
  stars: number
): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
  let score = 0

  // Language usage percentage (0-25 points)
  score += (languagePercentage / 100) * 25

  // Repository count (0-25 points)
  if (repoCount >= 5) score += 25
  else if (repoCount >= 3) score += 15
  else if (repoCount >= 1) score += 10

  // Total commits (0-25 points)
  if (totalCommits >= 100) score += 25
  else if (totalCommits >= 50) score += 15
  else if (totalCommits >= 20) score += 10
  else if (totalCommits >= 5) score += 5

  // Stars (0-25 points)
  if (stars >= 50) score += 25
  else if (stars >= 20) score += 15
  else if (stars >= 5) score += 10
  else if (stars >= 1) score += 5

  if (score >= 75) return 'Expert'
  if (score >= 60) return 'Advanced'
  if (score >= 35) return 'Intermediate'
  return 'Beginner'
}

/**
 * Analyze repository languages and detect skills
 */
export async function analyzeRepositoryLanguages(
  languages: LanguageStats,
  repoCount: number = 1,
  totalCommits: number = 10,
  stars: number = 0
): Promise<DetectedSkill[]> {
  const skills: DetectedSkill[] = []
  const total = Object.values(languages).reduce((sum, val) => sum + val, 0)

  for (const [language, bytes] of Object.entries(languages)) {
    const skillName = LANGUAGE_TO_SKILL[language]
    if (!skillName) continue

    const percentage = (bytes / total) * 100
    if (percentage < 5) continue // Ignore languages used less than 5%

    const proficiency = calculateProficiency(
      percentage,
      repoCount,
      totalCommits,
      stars
    )

    skills.push({
      skill_name: skillName,
      proficiency_level: proficiency,
      usage_context: `Used in ${repoCount} ${repoCount === 1 ? 'repository' : 'repositories'} (${percentage.toFixed(0)}% of code)`,
      confidence: Math.min(percentage / 50, 1), // Higher percentage = higher confidence
    })
  }

  return skills
}

/**
 * Detect frameworks and tools from repository content
 */
export function detectFrameworks(
  readmeContent: string,
  packageJson: string | null,
  requirements: string | null,
  dockerfiles: string[]
): DetectedSkill[] {
  const skills: DetectedSkill[] = []
  const content = [readmeContent, packageJson, requirements, ...dockerfiles]
    .filter(Boolean)
    .join('\n')

  for (const [framework, pattern] of Object.entries(FRAMEWORK_PATTERNS)) {
    if (pattern.test(content)) {
      // Estimate proficiency based on how thoroughly the framework appears
      const matches = content.match(pattern)
      const proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' =
        matches && matches.length > 10
          ? 'Advanced'
          : matches && matches.length > 5
          ? 'Intermediate'
          : 'Beginner'

      skills.push({
        skill_name: framework,
        proficiency_level: proficiency,
        usage_context: 'Detected from repository files',
        confidence: 0.7, // Medium confidence for pattern detection
      })
    }
  }

  return skills
}

/**
 * Merge duplicate skills and take the highest proficiency
 */
export function mergeSkills(skills: DetectedSkill[]): DetectedSkill[] {
  const skillMap = new Map<string, DetectedSkill>()
  const proficiencyOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

  for (const skill of skills) {
    const existing = skillMap.get(skill.skill_name)
    if (!existing) {
      skillMap.set(skill.skill_name, skill)
    } else {
      // Take the higher proficiency
      const existingLevel = proficiencyOrder.indexOf(existing.proficiency_level)
      const newLevel = proficiencyOrder.indexOf(skill.proficiency_level)
      if (newLevel > existingLevel) {
        skillMap.set(skill.skill_name, skill)
      }
    }
  }

  return Array.from(skillMap.values())
}

/**
 * Fetch repository languages from GitHub API
 */
export async function fetchRepositoryLanguages(
  languagesUrl: string,
  accessToken: string
): Promise<LanguageStats> {
  const response = await fetch(languagesUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    console.error('Failed to fetch languages:', response.statusText)
    return {}
  }

  return await response.json()
}

/**
 * Fetch user's repositories from GitHub
 */
export async function fetchUserRepositories(
  accessToken: string,
  username?: string
): Promise<GitHubRepo[]> {
  const url = username
    ? `https://api.github.com/users/${username}/repos`
    : 'https://api.github.com/user/repos'

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.statusText}`)
  }

  return await response.json()
}
