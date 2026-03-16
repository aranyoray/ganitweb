'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useProgress } from '@/contexts/ProgressContext';
import NavHeader from '@/components/NavHeader';
import type { ExerciseType } from '@/types';

// ---------------------------------------------------------------------------
// Tab labels
// ---------------------------------------------------------------------------
const TAB_LABELS: Record<ExerciseType, string> = {
  memorySequence: 'Memory Sequence',
  patternRecognition: 'Pattern Recognition',
  wordPuzzle: 'Word Puzzle',
};

// ---------------------------------------------------------------------------
// MEMORY SEQUENCE
// ---------------------------------------------------------------------------
const SEQUENCE_COLORS = [
  'bg-blue-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-emerald-400',
  'bg-cyan-500',
  'bg-amber-700',
];

function generateSequence(length: number): number[] {
  const seq: number[] = [];
  while (seq.length < length) {
    const n = Math.floor(Math.random() * 9) + 1; // 1-9
    seq.push(n);
  }
  return seq;
}

function MemorySequence({ onScore }: { onScore: (pts: number) => void }) {
  const [seqLength, setSeqLength] = useState(4);
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'showing' | 'input' | 'result'>('idle');
  const [showIndex, setShowIndex] = useState(0);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [localScore, setLocalScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRound = useCallback(() => {
    const seq = generateSequence(seqLength);
    setSequence(seq);
    setUserInput([]);
    setFeedback(null);
    setShowIndex(0);
    setPhase('showing');
  }, [seqLength]);

  // Auto-advance displayed numbers
  useEffect(() => {
    if (phase !== 'showing') return;
    if (showIndex >= sequence.length) {
      timerRef.current = setTimeout(() => setPhase('input'), 600);
      return;
    }
    timerRef.current = setTimeout(() => setShowIndex((i) => i + 1), 1200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, showIndex, sequence.length]);

  function handleNumberTap(n: number) {
    if (phase !== 'input') return;
    const next = [...userInput, n];
    setUserInput(next);

    if (next.length === sequence.length) {
      const correct = next.every((v, i) => v === sequence[i]);
      if (correct) {
        const pts = seqLength * 10;
        setLocalScore((s) => s + pts);
        onScore(pts);
        setFeedback('Excellent! You remembered the whole sequence!');
        setSeqLength((l) => l + 1);
      } else {
        setFeedback('Good try! Keep practicing.');
        setSeqLength((l) => Math.max(4, l - 1));
      }
      setPhase('result');
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-white/50">Score: {localScore}</div>

      {/* Display area */}
      <div className="flex items-center justify-center min-h-[160px] rounded-2xl bg-white/5 border border-white/10">
        {phase === 'idle' && (
          <button
            onClick={startRound}
            className="px-6 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition"
          >
            Start Round
          </button>
        )}
        {phase === 'showing' && showIndex < sequence.length && (
          <div className="text-center">
            <p className="text-white/50 text-sm mb-3">Watch the numbers carefully...</p>
            <div
              className={`w-[140px] h-[140px] rounded-2xl flex items-center justify-center mx-auto ${SEQUENCE_COLORS[sequence[showIndex] - 1]} animate-pulse`}
            >
              <span className="text-[56px] font-bold text-white">{sequence[showIndex]}</span>
            </div>
          </div>
        )}
        {phase === 'showing' && showIndex >= sequence.length && (
          <span className="text-white/40 text-sm">Get ready...</span>
        )}
        {phase === 'input' && (
          <div className="text-center">
            <p className="text-white/50 text-sm mb-1">Enter the numbers in order</p>
            <p className="text-white/40 text-xs mb-2">
              ({userInput.length}/{sequence.length})
            </p>
            <div className="flex gap-2 justify-center">
              {Array.from({ length: sequence.length }).map((_, i) => (
                <div
                  key={i}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold border ${
                    i < userInput.length
                      ? `${SEQUENCE_COLORS[userInput[i] - 1]} border-transparent text-white`
                      : 'border-white/10 bg-white/5 text-transparent'
                  }`}
                >
                  {i < userInput.length ? userInput[i] : '-'}
                </div>
              ))}
            </div>
          </div>
        )}
        {phase === 'result' && (
          <div className="text-center">
            {feedback?.startsWith('Excellent') ? (
              <>
                <div className="text-teal-400 text-3xl mb-1">✓</div>
                <p className="text-xl font-bold text-teal-400">{feedback}</p>
              </>
            ) : (
              <>
                <div className="text-orange-400 text-3xl mb-1">↻</div>
                <p className="text-xl font-bold text-orange-400">{feedback}</p>
              </>
            )}
            <p className="text-xs text-white/40 mt-1">
              Sequence was: {sequence.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Number pad */}
      {phase === 'input' && (
        <div className="grid grid-cols-3 gap-3 max-w-[220px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleNumberTap(n)}
              className="w-16 h-16 rounded-xl font-bold text-lg text-white transition active:scale-95 bg-blue-500/10 hover:bg-blue-500/20 border border-white/10"
            >
              {n}
            </button>
          ))}
        </div>
      )}

      {phase === 'result' && (
        <div className="text-center">
          <button
            onClick={startRound}
            className="px-6 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition"
          >
            Next Exercise (length {seqLength})
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PATTERN RECOGNITION
// ---------------------------------------------------------------------------
interface PatternQ {
  sequence: number[];
  answer: number;
  options: number[];
}

function generatePattern(): PatternQ {
  const patterns: Array<(start: number) => (i: number) => number> = [
    (s) => (i) => s + i * 2,
    (s) => (i) => s + i * 3,
    (s) => (i) => s + i * 5,
    (s) => (i) => s * Math.pow(2, i),
    (s) => (i) => s + i * 4,
    (s) => (i) => s + i * 7,
  ];
  const fn = patterns[Math.floor(Math.random() * patterns.length)];
  const start = Math.floor(Math.random() * 5) + 1;
  const gen = fn(start);
  const seq = [0, 1, 2, 3, 4].map(gen);
  const answer = seq[4];
  const display = seq.slice(0, 4);

  // Build options including the answer
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const offset = (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = answer + offset;
    if (candidate > 0) opts.add(candidate);
  }
  const options = Array.from(opts).sort(() => Math.random() - 0.5);

  return { sequence: display, answer, options };
}

function PatternRecognition({ onScore }: { onScore: (pts: number) => void }) {
  const [question, setQuestion] = useState<PatternQ | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [localScore, setLocalScore] = useState(0);

  function next() {
    setQuestion(generatePattern());
    setSelected(null);
  }

  function handleSelect(opt: number) {
    if (selected !== null || !question) return;
    setSelected(opt);
    if (opt === question.answer) {
      setLocalScore((s) => s + 15);
      onScore(15);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-white/50">Score: {localScore}</div>

      {!question ? (
        <div className="text-center">
          <button onClick={next} className="px-6 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition">
            Start
          </button>
        </div>
      ) : (
        <>
          <p className="text-center text-sm text-white/50 mb-2">What comes next in the pattern?</p>
          <div className="flex items-center justify-center gap-3 py-6 px-4">
            {question.sequence.map((num, i) => (
              <div key={i} className="w-14 h-14 rounded-xl bg-teal-500/15 flex items-center justify-center">
                <span className="text-teal-300 font-bold text-lg">{num}</span>
              </div>
            ))}
            <div className="w-14 h-14 rounded-xl bg-orange-500/15 flex items-center justify-center">
              <span className="text-orange-400 font-bold text-lg">?</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt) => {
              let cls = 'bg-white/5 hover:bg-white/10 border border-white/10 text-white';
              if (selected !== null) {
                if (opt === question.answer) cls = 'bg-teal-500/15 border-teal-500 text-teal-300';
                else if (opt === selected) cls = 'bg-orange-500/15 border-orange-500 text-orange-300';
                else cls = 'bg-white/5 border-white/10 text-white/30';
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`py-4 rounded-xl font-bold text-lg transition ${cls}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{opt}</span>
                    {selected !== null && opt === question.answer && (
                      <span className="text-teal-400">✓</span>
                    )}
                    {selected !== null && opt === selected && opt !== question.answer && (
                      <span className="text-orange-400">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div className="text-center">
              <p className={`font-bold mb-3 ${selected === question.answer ? 'text-teal-400' : 'text-orange-400'}`}>
                {selected === question.answer ? 'Correct!' : `Wrong — answer was ${question.answer}`}
              </p>
              <button onClick={next} className="px-6 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition">
                Next Pattern
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// WORD PUZZLE
// ---------------------------------------------------------------------------
interface OddOneOutQ {
  category: string;
  words: string[];
  oddIndex: number;
}

interface UnscrambleQ {
  original: string;
  scrambled: string;
  category: string;
}

const CATEGORIES: Record<string, string[]> = {
  Fruits: ['Apple', 'Banana', 'Mango', 'Orange', 'Grape', 'Peach', 'Plum', 'Pear', 'Kiwi', 'Cherry'],
  Animals: ['Dog', 'Cat', 'Lion', 'Tiger', 'Bear', 'Deer', 'Fox', 'Wolf', 'Hawk', 'Frog'],
  Colors: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Orange', 'Purple', 'White', 'Black', 'Brown'],
  Numbers: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'],
  Vehicles: ['Car', 'Bus', 'Train', 'Plane', 'Boat', 'Truck', 'Bike', 'Ship', 'Van', 'Taxi'],
  Furniture: ['Chair', 'Table', 'Desk', 'Sofa', 'Bed', 'Shelf', 'Stool', 'Bench', 'Lamp', 'Couch'],
  Months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
  Instruments: ['Piano', 'Guitar', 'Drums', 'Violin', 'Flute', 'Trumpet', 'Harp', 'Cello', 'Banjo', 'Tuba'],
};

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateOddOneOut(): OddOneOutQ {
  const cats = Object.keys(CATEGORIES);
  const mainCat = cats[Math.floor(Math.random() * cats.length)];
  let oddCat = cats[Math.floor(Math.random() * cats.length)];
  while (oddCat === mainCat) oddCat = cats[Math.floor(Math.random() * cats.length)];

  const mainWords = pickRandom(CATEGORIES[mainCat], 3);
  const oddWord = pickRandom(CATEGORIES[oddCat], 1)[0];
  const oddIndex = Math.floor(Math.random() * 4);
  const words = [...mainWords];
  words.splice(oddIndex, 0, oddWord);

  return { category: mainCat, words, oddIndex };
}

function scrambleWord(word: string): string {
  const chars = word.toLowerCase().split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const result = chars.join('');
  if (result === word.toLowerCase()) return scrambleWord(word);
  return result;
}

function generateUnscramble(): UnscrambleQ {
  const cats = Object.keys(CATEGORIES);
  const cat = cats[Math.floor(Math.random() * cats.length)];
  const word = pickRandom(CATEGORIES[cat], 1)[0];
  return { original: word, scrambled: scrambleWord(word), category: cat };
}

function WordPuzzle({ onScore }: { onScore: (pts: number) => void }) {
  const [mode, setMode] = useState<'oddOneOut' | 'unscramble'>('oddOneOut');
  const [localScore, setLocalScore] = useState(0);

  // Odd one out state
  const [oddQ, setOddQ] = useState<OddOneOutQ | null>(null);
  const [oddSelected, setOddSelected] = useState<number | null>(null);

  // Unscramble state
  const [unsQ, setUnsQ] = useState<UnscrambleQ | null>(null);
  const [unsAnswer, setUnsAnswer] = useState('');
  const [unsResult, setUnsResult] = useState<boolean | null>(null);

  function newOdd() {
    setOddQ(generateOddOneOut());
    setOddSelected(null);
  }

  function newUnscramble() {
    setUnsQ(generateUnscramble());
    setUnsAnswer('');
    setUnsResult(null);
  }

  function handleOddSelect(idx: number) {
    if (oddSelected !== null || !oddQ) return;
    setOddSelected(idx);
    if (idx === oddQ.oddIndex) {
      setLocalScore((s) => s + 10);
      onScore(10);
    }
  }

  function handleUnsSubmit() {
    if (!unsQ) return;
    const correct = unsAnswer.trim().toLowerCase() === unsQ.original.toLowerCase();
    setUnsResult(correct);
    if (correct) {
      setLocalScore((s) => s + 10);
      onScore(10);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-white/50">Score: {localScore}</div>

      {/* Mode toggle */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setMode('oddOneOut')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'oddOneOut' ? 'bg-teal-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
        >
          Odd One Out
        </button>
        <button
          onClick={() => setMode('unscramble')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'unscramble' ? 'bg-teal-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
        >
          Unscramble
        </button>
      </div>

      {/* Odd One Out */}
      {mode === 'oddOneOut' && (
        <>
          {!oddQ ? (
            <div className="text-center">
              <button onClick={newOdd} className="px-6 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition">
                Start
              </button>
            </div>
          ) : (
            <>
              <div className="text-center bg-white/5 border border-white/10 rounded-2xl py-4 px-4">
                <p className="text-sm text-white/60 mb-1">Which word does NOT belong?</p>
                <p className="text-xs text-white/40">Category: {oddQ.category}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {oddQ.words.map((w, i) => {
                  let cls = 'bg-white/5 hover:bg-white/10 border border-white/10 text-white';
                  if (oddSelected !== null) {
                    if (i === oddQ.oddIndex) cls = 'bg-teal-500/15 border-teal-500 text-teal-300';
                    else if (i === oddSelected) cls = 'bg-orange-500/15 border-orange-500 text-orange-300';
                    else cls = 'bg-white/5 border-white/10 text-white/30';
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleOddSelect(i)}
                      className={`py-4 rounded-xl font-bold transition ${cls}`}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
              {oddSelected !== null && (
                <div className="text-center">
                  <p className={`font-bold mb-3 ${oddSelected === oddQ.oddIndex ? 'text-teal-400' : 'text-orange-400'}`}>
                    {oddSelected === oddQ.oddIndex ? 'Correct!' : `Wrong — "${oddQ.words[oddQ.oddIndex]}" was the odd one`}
                  </p>
                  <button onClick={newOdd} className="px-6 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition">
                    Next Puzzle
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Unscramble */}
      {mode === 'unscramble' && (
        <>
          {!unsQ ? (
            <div className="text-center">
              <button onClick={newUnscramble} className="px-6 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition">
                Start
              </button>
            </div>
          ) : (
            <>
              <div className="text-center bg-white/5 border border-white/10 rounded-2xl py-6 px-4">
                <p className="text-sm text-white/60 mb-3">Unscramble this {unsQ.category.toLowerCase().slice(0, -1)}:</p>
                <div className="flex gap-2 justify-center">
                  {unsQ.scrambled.split('').map((char, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg bg-indigo-500/12 border border-indigo-500/20 flex items-center justify-center">
                      <span className="text-indigo-300 font-bold text-lg uppercase">{char}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="text"
                  value={unsAnswer}
                  onChange={(e) => setUnsAnswer(e.target.value)}
                  disabled={unsResult !== null}
                  onKeyDown={(e) => e.key === 'Enter' && unsResult === null && handleUnsSubmit()}
                  placeholder="Type your answer..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50"
                />
                {unsResult === null && (
                  <button
                    onClick={handleUnsSubmit}
                    className="px-4 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition"
                  >
                    Check
                  </button>
                )}
              </div>
              {unsResult !== null && (
                <div className="text-center">
                  <p className={`font-bold mb-3 ${unsResult ? 'text-teal-400' : 'text-orange-400'}`}>
                    {unsResult ? 'Correct!' : `Wrong — answer was "${unsQ.original}"`}
                  </p>
                  <button onClick={newUnscramble} className="px-6 py-3 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl font-bold transition">
                    Next Puzzle
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------
export default function BrainTrainingPage() {
  const { addScore } = useProgress();
  const [activeTab, setActiveTab] = useState<ExerciseType>('memorySequence');

  function handleScore(pts: number) {
    addScore(pts);
  }

  return (
    <div className="min-h-screen text-white">
      <NavHeader title="Brain Training" />

      {/* Tab selector */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(Object.keys(TAB_LABELS) as ExerciseType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === tab
                  ? 'bg-teal-500 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {activeTab === 'memorySequence' && <MemorySequence onScore={handleScore} />}
        {activeTab === 'patternRecognition' && <PatternRecognition onScore={handleScore} />}
        {activeTab === 'wordPuzzle' && <WordPuzzle onScore={handleScore} />}
      </div>
    </div>
  );
}
