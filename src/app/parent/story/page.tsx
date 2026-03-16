'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import NavHeader from '@/components/NavHeader';

function generateStory(
  name: string,
  sessions: number,
  accuracy: number,
  questionsAnswered: number,
  score: number,
  addLvl: number,
  subLvl: number,
  mulLvl: number,
  divLvl: number,
): string {
  const bestSkill = [
    { name: 'addition', level: addLvl },
    { name: 'subtraction', level: subLvl },
    { name: 'multiplication', level: mulLvl },
    { name: 'division', level: divLvl },
  ].sort((a, b) => b.level - a.level)[0];

  const totalLevels = addLvl + subLvl + mulLvl + divLvl;

  // Build narrative paragraphs
  const paragraphs: string[] = [];

  // Opening
  if (sessions === 0) {
    paragraphs.push(
      `${name} is just getting started on their math learning adventure! There are exciting challenges ahead, and every problem solved is a step toward becoming a math champion.`
    );
  } else if (sessions <= 3) {
    paragraphs.push(
      `${name} has begun their math journey this week with ${sessions} practice session${sessions > 1 ? 's' : ''}. The early steps are the most important, and ${name} is already building a strong foundation.`
    );
  } else if (sessions <= 7) {
    paragraphs.push(
      `What a productive week for ${name}! With ${sessions} sessions completed, ${name} has shown real dedication to improving their math skills. Consistency like this is the key to long-term success.`
    );
  } else {
    paragraphs.push(
      `${name} has been on an incredible streak this week, completing ${sessions} practice sessions! This level of commitment is truly impressive and shows a genuine love for learning.`
    );
  }

  // Accuracy & questions
  if (questionsAnswered > 0) {
    if (accuracy >= 90) {
      paragraphs.push(
        `Out of ${questionsAnswered} questions tackled, ${name} achieved an outstanding ${accuracy}% accuracy rate. This shows excellent understanding and careful problem-solving.`
      );
    } else if (accuracy >= 70) {
      paragraphs.push(
        `${name} answered ${questionsAnswered} questions with a solid ${accuracy}% accuracy. There is a good grasp of the concepts, and with continued practice, even higher accuracy is within reach.`
      );
    } else if (accuracy >= 50) {
      paragraphs.push(
        `${name} worked through ${questionsAnswered} questions this week with ${accuracy}% accuracy. Every mistake is a learning opportunity, and the effort put in is what matters most.`
      );
    } else {
      paragraphs.push(
        `${name} bravely tackled ${questionsAnswered} questions this week. While the accuracy of ${accuracy}% shows there is room to grow, the willingness to keep trying is the most valuable skill of all.`
      );
    }
  }

  // Best skill highlight
  if (bestSkill.level > 0) {
    paragraphs.push(
      `${name}'s strongest area right now is ${bestSkill.name}, reaching level ${bestSkill.level}. ${totalLevels > 4 ? 'Across all four operations, the combined skill level of ' + totalLevels + ' shows well-rounded progress.' : 'Exploring the other operations will help build a well-rounded math toolkit.'}`
    );
  }

  // Score and encouragement
  if (score > 0) {
    paragraphs.push(
      `With ${score} points earned so far, ${name} is building up an impressive achievement record. Keep up the wonderful work — the next milestone is just around the corner!`
    );
  }

  return paragraphs.join('\n\n');
}

function getWeekOfDate(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  return monday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const DEMO_STORY = `This week was a wonderful journey of learning and growth! With several practice sessions completed, there is clear dedication to building strong math skills.

Out of many questions tackled, the accuracy rate has been impressive. Each problem solved builds confidence and understanding, making math feel more like an adventure than a chore.

The strongest area right now is addition, showing great progress in understanding how numbers combine. Exploring subtraction, multiplication, and division will help build a well-rounded math toolkit.

With points steadily growing, the next milestone is just around the corner. Keep up the fantastic work — every practice session brings new discoveries!`;

export default function LearningStoryPage() {
  const { user } = useAuth();
  const {
    score,
    additionLevel,
    subtractionLevel,
    multiplicationLevel,
    divisionLevel,
    username,
  } = useProgress();

  const [story, setStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // Load stats from localStorage
  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('ganit_session_count');
      if (storedSessions) setSessionCount(parseInt(storedSessions, 10) || 0);

      const storedAccuracy = localStorage.getItem('ganit_accuracy');
      if (storedAccuracy) setAccuracy(parseFloat(storedAccuracy) || 0);

      const storedQuestions = localStorage.getItem('ganit_questions_answered');
      if (storedQuestions) setQuestionsAnswered(parseInt(storedQuestions, 10) || 0);
    } catch {
      // ignore
    }
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // Simulate brief generation delay for UX
    setTimeout(() => {
      const name = user?.username || username || 'Your child';
      const text = generateStory(
        name,
        sessionCount,
        accuracy,
        questionsAnswered,
        score,
        additionLevel,
        subtractionLevel,
        multiplicationLevel,
        divisionLevel,
      );
      setStory(text);
      setIsGenerating(false);
    }, 800);
  }, [user, username, sessionCount, accuracy, questionsAnswered, score, additionLevel, subtractionLevel, multiplicationLevel, divisionLevel]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 text-white">
      <NavHeader title="Weekly Learning Story" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-green-400">{sessionCount}</p>
            <p className="text-xs text-indigo-400 mt-1">Sessions</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-amber-300">{accuracy}%</p>
            <p className="text-xs text-indigo-400 mt-1">Accuracy</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-blue-400">{questionsAnswered}</p>
            <p className="text-xs text-indigo-400 mt-1">Questions</p>
          </div>
        </div>

        {/* Week display */}
        <p className="text-center text-sm text-indigo-400">Week of {getWeekOfDate()}</p>

        {/* Generate button */}
        <div className="text-center space-y-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-indigo-400 rounded-xl font-bold transition"
          >
            {isGenerating ? 'Generating...' : story ? 'Regenerate Story' : 'Generate This Week\'s Story'}
          </button>
          {!story && !isGenerating && (
            <div>
              <button
                onClick={() => setStory(DEMO_STORY)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-indigo-300 rounded-xl font-semibold text-sm transition"
              >
                Show Demo Story
              </button>
            </div>
          )}
        </div>

        {/* Story display */}
        {story && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-sm text-indigo-300 font-semibold mb-4 uppercase tracking-wider">
              {user?.username || username || 'Your Child'}&apos;s Learning Week
            </h2>
            <div className="space-y-4">
              {story.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-indigo-100">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Tip */}
        {!story && !isGenerating && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className="text-sm text-indigo-300">
              Tap &quot;Generate Story&quot; to create a personalized narrative about your child&apos;s learning progress this week.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
