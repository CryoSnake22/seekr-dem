'use client'

import { useEffect, useState } from 'react'

interface GitHubConnection {
  connected: boolean
  connectedAt?: string
  lastUpdated?: string
}

interface SyncResult {
  message: string
  synced: number
  skillsDetected: number
  newSkillsAdded: number
  repositories: Array<{
    name: string
    url: string
    languages: Record<string, number>
  }>
}

export default function IntegrationsPage() {
  const [githubConnection, setGithubConnection] = useState<GitHubConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)

  useEffect(() => {
    checkGitHubConnection()
  }, [])

  async function checkGitHubConnection() {
    try {
      const response = await fetch('/api/github/connect')
      if (response.ok) {
        const data = await response.json()
        setGithubConnection(data)
      }
    } catch (err) {
      console.error('Error checking GitHub connection:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleGitHubSync() {
    if (!githubConnection?.connected) {
      setError('Please connect your GitHub account first')
      return
    }

    setSyncing(true)
    setError('')
    setSuccess('')
    setSyncResult(null)

    try {
      const response = await fetch('/api/github/sync', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync repositories')
      }

      setSyncResult(data)
      setSuccess(`Successfully synced ${data.synced} repositories!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync GitHub repositories')
    } finally {
      setSyncing(false)
    }
  }

  async function handleDisconnectGitHub() {
    if (!confirm('Are you sure you want to disconnect your GitHub account?')) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/github/connect', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect GitHub')
      }

      setGithubConnection({ connected: false })
      setSuccess('GitHub account disconnected successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect GitHub')
    } finally {
      setLoading(false)
    }
  }

  function handleConnectGitHub() {
    // For now, show instructions. In production, this would initiate OAuth flow
    setError('GitHub OAuth integration coming soon. For now, you can manually add your access token via API.')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-neutral-400">Connect external services to enhance your profile</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* GitHub Integration */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-purple-500/10 border border-purple-500/20 p-3">
              <svg className="w-8 h-8 text-purple-300" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">GitHub</h2>
              <p className="text-sm text-neutral-400 mt-1">
                Automatically sync your repositories and detect skills from your code
              </p>
              {loading ? (
                <p className="text-xs text-neutral-500 mt-2">Checking connection...</p>
              ) : githubConnection?.connected ? (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-xs text-green-300">Connected</p>
                  </div>
                  {githubConnection.connectedAt && (
                    <p className="text-xs text-neutral-500">
                      Connected on {new Date(githubConnection.connectedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neutral-500"></div>
                    <p className="text-xs text-neutral-400">Not connected</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {githubConnection?.connected ? (
              <>
                <button
                  onClick={handleGitHubSync}
                  disabled={syncing || loading}
                  className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
                <button
                  onClick={handleDisconnectGitHub}
                  disabled={loading}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectGitHub}
                disabled={loading}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Connect GitHub
              </button>
            )}
          </div>
        </div>

        {syncResult && (
          <div className="rounded-lg border border-white/10 bg-black/40 p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Sync Results</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{syncResult.synced}</p>
                  <p className="text-xs text-neutral-400 mt-1">Repositories</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-300">{syncResult.skillsDetected}</p>
                  <p className="text-xs text-neutral-400 mt-1">Skills Detected</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-300">{syncResult.newSkillsAdded}</p>
                  <p className="text-xs text-neutral-400 mt-1">New Skills Added</p>
                </div>
              </div>
            </div>

            {syncResult.repositories.length > 0 && (
              <div>
                <p className="text-xs text-neutral-400 mb-2">Synced Repositories:</p>
                <div className="space-y-2">
                  {syncResult.repositories.slice(0, 5).map((repo) => (
                    <div key={repo.url} className="flex items-center justify-between text-xs">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-300 hover:text-purple-200"
                      >
                        {repo.name}
                      </a>
                      <span className="text-neutral-500">
                        {Object.keys(repo.languages).slice(0, 3).join(', ')}
                      </span>
                    </div>
                  ))}
                  {syncResult.repositories.length > 5 && (
                    <p className="text-xs text-neutral-500">
                      ...and {syncResult.repositories.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg border border-white/5 bg-white/5 p-4">
          <h3 className="text-sm font-semibold text-white mb-2">What gets synced?</h3>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Repository names, descriptions, and links</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Programming languages and their usage percentages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Automatically detected frameworks and tools</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Estimated skill proficiency levels based on usage</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Future Integrations Placeholder */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Coming Soon</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/5 bg-white/5 p-4 opacity-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-blue-500/20"></div>
              <div>
                <p className="text-sm font-medium text-white">LinkedIn</p>
                <p className="text-xs text-neutral-400">Import work experience and education</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-white/5 bg-white/5 p-4 opacity-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-orange-500/20"></div>
              <div>
                <p className="text-sm font-medium text-white">Stack Overflow</p>
                <p className="text-xs text-neutral-400">Showcase reputation and answers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
