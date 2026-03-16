'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import NavHeader from '@/components/NavHeader';
import type { QuizMode } from '@/types';

const SKILL_CONFIG: { mode: QuizMode; label: string; symbol: string }[] = [
  { mode: 'addition', label: 'Addition', symbol: '+' },
  { mode: 'subtraction', label: 'Subtraction', symbol: '-' },
  { mode: 'multiplication', label: 'Multiplication', symbol: '\u00d7' },
  { mode: 'division', label: 'Division', symbol: '\u00f7' },
];

export default function ParentDashboardPage() {
  const { user } = useAuth();
  const { score, coins, levelFor } = useProgress();
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ganit_session_count');
      if (stored) setSessionCount(parseInt(stored, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 text-white">
      <NavHeader title="Parent Dashboard" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-amber-300">{score}</p>
            <p className="text-xs text-indigo-400 mt-1">Points</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-yellow-400">{coins}</p>
            <p className="text-xs text-indigo-400 mt-1">Coins</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-green-400">{sessionCount}</p>
            <p className="text-xs text-indigo-400 mt-1">Sessions</p>
          </div>
        </div>

        {/* Skill levels */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="text-sm text-indigo-300 font-semibold mb-4 uppercase tracking-wider">Skill Levels</h2>
          <div className="grid grid-cols-4 gap-3">
            {SKILL_CONFIG.map(({ mode, symbol }) => {
              const level = levelFor(mode);
              return (
                <div key={mode} className="text-center">
                  <span className="text-2xl font-bold text-white">{symbol}</span>
                  <p className="text-sm text-indigo-400 mt-1">Lv {level}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
