import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QuizCard from "@/components/QuizCard";
import { loadChapterById, getQuestionsByChapter } from "@/data/chapterLoader";
import { ChevronLeft, BookCopy, AlertCircle, Bookmark, BookmarkCheck, Home, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useUserData } from "@/hooks/useUserData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAppContext } from "@/contexts/AppContext";
import { Chapter, Question } from "@/types";
import { Input } from "@/components/ui/input";

interface QuizProgress {
  currentQuestionIndex: number;
  score: number;
  lastUpdated: number;
  answers: Record<string, string>;
  chapterId: string;
  userId?: string;
}

const QuizPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { user } = useAuth();
  const { progress, savedQuestions, updateProgress, saveQuestion, removeQuestion } = useUserData();
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Move currentQuestion declaration before useEffect hooks
  const currentQuestion = isSearching ? filteredQuestions[currentQuestionIndex] : questions[currentQuestionIndex];
  
  // Enhanced progress loading
  useEffect(() => {
    if (chapterId) {
      try {
        // Try to load from localStorage first
        const savedProgress = localStorage.getItem(`quiz_progress_${chapterId}`);
        if (savedProgress) {
          const progress: QuizProgress = JSON.parse(savedProgress);
          
          // Check if the progress belongs to the current user
          if (user && progress.userId && progress.userId !== user.uid) {
            // Clear progress if it belongs to a different user
            localStorage.removeItem(`quiz_progress_${chapterId}`);
            return;
          }
          
          // Restore progress if it's from the last 7 days (increased from 24 hours)
          if (Date.now() - progress.lastUpdated < 7 * 24 * 60 * 60 * 1000) {
            setCurrentQuestionIndex(progress.currentQuestionIndex);
            setScore(progress.score);
            setUserAnswers(progress.answers || {});
            
            // Sync with Firebase if user is logged in
            if (user && questions.length > 0) {
              Object.entries(progress.answers).forEach(([questionId, selectedOptionId]) => {
                const question = questions.find(q => q.id === questionId);
                if (question) {
                  const isCorrect = question.options.find(opt => opt.id === selectedOptionId)?.isCorrect || false;
                  updateProgress(questionId, isCorrect, chapterId, selectedOptionId).catch(console.error);
                }
              });
            }
            
            toast({
              title: "Progress Restored",
              description: "Your previous quiz progress has been restored.",
              variant: "default",
            });
          } else {
            // Clear old progress
            localStorage.removeItem(`quiz_progress_${chapterId}`);
          }
        }
      } catch (error) {
        console.error("Error loading saved progress:", error);
        // Clear potentially corrupted data
        if (chapterId) {
          localStorage.removeItem(`quiz_progress_${chapterId}`);
        }
      }
    }
  }, [chapterId, toast, user, questions, updateProgress]);

  // Enhanced progress saving
  useEffect(() => {
    if (chapterId && currentQuestion) {
      try {
        const progress: QuizProgress = {
          currentQuestionIndex,
          score,
          lastUpdated: Date.now(),
          answers: userAnswers,
          chapterId,
          userId: user?.uid
        };
        
        // Save to localStorage
        localStorage.setItem(`quiz_progress_${chapterId}`, JSON.stringify(progress));
        
        // Also save to sessionStorage for better tab closure handling
        sessionStorage.setItem(`quiz_progress_${chapterId}`, JSON.stringify(progress));
        
        // Sync with Firebase if user is logged in
        if (user) {
          const selectedOptionId = userAnswers[currentQuestion.id];
          if (selectedOptionId) {
            const isCorrect = currentQuestion.options.find(opt => opt.id === selectedOptionId)?.isCorrect || false;
            updateProgress(currentQuestion.id, isCorrect, chapterId, selectedOptionId).catch(console.error);
          }
        }
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  }, [chapterId, currentQuestionIndex, score, userAnswers, user, currentQuestion, updateProgress]);

  // Add window beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (chapterId && !showResults) {
        // Save current progress before unloading
        const progress: QuizProgress = {
          currentQuestionIndex,
          score,
          lastUpdated: Date.now(),
          answers: userAnswers,
          chapterId,
          userId: user?.uid
        };
        localStorage.setItem(`quiz_progress_${chapterId}`, JSON.stringify(progress));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [chapterId, currentQuestionIndex, score, userAnswers, user, showResults]);
  
  useEffect(() => {
    const loadChapterAndQuestions = async () => {
      if (!chapterId) return;
      
      setLoading(true);
      try {
        // Load chapter details
        const chapterData = await loadChapterById(chapterId);
        if (!chapterData) {
          toast({
            title: "Error",
            description: "Chapter not found",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        setChapter(chapterData);
        
        // Load questions for the chapter
        const chapterQuestions = await getQuestionsByChapter(chapterId);
        if (chapterQuestions.length === 0) {
          toast({
            title: "Error",
            description: "No questions found for this chapter",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
        setQuestions(chapterQuestions);
      } catch (error) {
        console.error("Error loading chapter and questions:", error);
        toast({
          title: "Error",
          description: "Failed to load chapter and questions",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    loadChapterAndQuestions();
  }, [chapterId, navigate, toast]);
  
  const handleAnswerSubmit = (isCorrect: boolean, selectedOptionId: string) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Save the user's answer
    if (currentQuestion) {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedOptionId
      }));
    }
  };

  const handleSaveQuestion = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save questions",
        variant: "destructive",
      });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isSaved = savedQuestions.some(q => q.questionId === currentQuestion.id);

    try {
      if (isSaved) {
        await removeQuestion(currentQuestion.id);
        toast({
          title: "Question removed",
          description: "Question has been removed from saved questions",
        });
      } else {
        await saveQuestion(currentQuestion.id);
        toast({
          title: "Question saved",
          description: "Question has been saved for later",
        });
      }
    } catch (error) {
      console.error("Error saving/removing question:", error);
      toast({
        title: "Error",
        description: "Failed to save/remove question. Please try again later.",
        variant: "destructive",
      });
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      // Clear progress when quiz is completed
      if (chapterId) {
        localStorage.removeItem(`quiz_progress_${chapterId}`);
      }
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Reset quiz progress
  const handleResetQuiz = () => {
    if (window.confirm("Are you sure you want to reset your progress? This will clear all your answers and progress for this chapter.")) {
      // Clear local storage
      if (chapterId) {
        localStorage.removeItem(`quiz_progress_${chapterId}`);
        sessionStorage.removeItem(`quiz_progress_${chapterId}`);
      }
      
      // Reset state
      setCurrentQuestionIndex(0);
      setScore(0);
      setUserAnswers({});
      setShowResults(false);
      
      // Clear Firebase progress if user is logged in
      if (user && chapterId) {
        questions.forEach(question => {
          updateProgress(question.id, false, chapterId, "").catch(console.error);
        });
      }
      
      toast({
        title: "Progress Reset",
        description: "Your quiz progress has been reset successfully.",
        variant: "default",
      });
    }
  };

  // Add search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredQuestions(questions);
      setIsSearching(false);
    } else {
      const filtered = questions.filter(question => 
        question.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.options.some(option => 
          option.text.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredQuestions(filtered);
      setIsSearching(true);
    }
  }, [searchQuery, questions]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading questions...</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Quiz Results</h2>
          <div className="text-center mb-6">
            <p className="text-lg mb-2">Your Score: {score} out of {questions.length}</p>
            <p className="text-lg mb-4">
              {Math.round((score / questions.length) * 100)}% correct
            </p>
            <Progress value={(score / questions.length) * 100} className="mb-4" />
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button onClick={handleResetQuiz}>
              <BookCopy className="h-4 w-4 mr-2" />
              Retry Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleResetQuiz}
            className="flex items-center gap-2"
          >
            Reset Progress
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {isSearching ? filteredQuestions.length : questions.length}
          </span>
          <span className="text-sm font-medium">
            Score: {score}
          </span>
        </div>
        <Progress value={(currentQuestionIndex / (isSearching ? filteredQuestions.length : questions.length)) * 100} />
      </div>

      {!showResults && !loading && (
        <div className="space-y-6">
          {searchQuery && (
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Found {filteredQuestions.length} questions matching "{searchQuery}"
              </p>
            </div>
          )}
          {currentQuestion && (
            <QuizCard
              question={currentQuestion}
              onAnswerSubmit={handleAnswerSubmit}
              userAnswer={userAnswers[currentQuestion.id]}
              isSaved={savedQuestions.some(q => q.questionId === currentQuestion.id)}
              onSaveQuestion={handleSaveQuestion}
              onNextQuestion={handleNextQuestion}
              onPreviousQuestion={handlePreviousQuestion}
              hasNext={currentQuestionIndex < (isSearching ? filteredQuestions.length : questions.length) - 1}
              hasPrevious={currentQuestionIndex > 0}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
