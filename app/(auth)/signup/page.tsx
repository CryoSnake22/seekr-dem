'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Compass, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user.identities?.length === 0) {
          setError('An account with this email already exists')
          setLoading(false)
          return
        }

        setSuccess(true)
        setLoading(false)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="p-2 bg-white/5 rounded-md border border-white/10">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Seekr</span>
          </Link>

          <div className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Check your email</h2>
            <p className="text-neutral-400 mb-6 text-center">
              We&apos;ve sent a confirmation link to <strong className="text-white">{email}</strong>
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-white mb-2">Next steps:</h3>
              <ol className="text-sm text-neutral-400 space-y-2 list-decimal list-inside">
                <li>Check your email inbox</li>
                <li>Click the confirmation link</li>
                <li>Return here to sign in</li>
              </ol>
            </div>

            <div className="text-center text-sm text-neutral-500 mb-4">
              Didn&apos;t receive the email? Check your spam folder.
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-400 text-center">
                  <strong>Dev Mode:</strong> Email confirmation may be disabled. You can likely sign in immediately.
                </p>
              </div>
            )}

            <Link
              href="/login"
              className="block w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-center"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-white/5 rounded-md border border-white/10">
            <Compass className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">Seekr</span>
        </Link>

        {/* Signup Card */}
        <div className="glass-card rounded-2xl p-8 border border-white/10">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-neutral-400">Start tracking your skills and career progress</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-neutral-500">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Sign in
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500">
          By continuing, you agree to Seekr&apos;s{' '}
          <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="#" className="text-neutral-400 hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
