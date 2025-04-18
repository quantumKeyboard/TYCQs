import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Download, AlertCircle, ChevronDown, ChevronRight, X } from "lucide-react";
import { Question } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface CategorizedQuestions {
  [subject: string]: {
    [chapter: string]: Question[];
  };
}

export const SavedQuestions: React.FC = () => {
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
  const [categorizedQuestions, setCategorizedQuestions] = useState<CategorizedQuestions>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedQuestions();
  }, []);

  useEffect(() => {
    categorizeQuestions();
  }, [savedQuestions]);

  const loadSavedQuestions = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedQuestions') || '[]');
      console.log("Loaded saved questions:", saved);
      
      // Check if the saved questions have the expected structure
      if (saved.length > 0) {
        console.log("First question structure:", saved[0]);
        console.log("First question chapterId:", saved[0].chapterId);
      }
      
      setSavedQuestions(saved);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load saved questions",
        variant: "destructive",
      });
    }
  };

  const categorizeQuestions = () => {
    const categorized: CategorizedQuestions = {};
    
    console.log("Categorizing questions:", savedQuestions);
    
    savedQuestions.forEach(question => {
      // Check if the question has a chapterId property
      if (!question.chapterId) {
        console.log("Question without chapterId:", question);
        
        // Try to extract subject and chapter from the question ID if possible
        // This is a fallback for questions that might not have chapterId
        if (question.id && question.id.includes('-')) {
          const idParts = question.id.split('-');
          if (idParts.length >= 2) {
            const subject = idParts[0];
            const chapter = idParts[1];
            
            if (!categorized[subject]) {
              categorized[subject] = {};
            }
            if (!categorized[subject][chapter]) {
              categorized[subject][chapter] = [];
            }
            categorized[subject][chapter].push(question);
            return;
          }
        }
        
        // If no chapterId and can't extract from ID, categorize as uncategorized
        if (!categorized["uncategorized"]) {
          categorized["uncategorized"] = {};
        }
        if (!categorized["uncategorized"]["general"]) {
          categorized["uncategorized"]["general"] = [];
        }
        categorized["uncategorized"]["general"].push(question);
        return;
      }

      // Split the chapterId and handle potential invalid format
      const parts = question.chapterId.split('-');
      console.log("Split parts for question", question.id, ":", parts);
      
      if (parts.length < 2) {
        console.log("Invalid chapterId format for question", question.id);
        
        // Try to extract subject and chapter from the question ID if possible
        if (question.id && question.id.includes('-')) {
          const idParts = question.id.split('-');
          if (idParts.length >= 2) {
            const subject = idParts[0];
            const chapter = idParts[1];
            
            if (!categorized[subject]) {
              categorized[subject] = {};
            }
            if (!categorized[subject][chapter]) {
              categorized[subject][chapter] = [];
            }
            categorized[subject][chapter].push(question);
            return;
          }
        }
        
        // If can't extract from ID, categorize as uncategorized
        if (!categorized["uncategorized"]) {
          categorized["uncategorized"] = {};
        }
        if (!categorized["uncategorized"]["general"]) {
          categorized["uncategorized"]["general"] = [];
        }
        categorized["uncategorized"]["general"].push(question);
        return;
      }

      const [subject, chapter] = parts;
      console.log("Categorizing question", question.id, "under subject:", subject, "chapter:", chapter);
      
      if (!categorized[subject]) {
        categorized[subject] = {};
      }
      if (!categorized[subject][chapter]) {
        categorized[subject][chapter] = [];
      }
      categorized[subject][chapter].push(question);
    });
    
    console.log("Final categorized questions:", categorized);
    setCategorizedQuestions(categorized);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const removeQuestion = (questionId: string) => {
    try {
      const updatedQuestions = savedQuestions.filter(q => q.id !== questionId);
      localStorage.setItem('savedQuestions', JSON.stringify(updatedQuestions));
      setSavedQuestions(updatedQuestions);
      setSelectedQuestion(null);
      toast({
        title: "Question Removed",
        description: "The question has been removed from your saved list",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove the question",
        variant: "destructive",
      });
    }
  };

  const exportSavedQuestions = async () => {
    try {
      console.log("Starting PDF export...");
      const pdf = new jsPDF();
      let yOffset = 20;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      const lineHeight = 7;

      // Add title
      pdf.setFontSize(16);
      pdf.text("Saved Questions", margin, yOffset);
      yOffset += lineHeight * 2;

      // Group questions by subject and chapter
      Object.entries(categorizedQuestions).forEach(([subject, chapters]) => {
        // Add subject header
        pdf.setFontSize(14);
        pdf.text(subject.toUpperCase(), margin, yOffset);
        yOffset += lineHeight * 1.5;

        Object.entries(chapters).forEach(([chapter, questions]) => {
          // Add chapter header
          pdf.setFontSize(12);
          pdf.text(`Chapter ${chapter}`, margin + 10, yOffset);
          yOffset += lineHeight;

          questions.forEach((question, index) => {
            // Check if we need a new page
            if (yOffset > pageHeight - margin) {
              pdf.addPage();
              yOffset = margin;
            }

            // Add question
            pdf.setFontSize(11);
            const questionText = `${index + 1}. ${question.text}`;
            const splitQuestion = pdf.splitTextToSize(questionText, pdf.internal.pageSize.width - 2 * margin);
            pdf.text(splitQuestion, margin, yOffset);
            yOffset += lineHeight * splitQuestion.length;

            // Add options
            question.options.forEach((option, optIndex) => {
              const optionText = `${String.fromCharCode(65 + optIndex)}) ${option.text}`;
              const splitOption = pdf.splitTextToSize(optionText, pdf.internal.pageSize.width - 2 * margin);
              pdf.text(splitOption, margin + 10, yOffset);
              yOffset += lineHeight * splitOption.length;
            });

            // Add correct answer
            const correctOption = question.options.find(opt => opt.isCorrect);
            if (correctOption) {
              const correctAnswerText = `Correct Answer: ${String.fromCharCode(65 + question.options.indexOf(correctOption))}) ${correctOption.text}`;
              pdf.setTextColor(0, 128, 0);
              const splitCorrectAnswer = pdf.splitTextToSize(correctAnswerText, pdf.internal.pageSize.width - 2 * margin);
              pdf.text(splitCorrectAnswer, margin, yOffset);
              yOffset += lineHeight * splitCorrectAnswer.length;
              pdf.setTextColor(0, 0, 0);
            }

            // Add explanation if available
            if (question.explanation) {
              const explanationText = `Explanation: ${question.explanation}`;
              const splitExplanation = pdf.splitTextToSize(explanationText, pdf.internal.pageSize.width - 2 * margin);
              pdf.text(splitExplanation, margin, yOffset);
              yOffset += lineHeight * splitExplanation.length;
            }

            yOffset += lineHeight;
          });
        });
      });

      // Save the PDF
      console.log("Saving PDF...");
      pdf.save(`saved-questions-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Export Successful",
        description: "Your saved questions have been exported as PDF",
        variant: "default",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export saved questions as PDF",
        variant: "destructive",
      });
    }
  };

  if (savedQuestions.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            No Saved Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You haven't saved any questions yet. Questions you save will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Saved Questions ({savedQuestions.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={exportSavedQuestions}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(categorizedQuestions).map(([subject, chapters]) => (
            <Collapsible
              key={subject}
              open={expandedCategories.has(subject)}
              onOpenChange={() => toggleCategory(subject)}
            >
              <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-muted rounded-md">
                {expandedCategories.has(subject) ? (
                  <ChevronDown className="h-4 w-4 mr-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-2" />
                )}
                <span className="font-semibold capitalize">{subject}</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 space-y-2">
                {Object.entries(chapters).map(([chapter, questions]) => (
                  <div key={chapter} className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground capitalize">
                      Chapter {chapter}
                    </h3>
                    {questions.map((question) => (
                      <Card
                        key={question.id}
                        className="relative cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedQuestion(question)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium mb-2">{question.text}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeQuestion(question.id);
                              }}
                              className="text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuestion} onOpenChange={() => setSelectedQuestion(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Question:</h3>
                <p>{selectedQuestion.text}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Options:</h3>
                <div className="space-y-2">
                  {selectedQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-2 rounded ${
                        option.isCorrect
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-muted"
                      }`}
                    >
                      {option.text}
                      {option.isCorrect && (
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          (Correct Answer)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {selectedQuestion.explanation && (
                <div>
                  <h3 className="font-medium mb-2">Explanation:</h3>
                  <p className="text-muted-foreground">
                    {selectedQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 