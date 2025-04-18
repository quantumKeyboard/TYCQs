export interface Chapter {
  chapterId: string;
  title: string;
  description: string;
  questions: Question[];
  learningObjectives?: string[]; // For MGT chapters
}

export interface Question {
  id: string;
  chapterId: string;
  text: string;
  options: Option[];
  explanation?: string; // For ETI questions
  tags?: string[]; // For ETI questions
  category?: string; // For MGT questions
  difficulty?: 'basic' | 'intermediate' | 'advanced'; // For MGT questions
} 