'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import type { MCQQuestion, QuizMode, QuizState } from '@/types';
import { QUIZ_CONFIG } from '@/types';
import { generateAIQuestion, generateFallback, hasAPI } from '@/lib/questions';
import { useProgress } from '@/contexts/ProgressContext';
import NavHeader from '@/components/NavHeader';

const TOTAL_QUESTIONS = 10;

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = (searchParams.get('mode') ?? 'addition') as QuizMode;
  const config = QUIZ_CONFIG[mode] ?? QUIZ_CONFIG.addition;

  const {
    addScore, addXP, addCoins, removeScore, removeXP,
    incrementLevel, advanceLevel, levelFor, progress, xpRequirements, powerUpPointLevel,
  } = useProgress();

  const [state, setState] = useState<QuizState>({ type: 'idle' });
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalXPEarned, setTotalXPEarned] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const startedRef = useRef(false);

  // Load next question
  const loadQuestion = useCallback(async () => {
    setState({ type: 'loading' });
    const accuracy = questionsAnswered > 0 ? correctCount / questionsAnswered : 0.5;
    const grade = Math.max(1, levelFor(mode));

    let question: MCQQuestion | null = null;
    if (hasAPI()) {
      question = await generateAIQuestion(grade, mode, accuracy);
    }
    if (!question) {
      question = generateFallback(mode);
    }
    setState({ type: 'presenting', question });
  }, [questionsAnswered, correctCount, mode, levelFor]);

  // Start session on mount
  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      loadQuestion();
    }
  }, [loadQuestion]);

  // Handle option selection
  const handleSelect = (index: number) => {
    if (state.type !== 'presenting') return;
    const question = state.question;
    const isCorrect = index === question.correct_index;
    setSelectedIndex(index);

    if (isCorrect) {
      const points = config.pointMultiplier * powerUpPointLevel;
      const xp = config.xpReward;
      setCorrectCount(c => c + 1);
      setCurrentStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
      setTotalXPEarned(t => t + xp);
      addScore(points);
      addXP(xp);
      incrementLevel(mode);
      // Check if we should advance color level
      if (progress + xp >= xpRequirements) {
        advanceLevel();
      }
    } else {
      setCurrentStreak(0);
      removeScore(1);
      removeXP(10);
    }

    setQuestionsAnswered(q => q + 1);
    setState({ type: 'answered', correct: isCorrect, question });
  };

  // Handle next question
  const handleNext = () => {
    setSelectedIndex(null);
    setShowHint(false);
    if (questionsAnswered >= TOTAL_QUESTIONS) {
      setState({ type: 'sessionComplete' });
    } else {
      loadQuestion();
    }
  };

  // Session complete calculations
  const accuracy = questionsAnswered > 0 ? correctCount / questionsAnswered : 0;
  const accuracyPercent = Math.round(accuracy * 100);
  const coinsEarned = (() => {
    let base = accuracy >= 0.9 ? 25 : accuracy >= 0.7 ? 15 : accuracy >= 0.5 ? 8 : 3;
    const streakBonus = bestStreak >= 5 ? 10 : bestStreak >= 3 ? 5 : 0;
    return base + streakBonus;
  })();

  // Play again
  const handlePlayAgain = () => {
    setQuestionsAnswered(0);
    setCorrectCount(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setTotalXPEarned(0);
    setSelectedIndex(null);
    startedRef.current = false;
    setState({ type: 'idle' });
    setTimeout(() => {
      startedRef.current = true;
      loadQuestion();
    }, 0);
  };

  // Done — award coins and go home
  const handleDone = () => {
    addCoins(coinsEarned);
    router.push('/home');
  };

  // Progress bar display number
  const displayQ = state.type === 'answered' || state.type === 'sessionComplete'
    ? questionsAnswered
    : Math.min(questionsAnswered + 1, TOTAL_QUESTIONS);
  const progressPercent = (displayQ / TOTAL_QUESTIONS) * 100;

  // ── Session Complete Screen ──
  if (state.type === 'sessionComplete') {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4 py-4">
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-3xl p-6 max-w-md w-full text-center space-y-4 overflow-y-auto">
          {/* Icon */}
          <div className="text-6xl">
            {accuracyPercent >= 70 ? '⭐' : '✅'}
          </div>

          <h1 className="text-2xl font-bold text-white">
            {accuracyPercent >= 90 ? 'Excellent!' : accuracyPercent >= 70 ? 'Great job!' : accuracyPercent >= 50 ? 'Good effort!' : 'Keep practicing!'}
          </h1>

          {/* Accuracy */}
          <div className="text-5xl font-extrabold text-blue-400">{accuracyPercent}%</div>
          <p className="text-white/50 text-sm -mt-4">Accuracy</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-green-500/15 border border-green-500/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-green-400">{correctCount}/{questionsAnswered}</p>
              <p className="text-xs text-green-300/70">Correct</p>
            </div>
            <div className="bg-orange-500/15 border border-orange-500/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-orange-400">{bestStreak}</p>
              <p className="text-xs text-orange-300/70">Best Streak</p>
            </div>
            <div className="bg-blue-500/15 border border-blue-500/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-blue-400">+{totalXPEarned}</p>
              <p className="text-xs text-blue-300/70">XP Earned</p>
            </div>
            <div className="bg-yellow-500/15 border border-yellow-500/20 rounded-2xl p-4">
              <p className="text-2xl font-bold text-yellow-400">+{coinsEarned}</p>
              <p className="text-xs text-yellow-300/70">Coins Earned</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handlePlayAgain}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
            >
              Play Again
            </button>
            <button
              onClick={handleDone}
              className="w-full py-3 bg-white/10 text-white/70 font-semibold rounded-xl hover:bg-white/15 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading Screen ──
  if (state.type === 'loading' || state.type === 'idle') {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        <p className="mt-4 text-white/50 text-sm">Generating question...</p>
      </div>
    );
  }

  // ── Error Screen ──
  if (state.type === 'error') {
    return (
      <div className="h-full flex flex-col items-center justify-center px-4">
        <p className="text-red-400 text-lg font-semibold mb-4">{state.message}</p>
        <button
          onClick={() => loadQuestion()}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Presenting / Answered Screen ──
  const question = state.question;
  const isAnswered = state.type === 'answered';
  const wasCorrect = state.type === 'answered' ? state.correct : false;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <NavHeader title={config.displayName} />
      {/* Progress Header */}
      <div className="shrink-0 bg-white/5 backdrop-blur border-b border-white/10 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white/70">
            Q {displayQ}/{TOTAL_QUESTIONS}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-green-400">
              {correctCount} correct
            </span>
            <span className="text-sm font-medium text-orange-400">
              Streak: {currentStreak}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* Level display */}
        <p className="text-sm font-semibold text-white/80 mt-2 text-center">
          {config.displayName} — Level {Math.max(1, levelFor(mode))}
        </p>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col items-center px-4 py-4 overflow-y-auto">
        <p className="text-sm text-blue-400 font-medium mb-2">{config.displayName}</p>
        <h2 className="text-3xl font-bold text-white text-center mb-4 leading-tight">
          {question.question}
        </h2>

        {/* Options */}
        <div className="w-full max-w-md space-y-3">
          {question.options.map((option, idx) => {
            let btnClass = 'w-full py-3 px-5 rounded-2xl text-base font-semibold transition-all border ';

            if (!isAnswered) {
              // Default state
              btnClass += 'bg-white/5 border-white/10 text-white hover:bg-white/10 active:scale-95';
            } else if (idx === question.correct_index) {
              // Correct answer — always show green
              btnClass += 'bg-green-500/20 border-green-500 text-green-300';
            } else if (idx === selectedIndex && !wasCorrect) {
              // Selected wrong answer — red
              btnClass += 'bg-red-500/20 border-red-500 text-red-300';
            } else {
              // Other options after answering
              btnClass += 'bg-white/5 border-white/10 text-white/30';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && idx === question.correct_index && (
                    <span className="text-green-400 text-xl">✓</span>
                  )}
                  {isAnswered && idx === selectedIndex && !wasCorrect && idx !== question.correct_index && (
                    <span className="text-red-400 text-xl">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Show Hint button (before answering) */}
        {!isAnswered && (
          <div className="w-full max-w-md mt-4 text-center">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-orange-400 font-medium text-sm hover:text-orange-300 transition"
              >
                Show Hint
              </button>
            ) : (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 text-sm text-orange-300">
                {question.hint}
              </div>
            )}
          </div>
        )}

        {/* Answer Feedback */}
        {isAnswered && (
          <div className="w-full max-w-md mt-4 space-y-3 mt-auto">
            <div className={`text-center text-lg font-bold ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {wasCorrect ? 'Correct! Great job!' : 'Not quite right.'}
            </div>

            {!wasCorrect && (
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 text-sm text-orange-300">
                <span className="font-semibold text-orange-400">Hint:</span> {question.hint}
              </div>
            )}

            <button
              onClick={handleNext}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
            >
              {questionsAnswered >= TOTAL_QUESTIONS ? 'See Results' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
