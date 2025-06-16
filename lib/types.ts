export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  createdBy: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  timeLimit?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizSession {
  id: string;
  quizId: string;
  userId: string;
  answers: UserAnswer[];
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent: number;
  quiz: Quiz;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizStats {
  totalQuizzes: number;
  averageScore: number;
  totalTimeSpent: number;
  strongestSubjects: string[];
  weakestSubjects: string[];
  recentPerformance: number[];
}

export interface LectureNotes {
  id: string;
  title: string;
  content: string;
  subject: string;
  uploadedAt: Date;
  userId: string;
}