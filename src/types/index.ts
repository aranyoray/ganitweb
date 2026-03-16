// MARK: - User & Auth Types

export type UserGroup = 'child' | 'elderly';

export interface UserProfile {
  id: string;
  username: string;
  userGroup: UserGroup;
  age?: number;
  consentGranted: boolean;
  createdAt: Date;
}

// MARK: - Quiz Types

export type QuizMode = 'addition' | 'subtraction' | 'multiplication' | 'division';

export const QUIZ_MODES: QuizMode[] = ['addition', 'subtraction', 'multiplication', 'division'];

export const QUIZ_CONFIG: Record<QuizMode, { symbol: string; displayName: string; pointMultiplier: number; xpReward: number }> = {
  addition: { symbol: '+', displayName: 'Addition', pointMultiplier: 1, xpReward: 50 },
  subtraction: { symbol: '-', displayName: 'Subtraction', pointMultiplier: 2, xpReward: 100 },
  multiplication: { symbol: '×', displayName: 'Multiplication', pointMultiplier: 5, xpReward: 250 },
  division: { symbol: '÷', displayName: 'Division', pointMultiplier: 3, xpReward: 150 },
};

export interface MCQQuestion {
  question: string;
  options: string[];
  correct_index: number;
  hint: string;
}

export type QuizState =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'presenting'; question: MCQQuestion }
  | { type: 'answered'; correct: boolean; question: MCQQuestion }
  | { type: 'sessionComplete' }
  | { type: 'error'; message: string };

// MARK: - Progress Types

export type ProgressColor = 'white' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'black';

export interface ProgressData {
  score: number;
  additionLevel: number;
  subtractionLevel: number;
  multiplicationLevel: number;
  divisionLevel: number;
  progress: number;
  xpRequirements: number;
  coins: number;
  progressColor: ProgressColor;
  powerUpPointLevel: number;
}

// MARK: - Shop Types

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  reward: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Mythic' | 'Legendary';
}

// MARK: - Cognitive Exercise Types

export type ExerciseType = 'memorySequence' | 'patternRecognition' | 'wordPuzzle';

// MARK: - Biometric Consent

export interface BiometricConsent {
  eyeTrackingEnabled: boolean;
  facialAnalysisEnabled: boolean;
  touchTrackingEnabled: boolean;
  voiceTrackingEnabled: boolean;
}
