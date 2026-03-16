'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserGroup } from '@/types';

type AuthView = 'landing' | 'login' | 'signup' | 'reset';

export default function AuthPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    authError,
    login,
    signUp,
    continueAsGuest,
    signInWithGoogle,
    resetPassword,
    clearError,
  } = useAuth();

  const [view, setView] = useState<AuthView>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userGroup, setUserGroup] = useState<UserGroup>('child');
  const [busy, setBusy] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/home');
    }
  }, [isAuthenticated, isLoading, router]);

  function switchView(next: AuthView) {
    clearError();
    setEmail('');
    setPassword('');
    setDisplayName('');
    setResetSent(false);
    setView(next);
  }

  async function handleLogin() {
    setBusy(true);
    const ok = await login(email, password);
    setBusy(false);
    if (ok) router.replace('/home');
  }

  async function handleSignUp() {
    setBusy(true);
    const ok = await signUp(displayName, email, password, userGroup);
    setBusy(false);
    if (ok) router.replace('/home');
  }

  async function handleGoogle() {
    setBusy(true);
    await signInWithGoogle();
    setBusy(false);
  }

  async function handleGuest() {
    setBusy(true);
    await continueAsGuest();
    setBusy(false);
    router.replace('/home');
  }

  async function handleReset() {
    setBusy(true);
    const ok = await resetPassword(email);
    setBusy(false);
    if (ok) setResetSent(true);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-white">Ganit</h1>
          <p className="mt-2 text-lg text-blue-200/80">Learn. Play. Grow.</p>
        </div>

        {/* Error message */}
        {authError && (
          <div className="mb-4 rounded-xl bg-red-500/20 px-4 py-3 text-center text-sm text-red-300">
            {authError}
          </div>
        )}

        {/* Loading spinner overlay */}
        {busy && (
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
            {view === 'login' && <span className="text-sm text-white/70">Signing in...</span>}
          </div>
        )}

        {/* -------- Landing -------- */}
        {view === 'landing' && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => switchView('login')}
              disabled={busy}
              className="w-full rounded-2xl bg-blue-500 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50"
            >
              Log In
            </button>
            <button
              onClick={() => switchView('signup')}
              disabled={busy}
              className="w-full rounded-2xl border-2 border-blue-400/40 bg-white/5 py-3.5 text-base font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/10 active:scale-[0.98] disabled:opacity-50"
            >
              Sign Up
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/20" />
              <span className="text-sm text-white/50">or</span>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogle}
              disabled={busy}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-base font-semibold text-gray-700 shadow-lg transition hover:bg-gray-100 active:scale-[0.98] disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09a7.12 7.12 0 0 1 0-4.17V7.07H2.18A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77-.01-.54z" fill="#FBBC05" />
                <path d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.16 6.16-4.16z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            <button
              onClick={handleGuest}
              disabled={busy}
              className="mt-2 text-center text-sm text-blue-300/70 transition hover:text-blue-200"
            >
              Continue as Guest
            </button>
          </div>
        )}

        {/* -------- Login -------- */}
        {view === 'login' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <button
              onClick={handleLogin}
              disabled={busy}
              className="w-full rounded-2xl bg-blue-500 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50"
            >
              Log In
            </button>
            <button
              onClick={() => switchView('reset')}
              className="text-sm text-blue-300/70 transition hover:text-blue-200"
            >
              Forgot Password?
            </button>
            <button
              onClick={() => switchView('landing')}
              className="text-sm text-white/50 transition hover:text-white/80"
            >
              Back
            </button>
          </div>
        )}

        {/* -------- Sign Up -------- */}
        {view === 'signup' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white text-center">Create Account</h2>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignUp()}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />

            {/* User Group Toggle */}
            <p className="text-sm text-white/60 text-center">I am a...</p>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-white/5 p-1">
              <button
                onClick={() => setUserGroup('child')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  userGroup === 'child'
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setUserGroup('elderly')}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  userGroup === 'elderly'
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                Adult/Senior
              </button>
            </div>

            <button
              onClick={handleSignUp}
              disabled={busy}
              className="w-full rounded-2xl bg-blue-500 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50"
            >
              Sign Up
            </button>
            <button
              onClick={() => switchView('landing')}
              className="text-sm text-white/50 transition hover:text-white/80"
            >
              Back
            </button>
          </div>
        )}

        {/* -------- Password Reset -------- */}
        {view === 'reset' && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white text-center">Reset Password</h2>
            {resetSent ? (
              <p className="rounded-xl bg-green-500/20 px-4 py-3 text-center text-sm text-green-300">
                Reset email sent! Check your inbox.
              </p>
            ) : (
              <>
                <p className="text-sm text-white/60 text-center">Enter your email and we&apos;ll send a reset link.</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
                <button
                  onClick={handleReset}
                  disabled={busy}
                  className="w-full rounded-2xl bg-blue-500 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50"
                >
                  Send Reset Link
                </button>
              </>
            )}
            <button
              onClick={() => switchView('login')}
              className="text-sm text-white/50 transition hover:text-white/80"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
