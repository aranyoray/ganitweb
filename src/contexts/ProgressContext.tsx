'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ProgressData, QuizMode, ProgressColor } from '@/types';

interface ProgressContextType extends ProgressData {
  setUser: (username: string) => void;
  levelFor: (mode: QuizMode) => number;
  incrementLevel: (mode: QuizMode) => void;
  advanceLevel: () => void;
  addScore: (points: number) => void;
  addXP: (xp: number) => void;
  addCoins: (amount: number) => void;
  removeScore: (points: number) => void;
  removeXP: (xp: number) => void;
  username: string;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

const COLOR_ORDER: ProgressColor[] = ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'black'];
const COLOR_XP_BONUS = [0, 0, 50, 100, 200, 300, 500];

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState('');
  const [score, setScore] = useState(0);
  const [additionLevel, setAdditionLevel] = useState(0);
  const [subtractionLevel, setSubtractionLevel] = useState(0);
  const [multiplicationLevel, setMultiplicationLevel] = useState(0);
  const [divisionLevel, setDivisionLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [xpRequirements, setXpRequirements] = useState(1000);
  const [coins, setCoins] = useState(50);
  const [progressColor, setProgressColor] = useState<ProgressColor>('white');
  const [powerUpPointLevel] = useState(1);

  const setUser = useCallback((name: string) => {
    setUsername(name);
    // Load from localStorage
    const stored = localStorage.getItem(`ganit_${name}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setScore(data.score ?? 0);
        setAdditionLevel(data.additionLevel ?? 0);
        setSubtractionLevel(data.subtractionLevel ?? 0);
        setMultiplicationLevel(data.multiplicationLevel ?? 0);
        setDivisionLevel(data.divisionLevel ?? 0);
        setProgress(data.progress ?? 0);
        setXpRequirements(data.xpRequirements ?? 1000);
        setCoins(data.coins ?? 50);
        setProgressColor(data.progressColor ?? 'white');
      } catch { /* ignore corrupt data */ }
    }
  }, []);

  const save = useCallback((data: Partial<ProgressData>) => {
    if (!username) return;
    const stored = localStorage.getItem(`ganit_${username}`);
    const current = stored ? JSON.parse(stored) : {};
    localStorage.setItem(`ganit_${username}`, JSON.stringify({ ...current, ...data }));
  }, [username]);

  const levelFor = (mode: QuizMode): number => {
    switch (mode) {
      case 'addition': return additionLevel;
      case 'subtraction': return subtractionLevel;
      case 'multiplication': return multiplicationLevel;
      case 'division': return divisionLevel;
    }
  };

  const incrementLevel = (mode: QuizMode) => {
    switch (mode) {
      case 'addition': setAdditionLevel(l => { save({ additionLevel: l + 1 }); return l + 1; }); break;
      case 'subtraction': setSubtractionLevel(l => { save({ subtractionLevel: l + 1 }); return l + 1; }); break;
      case 'multiplication': setMultiplicationLevel(l => { save({ multiplicationLevel: l + 1 }); return l + 1; }); break;
      case 'division': setDivisionLevel(l => { save({ divisionLevel: l + 1 }); return l + 1; }); break;
    }
  };

  const advanceLevel = () => {
    setProgress(p => {
      const newP = p - xpRequirements;
      const idx = COLOR_ORDER.indexOf(progressColor);
      const nextIdx = Math.min(idx + 1, COLOR_ORDER.length - 1);
      const nextColor = COLOR_ORDER[nextIdx];
      const newXP = xpRequirements + 500 + COLOR_XP_BONUS[nextIdx];
      setXpRequirements(newXP);
      setProgressColor(nextColor);
      save({ progress: newP, xpRequirements: newXP, progressColor: nextColor });
      return newP;
    });
  };

  return (
    <ProgressContext.Provider value={{
      score, additionLevel, subtractionLevel, multiplicationLevel, divisionLevel,
      progress, xpRequirements, coins, progressColor, powerUpPointLevel,
      username, setUser, levelFor, incrementLevel, advanceLevel,
      addScore: (p) => setScore(s => { save({ score: s + p }); return s + p; }),
      addXP: (xp) => setProgress(p => { save({ progress: p + xp }); return p + xp; }),
      addCoins: (a) => setCoins(c => { save({ coins: c + a }); return c + a; }),
      removeScore: (p) => setScore(s => { const n = Math.max(0, s - p); save({ score: n }); return n; }),
      removeXP: (xp) => setProgress(p => { const n = Math.max(0, p - xp); save({ progress: n }); return n; }),
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be inside ProgressProvider');
  return ctx;
}
