type QuestionType = 'text' | 'email' | 'select' | 'radio' | 'checkbox';

export interface QuestionOption {
  value: string;
  label: string;
  points: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  placeholder?: string;
  options?: QuestionOption[];
  required?: boolean;
}

export interface QuizPage {
  id: string;
  questions: Question[];
}

export interface QuestionIndex {
  questionId: string;
  globalIndex: number;
  pageIndex: number;
  questionIndex: number;
}

export interface ScoreResult {
  rawScore: number;
  wealthIQ: number;
  maxScore: number;
  percentile: number;
  zScore: number;
  category: string;
  recommendations: string[];
  statisticalInfo: {
    mean: number;
    standardDeviation: number;
    confidenceInterval: [number, number];
  };
}

export interface PeerComparison {
  category: string;
  percentage: number;
  description: string;
}
export interface ScoringParameters {
  mean: number;           // Population mean raw score
  standardDeviation: number; // Population standard deviation
  maxPossibleScore: number;  // Maximum possible raw score
}