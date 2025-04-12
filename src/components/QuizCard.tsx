
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronLeft, ChevronRight, Download, Save } from "lucide-react";
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
    if (!showAnswer) return "";
    
    const isCorrect = question.options.find(
      (opt) => opt.id === optionId
    )?.isCorrect;
    
    if (selectedOptionId === optionId) {
      return isCorrect 
        ? "bg-green-100 border-green-500 dark:bg-green-900/20 dark:border-green-500" 
        : "bg-red-100 border-red-500 dark:bg-red-900/20 dark:border-red-500";
    }
    
    if (isCorrect) {
      return "bg-green-100 border-green-500 dark:bg-green-900/20 dark:border-green-500";
    }
    
    return "";
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto card-shadow border-2 border-mcq-lightest animate-fade-in">
      <CardHeader className="mcq-gradient text-white rounded-t-md pb-4">
        <CardTitle className="text-xl">{question.text}</CardTitle>
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
              className={`flex items-center space-x-2 p-3 rounded-md border transition-colors ${getOptionClass(option.id)}`}
            >
              <RadioGroupItem 
                value={option.id} 
                id={option.id} 
                disabled={showAnswer}
              />
              <Label
                htmlFor={option.id}
                className="flex-1 cursor-pointer"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {showAnswer && question.explanation && (
          <div className="mt-6 p-4 bg-mcq-palest rounded-md border border-mcq-lighter animate-fade-in">
            <div className="flex items-start mb-2">
              <AlertCircle className="h-5 w-5 text-mcq-medium mr-2 mt-0.5" />
              <h3 className="font-semibold text-mcq-darkest">Explanation</h3>
            </div>
            <p className="text-sm">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPreviousQuestion}
            disabled={!hasPrevious}
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {showAnswer ? (
            <Button
              onClick={handleNext}
              disabled={!hasNext}
              size="sm"
              className="bg-mcq-medium hover:bg-mcq-darker"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              size="sm"
              className="bg-mcq-medium hover:bg-mcq-darker"
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
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleExportAsImage}
            title="Export as image"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
