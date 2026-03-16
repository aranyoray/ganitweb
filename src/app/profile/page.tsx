'use client';

import { useProgress } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/AuthContext';
import NavHeader from '@/components/NavHeader';

const OPERATIONS: { symbol: string; key: 'additionLevel' | 'subtractionLevel' | 'multiplicationLevel' | 'divisionLevel' }[] = [
  { symbol: '+', key: 'additionLevel' },
  { symbol: '-', key: 'subtractionLevel' },
  { symbol: '\u00d7', key: 'multiplicationLevel' },
  { symbol: '\u00f7', key: 'divisionLevel' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const {
    score, coins, progress, xpRequirements, progressColor,
    additionLevel, subtractionLevel, multiplicationLevel, divisionLevel,
  } = useProgress();

  const levels = { additionLevel, subtractionLevel, multiplicationLevel, divisionLevel };
  const xpPercent = Math.min(100, (progress / xpRequirements) * 100);

  return (
    <div className="min-h-screen text-white">
      <NavHeader title="Profile" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Username */}
        <h2 className="text-xl font-bold text-center">{user?.username ?? 'Guest'}</h2>

        {/* XP Progress */}
        <div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
          <p className="text-xs text-white/50 mt-1.5 text-center">
            {progress} out of {xpRequirements} XP
          </p>
        </div>

        {/* Points & Coins */}
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold">{score}</p>
            <p className="text-xs text-white/50 mt-1">Points</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{coins}</p>
            <p className="text-xs text-white/50 mt-1">Coins</p>
          </div>
        </div>

        {/* Operation Levels */}
        <div className="flex items-center justify-center gap-6">
          {OPERATIONS.map((op) => (
            <div key={op.key} className="text-center">
              <p className="text-2xl font-bold">{op.symbol}</p>
              <p className="text-xs text-white/50 mt-1">Lv {levels[op.key]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
