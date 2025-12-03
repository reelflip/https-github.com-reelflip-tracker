
export type Role = 'STUDENT' | 'ADMIN' | 'PARENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  targetYear?: number;
  avatarUrl?: string;
  parentId?: string; // If student, links to parent
  studentId?: string; // If parent, links to student
  // Profile Fields
  institute?: string; // Coaching Name
  school?: string;    // School/College Name
  course?: string;    // e.g. JEE Mains, Foundation
  phone?: string;
  // Connection Logic
  pendingRequest?: {
    fromId: string;
    fromName: string;
    type: 'PARENT_LINK';
  };
}

export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVISE';

export interface TopicProgress {
  topicId: string;
  status: TopicStatus;
  ex1Solved: number;
  ex1Total: number;
  ex2Solved: number;
  ex2Total: number;
  ex3Solved: number;
  ex3Total: number;
  ex4Solved: number;
  ex4Total: number;
}

export interface Topic {
  id: string;
  name: string;
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  text: string;
  options: string[];
  correctOptionIndex: number; // 0-3
}

export interface Test {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
  category: 'ADMIN' | 'PAST_PAPER';
  difficulty: 'MAINS' | 'ADVANCED' | 'CUSTOM';
}

export interface QuestionResult {
  questionId: string;
  subjectId: string;
  topicId: string;
  status: 'CORRECT' | 'INCORRECT' | 'UNATTEMPTED';
}

export interface TestAttempt {
  id: string;
  testId: string;
  studentId: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  accuracy_percent?: number;
  detailedResults?: QuestionResult[]; // New field for detailed analytics
}

export interface FocusSession {
  id: string;
  type: 'POMODORO' | 'DEEP_WORK';
  durationMinutes: number;
  completedAt: string;
  reflection: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'INFO' | 'ALERT' | 'SUCCESS';
}

export interface MistakeRecord {
  id: string;
  questionText: string;
  subjectId: string;
  topicId: string;
  testName: string;
  date: string;
  userNotes?: string;
  tags: ('Silly Mistake' | 'Conceptual Error' | 'Calculation Error' | 'Time Management' | 'Forgot Formula')[];
}

export interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
}

export interface Flashcard {
    id: string;
    subjectId: 'phys' | 'chem' | 'math';
    front: string; // The Concept or Question
    back: string;  // The Formula or Reaction
    difficulty: 'HARD' | 'MEDIUM' | 'EASY';
}

export interface BacklogItem {
    id: string;
    subjectId: 'phys' | 'chem' | 'math';
    title: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    deadline: string;
    status: 'PENDING' | 'CLEARED';
}

export interface MockDataState {
  users: User[];
  syllabus: Subject[];
  progress: Record<string, TopicProgress>; // Key is topicId
  tests: Test[];
  attempts: TestAttempt[];
  sessions: FocusSession[];
}
