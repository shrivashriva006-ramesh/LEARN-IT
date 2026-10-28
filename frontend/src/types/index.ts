export type Role = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export interface Lesson {
  _id: string;
  course: string | Course;
  lessonTitle: string;
  contentType: 'video' | 'notes' | 'pdf';
  contentUrl?: string;
  description?: string;
  notesContent?: string;
  pdfUrl?: string;
  order: number;
  durationMinutes: number;
}

export interface Course {
  _id: string;
  title: string;
  slug?: string;
  category: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  iconName?: string;
  learningObjectives: string[];
  status: 'published' | 'draft';
  enrolledCount: number;
  instructor: User;
  lessons?: Lesson[];
  createdAt: string;
}

export interface Question {
  questionNumber: number;
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
}

export interface Assessment {
  _id: string;
  course?: Course | string;
  title: string;
  subject: string;
  description?: string;
  totalMarks: number;
  passingPercentage: number;
  questionCount?: number;
  questions?: Question[];
  createdBy?: User;
  createdAt?: string;
}

export interface Quiz {
  _id: string;
  course?: Course | string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  questionCount?: number;
  questions?: Question[];
  createdBy?: User;
  createdAt?: string;
}

export interface AnswerSummaryItem {
  questionNumber: number;
  questionText: string;
  selectedOption: number | null;
  correctOption: number;
  isCorrect: boolean;
  options: string[];
  explanation: string;
}

export interface Result {
  _id: string;
  student: string | User;
  itemType: 'assessment' | 'quiz';
  assessment?: string;
  quiz?: string;
  course?: Course;
  subject: string;
  title: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  submissionDate: string;
  answersSummary?: AnswerSummaryItem[];
}

export interface ProgressItem {
  _id: string;
  course: Course;
  completedLessons: string[] | Lesson[];
  totalLessons: number;
  completionPercentage: number;
  hasCompletedAssessment: boolean;
  hasCompletedQuiz: boolean;
  lastActivityAt?: string;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'assessment' | 'quiz' | 'course' | 'system' | 'announcement';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface EnrollmentItem {
  _id: string;
  course: Course;
  enrolledAt: string;
  completionStatus: 'in-progress' | 'completed';
  completionPercentage: number;
  completedLessonsCount: number;
}
