import { Chapter, Question, Subject } from "@/types";

// Load chapters from the manifest file
export const loadChapters = async (): Promise<Chapter[]> => {
  try {
    const response = await fetch('/chapters/manifest.json');
    if (!response.ok) {
      console.error('Failed to load manifest file');
      return [];
    }
    const manifest = await response.json();
    return manifest.chapters || [];
  } catch (error) {
    console.error('Error loading chapters:', error);
    return [];
  }
};

// Load a specific chapter by ID
export const loadChapterById = async (chapterId: string): Promise<Chapter | null> => {
  try {
    const response = await fetch(`/chapters/${chapterId}.json`);
    if (!response.ok) {
      console.error(`Failed to load chapter ${chapterId}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading chapter ${chapterId}:`, error);
    return null;
  }
};

// Get chapters by subject
export const getChaptersBySubject = async (subject: Subject): Promise<Chapter[]> => {
  const chapters = await loadChapters();
  return chapters.filter(chapter => chapter.chapterId.startsWith(subject.toLowerCase() === 'eti' ? 'eti-' : 'mgt-'));
};

// Get questions by chapter
export const getQuestionsByChapter = async (chapterId: string): Promise<Question[]> => {
  const chapter = await loadChapterById(chapterId);
  if (!chapter) {
    return [];
  }
  return chapter.questions || [];
}; 