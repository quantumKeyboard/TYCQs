
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import QuizCard from "@/components/QuizCard";
import { getQuestionsByChapter, allChapters } from "@/data/mockData";
import { ChevronLeft } from "lucide-react";

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
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={() => navigate(`/chapters/${chapter?.subject}`)}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Chapters
        </Button>
        <h1 className="text-2xl font-bold text-mcq-darkest flex-1 text-center">
          {chapter?.title}
        </h1>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
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
