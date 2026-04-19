/**
 * Zenith Study Types
 */

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'student' | 'admin';
  stats: {
    streak: number;
    points: number;
    level: number;
    studyTimeMinutes: number;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    focusMode: boolean;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdBy: string;
  createdAt: any;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  type: 'multiple-choice' | 'true-false';
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: any;
}
