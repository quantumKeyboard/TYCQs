
export type Subject = "ETI" | "MGT";

export interface Chapter {
  id: string;
  title: string;
  subject: Subject;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  chapterId: string;
  options: Option[];
  explanation?: string; // Only for ETI
}

export interface UserProgress {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface UserAttempt {
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
}
