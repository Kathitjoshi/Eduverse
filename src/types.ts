export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  conceptsCount: number;
  modulesCount: number;
  progress: number; // percentage 0-100
  color: string; // for pill highlights
}

export interface GraphNode {
  id: string;
  name: string;
  category: string;
  val: number; // size
  description: string;
  prerequisites?: string[];
  linksText?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  streakDays: number;
  studyMinutes: number;
  milestone: string;
  isCurrentUser?: boolean;
}
