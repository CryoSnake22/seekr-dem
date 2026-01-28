'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ResumeParseResponse } from '@/lib/types/backend'

export default function ResumePage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)
  const [parseResult, setParseResult] = useState<ResumeParseResponse | null>(null)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const parsed = parseResult?.parsed_data
  const experience = parsed?.experience ?? []
  const education = parsed?.education ?? []
  const skills = parsed?.skills ?? []
  const projects = parsed?.projects ?? []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setParseResult(null)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setParsing(true)
    setError(null)

    try {
      const response = await fetch('/api/backend/resume/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error.message)
      } else if (result.data) {
        const data: ResumeParseResponse = result.data
        setParseResult(data)
        if (data.status !== 'completed') {
          setError(data.error || 'Resume parsing did not complete')
        }
      }
    } catch (err) {
      setError('Failed to parse resume')
    } finally {
      setParsing(false)
    }
  }

  const handleApply = async () => {
    if (!parseResult?.parse_id) return

    setApplying(true)
    setError(null)

    try {
      const response = await fetch('/api/backend/resume/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parse_id: parseResult.parse_id,
          confirm: true,
          options: {
            merge_education: true,
            merge_experience: true,
            merge_skills: true,
            merge_projects: true
          }
        })
      })

      const result = await response.json()

      if (result.error) {
        setError(result.error.message)
      } else if (result.data?.applied) {
        // Redirect to profile
        router.push('/profile')
      }
    } catch (err) {
      setError('Failed to apply resume data')
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Profile Intake</p>
        <h1 className="text-3xl font-semibold">Resume Upload</h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Upload your resume to automatically populate your profile and highlight gaps against the market.
        </p>
      </div>

      {/* Upload Section */}
      {!parseResult && (
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <div className="mb-5">
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Select Resume File
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-neutral-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border
                file:border-white/10
                file:text-sm file:font-semibold
                file:bg-white/5 file:text-white
                hover:file:bg-white/10"
            />
            <p className="text-xs text-neutral-500 mt-2">
              Supported formats: PDF, DOC, DOCX
            </p>
          </div>

          {file && (
            <div className="mb-5 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Selected</p>
              <p className="text-sm font-medium text-white mt-1">{file.name}</p>
              <p className="text-xs text-neutral-400">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || parsing}
            className="w-full px-4 py-2.5 bg-primary text-black rounded-lg font-semibold hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {parsing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                Parsing Resume...
              </span>
            ) : (
              'Parse Resume'
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 text-red-300 rounded-xl border border-red-500/20">
          {error}
        </div>
      )}

      {/* Parsed Data Preview */}
      {parseResult && (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Parsed Output</p>
              <h2 className="text-xl font-semibold mt-1">Resume Snapshot</h2>
            </div>
            <button
              onClick={() => {
                setParseResult(null)
                setFile(null)
              }}
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Upload different file
            </button>
          </div>

          {/* Debug JSON */}
          <details className="rounded-xl border border-white/10 bg-white/5 p-4">
            <summary className="cursor-pointer text-sm text-neutral-300">
              View raw parsed JSON
            </summary>
            <pre className="mt-3 max-h-[360px] overflow-auto text-xs text-neutral-200">
              {JSON.stringify(parseResult, null, 2)}
            </pre>
          </details>

          {/* Personal Info */}
          {/* Note: backend resume parsing currently returns only education/experience/skills/projects */}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-200">
                Experience ({experience.length})
              </h3>
              <div className="space-y-2">
                {experience.slice(0, 3).map((exp, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm">
                    <p className="font-medium text-white">{exp.role}</p>
                    <p className="text-neutral-400">{exp.company}</p>
                  </div>
                ))}
                {experience.length > 3 && (
                  <p className="text-xs text-neutral-500">
                    +{experience.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-200">
                Education ({education.length})
              </h3>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm">
                    <p className="font-medium text-white">{edu.degree || 'Degree'}</p>
                    <p className="text-neutral-400">{edu.university}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-200">
                Skills ({skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 10).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs border border-primary/20"
                  >
                    {skill.skill_name}
                  </span>
                ))}
                {skills.length > 10 && (
                  <span className="px-2.5 py-1 bg-white/5 text-neutral-400 rounded-full text-xs border border-white/10">
                    +{skills.length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-200">
                Projects ({projects.length})
              </h3>
              <div className="space-y-2">
                {projects.slice(0, 3).map((project, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm">
                    <p className="font-medium text-white">{project.title}</p>
                    {project.description && (
                      <p className="text-neutral-400 text-xs line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
                {projects.length > 3 && (
                  <p className="text-xs text-neutral-500">
                    +{projects.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Apply Button */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleApply}
              disabled={applying}
              className="w-full px-4 py-3 bg-primary text-black rounded-lg hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {applying ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Applying to Profile...
                </span>
              ) : (
                'Apply to Profile'
              )}
            </button>
            <p className="text-xs text-neutral-500 text-center mt-2">
              This will add the parsed data to your profile without overwriting existing entries
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
