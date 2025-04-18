import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from './config';

export interface UserProgress {
  questionId: string;
  isCorrect: boolean;
  timestamp: number;
  chapterId: string;
  selectedOption: string;
}

export interface SavedQuestion {
  questionId: string;
  timestamp: number;
}

export async function saveUserProgress(userId: string, progress: UserProgress) {
  const userProgressRef = doc(db, 'userProgress', userId);
  const userProgressDoc = await getDoc(userProgressRef);

  try {
    if (userProgressDoc.exists()) {
      const existingProgress = userProgressDoc.data().progress || [];
      
      // Check if this question was already attempted
      const existingIndex = existingProgress.findIndex(
        (p: UserProgress) => p.questionId === progress.questionId
      );
      
      if (existingIndex !== -1) {
        // Update existing progress
        existingProgress[existingIndex] = progress;
      } else {
        // Add new progress
        existingProgress.push(progress);
      }
      
      await updateDoc(userProgressRef, {
        progress: existingProgress,
        lastUpdated: Date.now()
      });
    } else {
      await setDoc(userProgressRef, {
        progress: [progress],
        lastUpdated: Date.now()
      });
    }
  } catch (error) {
    console.error('Error saving user progress:', error);
    throw error;
  }
}

export async function saveUserProgressBatch(userId: string, progressArray: UserProgress[]) {
  const userProgressRef = doc(db, 'userProgress', userId);
  const userProgressDoc = await getDoc(userProgressRef);

  try {
    if (userProgressDoc.exists()) {
      const existingProgress = userProgressDoc.data().progress || [];
      
      // Create a map of existing progress by questionId for quick lookup
      const progressMap = new Map(
        existingProgress.map((p: UserProgress) => [p.questionId, p])
      );
      
      // Update or add new progress
      progressArray.forEach(progress => {
        progressMap.set(progress.questionId, progress);
      });
      
      await updateDoc(userProgressRef, {
        progress: Array.from(progressMap.values()),
        lastUpdated: Date.now()
      });
    } else {
      await setDoc(userProgressRef, {
        progress: progressArray,
        lastUpdated: Date.now()
      });
    }
  } catch (error) {
    console.error('Error saving user progress batch:', error);
    throw error;
  }
}

export async function saveQuestionForLater(userId: string, questionId: string) {
  const savedQuestionsRef = doc(db, 'savedQuestions', userId);
  const savedQuestionsDoc = await getDoc(savedQuestionsRef);

  const savedQuestion: SavedQuestion = {
    questionId,
    timestamp: Date.now()
  };

  if (savedQuestionsDoc.exists()) {
    await updateDoc(savedQuestionsRef, {
      questions: arrayUnion(savedQuestion)
    });
  } else {
    await setDoc(savedQuestionsRef, {
      questions: [savedQuestion]
    });
  }
}

export async function removeSavedQuestion(userId: string, questionId: string) {
  const savedQuestionsRef = doc(db, 'savedQuestions', userId);
  const savedQuestionsDoc = await getDoc(savedQuestionsRef);

  if (savedQuestionsDoc.exists()) {
    const data = savedQuestionsDoc.data();
    const questions = data.questions || [];
    const questionToRemove = questions.find((q: SavedQuestion) => q.questionId === questionId);

    if (questionToRemove) {
      await updateDoc(savedQuestionsRef, {
        questions: arrayRemove(questionToRemove)
      });
    }
  }
}

export async function getUserProgress(userId: string): Promise<UserProgress[]> {
  const userProgressRef = doc(db, 'userProgress', userId);
  const userProgressDoc = await getDoc(userProgressRef);

  if (userProgressDoc.exists()) {
    return userProgressDoc.data().progress || [];
  }
  return [];
}

export async function getUserProgressByChapter(userId: string, chapterId: string): Promise<UserProgress[]> {
  const userProgressRef = doc(db, 'userProgress', userId);
  const userProgressDoc = await getDoc(userProgressRef);

  if (userProgressDoc.exists()) {
    const allProgress = userProgressDoc.data().progress || [];
    return allProgress.filter((p: UserProgress) => p.chapterId === chapterId);
  }
  return [];
}

export async function getSavedQuestions(userId: string): Promise<SavedQuestion[]> {
  const savedQuestionsRef = doc(db, 'savedQuestions', userId);
  const savedQuestionsDoc = await getDoc(savedQuestionsRef);

  if (savedQuestionsDoc.exists()) {
    return savedQuestionsDoc.data().questions || [];
  }
  return [];
} 