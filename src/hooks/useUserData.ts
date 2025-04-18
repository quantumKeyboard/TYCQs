import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserProgress, 
  getSavedQuestions, 
  saveUserProgress,
  saveUserProgressBatch,
  getUserProgressByChapter,
  saveQuestionForLater,
  removeSavedQuestion,
  UserProgress,
  SavedQuestion
} from '@/lib/firebase/services';

export function useUserData() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Load user data when component mounts or user changes
  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setProgress([]);
        setSavedQuestions([]);
        setLoading(false);
        return;
      }

      try {
        const [userProgress, userSavedQuestions] = await Promise.all([
          getUserProgress(user.uid),
          getSavedQuestions(user.uid)
        ]);

        setProgress(userProgress);
        setSavedQuestions(userSavedQuestions);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  // Enhanced progress update with batch support
  const updateProgress = useCallback(async (questionId: string, isCorrect: boolean, chapterId: string, selectedOption: string) => {
    if (!user) return;

    const newProgress: UserProgress = {
      questionId,
      isCorrect,
      timestamp: Date.now(),
      chapterId,
      selectedOption
    };

    try {
      await saveUserProgress(user.uid, newProgress);
      setProgress(prev => {
        const existingIndex = prev.findIndex(p => p.questionId === questionId);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = newProgress;
          return updated;
        }
        return [...prev, newProgress];
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }, [user]);

  // Batch update progress
  const updateProgressBatch = useCallback(async (progressArray: UserProgress[]) => {
    if (!user) return;

    try {
      await saveUserProgressBatch(user.uid, progressArray);
      setProgress(prev => {
        const progressMap = new Map(prev.map(p => [p.questionId, p]));
        progressArray.forEach(p => progressMap.set(p.questionId, p));
        return Array.from(progressMap.values());
      });
    } catch (error) {
      console.error('Error updating progress batch:', error);
      throw error;
    }
  }, [user]);

  // Get progress for a specific chapter
  const getChapterProgress = useCallback(async (chapterId: string) => {
    if (!user) return [];
    
    try {
      return await getUserProgressByChapter(user.uid, chapterId);
    } catch (error) {
      console.error('Error getting chapter progress:', error);
      return [];
    }
  }, [user]);

  const saveQuestion = async (questionId: string) => {
    if (!user) return;

    try {
      await saveQuestionForLater(user.uid, questionId);
      setSavedQuestions(prev => [
        ...prev,
        { questionId, timestamp: Date.now() }
      ]);
    } catch (error) {
      console.error('Error saving question:', error);
      throw error;
    }
  };

  const removeQuestion = async (questionId: string) => {
    if (!user) return;

    try {
      await removeSavedQuestion(user.uid, questionId);
      setSavedQuestions(prev => 
        prev.filter(q => q.questionId !== questionId)
      );
    } catch (error) {
      console.error('Error removing saved question:', error);
      throw error;
    }
  };

  return {
    progress,
    savedQuestions,
    loading,
    updateProgress,
    updateProgressBatch,
    getChapterProgress,
    saveQuestion,
    removeQuestion
  };
} 