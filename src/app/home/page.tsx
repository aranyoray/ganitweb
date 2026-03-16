'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { QUIZ_MODES, QUIZ_CONFIG } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const {
    score,
    coins,
    progress,
    xpRequirements,
    levelFor,
    setUser,
  } = useProgress();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user?.username) {
      setUser(user.username);
    }
  }, [user?.username, setUser]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const xpPercent = xpRequirements > 0 ? Math.min((progress / xpRequirements) * 100, 100) : 0;

  return (
    <div className="relative flex min-h-full flex-col pb-16">
      {/* Header — Score & Coins */}
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <div className="flex items-center gap-1.5">
          <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
          <span className="text-lg font-bold text-white">{score.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-yellow-900">
            $
          </div>
          <span className="text-lg font-bold text-white">{coins.toLocaleString()}</span>
        </div>
      </header>

      {/* XP Progress Bar */}
      <div className="px-5 pt-2 pb-6">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="mt-1.5 text-center text-xs text-blue-200/70">
          {progress.toLocaleString()} / {xpRequirements.toLocaleString()} XP
        </p>
      </div>

      {/* Math Practice Section — vertical stack matching iOS VStack(spacing: 8) */}
      <section className="px-5">
        <h2 className="mb-4 text-xl font-bold text-white">Math Practice</h2>
        <div className="flex flex-col gap-2">
          {QUIZ_MODES.map((mode) => {
            const config = QUIZ_CONFIG[mode];
            const level = levelFor(mode);
            return (
              <Link
                key={mode}
                href={`/quiz?mode=${mode}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-blue-500/10 px-4 py-3.5 backdrop-blur transition hover:bg-blue-500/15 active:scale-[0.98]"
              >
                <span className="text-2xl font-bold text-blue-300">{config.symbol}</span>
                <span className="text-sm font-semibold text-white">{config.displayName}</span>
                <span className="ml-auto rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-300">
                  Lv {level}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Brain Training Section — green background matching iOS Color.green.opacity(0.1) */}
      <section className="px-5 pt-6">
        <Link
          href="/brain-training"
          className="flex items-center gap-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 backdrop-blur transition hover:bg-green-500/15 active:scale-[0.98]"
        >
          {/* SF Symbol style brain icon */}
          <svg className="h-7 w-7 text-green-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.5 2 6 4.5 6 7.5c0 1.5.5 2.8 1.3 3.8C6.5 12.3 6 13.8 6 15.5 6 18.5 8.5 21 12 21s6-2.5 6-5.5c0-1.7-.5-3.2-1.3-4.2.8-1 1.3-2.3 1.3-3.8C18 4.5 15.5 2 12 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v19M9 5c1 1 2 1.5 3 1.5S14 6 15 5M9 9c1-1 2-1.5 3-1.5s2 .5 3 1.5M9 13c1 1 2 1.5 3 1.5s2-.5 3-1.5M9 17c1-1 2-1.5 3-1.5s2 .5 3 1.5" />
          </svg>
          <div>
            <h3 className="text-base font-semibold text-white">Brain Training</h3>
            <p className="text-xs text-green-200/60">Cognitive exercises to sharpen your mind</p>
          </div>
          <svg className="ml-auto h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      {/* AR Experiences Section */}
      <section className="px-5 pt-6">
        <h2 className="mb-4 text-xl font-bold text-white">AR Experiences</h2>

        {/* Try AR Mode — highlighted card (iOS has this as a separate top item) */}
        <Link
          href="/interactive/ar-mode"
          className="mb-3 flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/10 px-4 py-4 transition hover:bg-purple-500/15 active:scale-[0.98]"
        >
          {/* arkit-style icon */}
          <svg className="h-6 w-6 text-purple-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <span className="text-sm font-semibold text-white">Try AR Mode</span>
          <svg className="ml-auto h-5 w-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* AR scene list — SF Symbol style text icons instead of emojis */}
        <div className="space-y-1.5">
          {[
            { href: '/interactive/addition', icon: '+', label: 'Addition — Merge & Split' },
            { href: '/interactive/fractions', icon: '÷', label: 'Fractions — Slice a Pizza' },
            { href: '/interactive/place-value', icon: '123', label: 'Place Value — Ones & Tens' },
            { href: '/interactive/playground', icon: '▪', label: 'Number Playground' },
            { href: '/interactive/grouping', icon: '▣', label: 'Grouping — Collect Objects' },
            { href: '/interactive/walk-around', icon: '🚶', label: 'Walk Around Numbers' },
          ].map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 transition hover:bg-purple-500/15 active:scale-[0.98]"
            >
              <span className="flex h-6 w-6 items-center justify-center text-base font-semibold text-purple-300">{icon}</span>
              <span className="text-sm font-medium text-white">{label}</span>
              <svg className="ml-auto h-4 w-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      <div className="h-6" />

      {/* Divider before bottom nav (matching iOS) */}
      <div className="h-px w-full bg-white/20" />

      {/* Bottom Navigation — proper outline icons matching iOS system icons */}
      <nav className="sticky bottom-0 flex items-center justify-around bg-[#0a1628]/95 px-2 py-3 backdrop-blur-lg mt-auto">
        <Link href="/profile" className="flex flex-col items-center gap-0.5">
          {/* person.circle outline */}
          <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="9" r="3" />
            <path d="M5.5 19.5c1.5-3 3.5-4.5 6.5-4.5s5 1.5 6.5 4.5" />
          </svg>
          <span className="text-[10px] text-white/50">Profile</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center gap-0.5">
          {/* cart outline */}
          <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
          <span className="text-[10px] text-white/50">Shop</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-0.5">
          {/* gearshape outline */}
          <svg className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] text-white/50">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
