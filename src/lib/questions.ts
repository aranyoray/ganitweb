import type { MCQQuestion, QuizMode } from '@/types';

// MARK: - Gemini AI Question Generation

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
let consecutiveFailures = 0;

export async function generateAIQuestion(grade: number, topic: string, accuracy: number): Promise<MCQQuestion | null> {
  if (consecutiveFailures >= 3) return null;

  const difficulty = accuracy < 0.4 ? 'easy' : accuracy < 0.7 ? 'medium' : 'hard';
  const prompt = `You are a friendly math tutor designing multiple-choice math questions for children.

Student profile:
- Grade: ${grade}
- Topic: ${topic}
- Current accuracy: ${Math.round(accuracy * 100)}%
- Difficulty level: ${difficulty}

Generate ONE math multiple choice question.

Requirements:
- Suitable for grade ${grade} level ${topic}
- Short question text
- Exactly 4 options
- Exactly one correct answer
- A short, helpful hint

Return ONLY valid JSON with no extra text:
{"question": "text", "options": ["A", "B", "C", "D"], "correct_index": 0, "hint": "short hint"}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      consecutiveFailures++;
      return null;
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) { consecutiveFailures++; return null; }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const question = JSON.parse(cleaned) as MCQQuestion;
    if (question.question && question.options?.length === 4 && typeof question.correct_index === 'number' && question.hint) {
      consecutiveFailures = 0;
      return question;
    }
    consecutiveFailures++;
    return null;
  } catch {
    consecutiveFailures++;
    return null;
  }
}

export function hasAPI(): boolean {
  return consecutiveFailures < 3;
}

// MARK: - Offline Fallback

export function generateFallback(topic: string): MCQQuestion {
  let a: number, b: number, correctAnswer: number, questionText: string;

  switch (topic) {
    case 'addition':
      a = rand(1, 50); b = rand(1, 50);
      correctAnswer = a + b;
      questionText = `What is ${a} + ${b}?`;
      break;
    case 'subtraction':
      a = rand(10, 100); b = rand(1, a);
      correctAnswer = a - b;
      questionText = `What is ${a} - ${b}?`;
      break;
    case 'multiplication':
      a = rand(1, 12); b = rand(1, 12);
      correctAnswer = a * b;
      questionText = `What is ${a} × ${b}?`;
      break;
    case 'division':
      b = rand(1, 12); correctAnswer = rand(1, 12);
      a = b * correctAnswer;
      questionText = `What is ${a} ÷ ${b}?`;
      break;
    default:
      a = rand(1, 20); b = rand(1, 20);
      correctAnswer = a + b;
      questionText = `What is ${a} + ${b}?`;
  }

  const correctIndex = rand(0, 3);
  const usedAnswers = new Set([correctAnswer]);
  const options: string[] = [];

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(String(correctAnswer));
    } else {
      let wrong = correctAnswer;
      let attempts = 0;
      while (usedAnswers.has(wrong) && attempts < 20) {
        if (topic === 'multiplication') {
          const offBy = rand(1, 3);
          wrong = Math.random() > 0.5 ? a * (b + offBy) : a * (b - offBy);
        } else if (topic === 'division') {
          wrong = rand(Math.max(1, correctAnswer - 3), correctAnswer + 3);
        } else {
          wrong = correctAnswer + rand(1, 5) * (Math.random() > 0.5 ? 1 : -1);
        }
        if (wrong < 0) wrong = Math.abs(wrong) + 1;
        attempts++;
      }
      if (usedAnswers.has(wrong)) wrong = correctAnswer + usedAnswers.size + 1;
      usedAnswers.add(wrong);
      options.push(String(wrong));
    }
  }

  return { question: questionText, options, correct_index: correctIndex, hint: 'Think step by step!' };
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
