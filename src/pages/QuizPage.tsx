
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QuizCard from "@/components/QuizCard";
import { getQuestionsByChapter, allChapters } from "@/data/mockData";
import { ChevronLeft, BookCopy, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const QuizPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Get questions for this chapter
  const questions = chapterId ? getQuestionsByChapter(chapterId) : [];
  
  // Find chapter to display title
  const chapter = allChapters.find(c => c.id === chapterId);
  
  // Check if there are questions
  useEffect(() => {
    if (questions.length === 0) {
      // Redirect if no questions or invalid chapter
      navigate("/");
    }
  }, [questions, navigate]);
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <AlertCircle className="h-12 w-12 text-mcq-medium mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading Questions...</h2>
        <p className="text-muted-foreground">Please wait while we prepare your quiz.</p>
      </div>
    );
  }
  
  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2 text-mcq-darkest dark:text-white"
            onClick={() => navigate(`/chapters/${chapter?.subject}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-mcq-darkest dark:text-white flex items-center">
            <BookCopy className="h-5 w-5 mr-2 text-mcq-medium dark:text-mcq-light" />
            {chapter?.title}
          </h1>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
      
      <div className="mb-6 max-w-3xl mx-auto">
        <Progress value={progressPercentage} className="h-2 bg-mcq-lightest dark:bg-mcq-darkest" />
      </div>
      
      <QuizCard
        question={questions[currentQuestionIndex]}
        onNextQuestion={handleNextQuestion}
        onPreviousQuestion={handlePreviousQuestion}
        hasNext={currentQuestionIndex < questions.length - 1}
        hasPrevious={currentQuestionIndex > 0}
      />
    </div>
  );
};

export default QuizPage;
