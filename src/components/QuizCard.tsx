
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, BookmarkPlus, CheckCircle2, ChevronLeft, ChevronRight, Download, HelpCircle, Save, XCircle } from "lucide-react";
import { Question } from "@/types";
import { useAppContext } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

interface QuizCardProps {
  question: Question;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  question,
  onNextQuestion,
  onPreviousQuestion,
  hasNext,
  hasPrevious,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const { addProgress, currentAttempt, setCurrentAttempt } = useAppContext();
  const { toast } = useToast();
  
  const handleSubmit = () => {
    if (!selectedOptionId) {
      toast({
        title: "Selection Required",
        description: "Please select an answer before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    const isCorrect = question.options.find(
      (opt) => opt.id === selectedOptionId
    )?.isCorrect || false;
    
    // Record the progress
    addProgress({
      questionId: question.id,
      selectedOption: selectedOptionId,
      isCorrect,
      timestamp: Date.now(),
    });
    
    // Update current attempt
    setCurrentAttempt({
      questionId: question.id,
      selectedOptionId,
      isCorrect,
    });
    
    // Show the answer explanation
    setShowAnswer(true);
    
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: isCorrect 
        ? "Great job! That's the right answer." 
        : "That's not correct. Review the explanation for more details.",
      variant: isCorrect ? "default" : "destructive",
    });
  };
  
  const handleNext = () => {
    setSelectedOptionId(null);
    setShowAnswer(false);
    setCurrentAttempt(null);
    onNextQuestion();
  };
  
  const handleSaveForLater = () => {
    // In a real app, this would save to a user's saved questions list
    toast({
      title: "Question Saved",
      description: "This question has been saved for later review.",
    });
  };
  
  const handleExportAsImage = () => {
    // In a real app, this would create and download an image of the card
    toast({
      title: "Export Feature",
      description: "This would export the question as an image in a real app.",
    });
  };
  
  // Determine which option is correct for highlighting after submission
  const getOptionClass = (optionId: string) => {
    if (!showAnswer) return "border-mcq-medium dark:border-mcq-dark hover:border-mcq-darker dark:hover:border-mcq-medium transition-colors";
    
    const isCorrect = question.options.find(
      (opt) => opt.id === optionId
    )?.isCorrect;
    
    if (selectedOptionId === optionId) {
      return isCorrect 
        ? "answer-correct" 
        : "answer-incorrect";
    }
    
    if (isCorrect) {
      return "answer-correct";
    }
    
    return "opacity-70";
  };

  // Get icon for option feedback
  const getOptionIcon = (optionId: string) => {
    if (!showAnswer) return null;
    
    const isCorrect = question.options.find(
      (opt) => opt.id === optionId
    )?.isCorrect;
    
    if (isCorrect) {
      return <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />;
    }
    
    if (selectedOptionId === optionId && !isCorrect) {
      return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    }
    
    return null;
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto flashcard-container border-mcq-lighter animate-fade-in">
      <CardHeader className="flashcard-gradient text-white pb-6 relative">
        <div className="absolute top-2 right-2 bg-white/20 rounded-full p-1 text-xs font-medium">
          {question.chapterId.split("-")[0].toUpperCase()}
        </div>
        <CardTitle className="text-xl">
          <div className="flex items-start">
            <HelpCircle className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-mcq-lighter" />
            <span>{question.text}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <RadioGroup
          value={selectedOptionId || ""}
          onValueChange={setSelectedOptionId}
          className="space-y-3"
          disabled={showAnswer}
        >
          {question.options.map((option) => (
            <div
              key={option.id}
              className={`flex items-center space-x-2 p-4 rounded-md border transition-all duration-300 ${getOptionClass(option.id)}`}
            >
              <RadioGroupItem 
                value={option.id} 
                id={option.id} 
                disabled={showAnswer}
                className="border-mcq-darker text-mcq-darkest"
              />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer flex items-center justify-between"
              >
                <span>{option.text}</span>
                {getOptionIcon(option.id)}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {showAnswer && question.explanation && (
          <div className="mt-6 p-5 bg-mcq-lighter/30 dark:bg-mcq-darker/20 rounded-md border border-mcq-light dark:border-mcq-dark animate-fade-in">
            <div className="flex items-start mb-3">
              <AlertCircle className="h-5 w-5 text-mcq-darkest dark:text-mcq-light mr-2 mt-0.5" />
              <h3 className="font-semibold text-mcq-darkest dark:text-mcq-light">Explanation</h3>
            </div>
            <p className="text-sm text-mcq-darkest dark:text-white/90">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-3 border-t border-mcq-lighter dark:border-mcq-darker pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPreviousQuestion}
            disabled={!hasPrevious}
            size="sm"
            className="bg-white dark:bg-mcq-darkest border-mcq-medium dark:border-mcq-dark"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {showAnswer ? (
            <Button
              onClick={handleNext}
              disabled={!hasNext}
              size="sm"
              className="bg-mcq-medium hover:bg-mcq-dark text-white"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="sm"
              className="bg-mcq-medium hover:bg-mcq-dark text-white"
            >
              Submit
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSaveForLater}
            title="Save for later"
            className="border-mcq-medium dark:border-mcq-dark"
          >
            <BookmarkPlus className="h-4 w-4 text-mcq-darkest dark:text-mcq-light" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleExportAsImage}
            title="Export as image"
            className="border-mcq-medium dark:border-mcq-dark"
          >
            <Download className="h-4 w-4 text-mcq-darkest dark:text-mcq-light" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
