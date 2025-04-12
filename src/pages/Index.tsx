
import React from "react";
import SubjectSelection from "@/components/SubjectSelection";
import { GraduationCap, BookOpen, BarChart3 } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen pb-10">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <GraduationCap className="mx-auto h-16 w-16 text-mcq-darkest dark:text-mcq-light mb-4" />
          <h1 className="text-3xl font-bold text-mcq-darkest dark:text-white mb-2">
            Welcome to MCQ Quiz
          </h1>
          <p className="text-muted-foreground">
            Select a subject below to start practicing with interactive flashcards.
            Master your knowledge with our comprehensive question bank.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          <div className="bg-white dark:bg-mcq-darkest rounded-lg p-6 shadow-md border border-mcq-lighter dark:border-mcq-darker animate-fade-in">
            <BookOpen className="h-10 w-10 text-mcq-medium dark:text-mcq-light mb-3" />
            <h3 className="font-bold text-mcq-darkest dark:text-white mb-2">Interactive Learning</h3>
            <p className="text-sm text-muted-foreground">
              Practice with our MCQ flashcards designed to test and enhance your knowledge.
            </p>
          </div>
          
          <div className="bg-white dark:bg-mcq-darkest rounded-lg p-6 shadow-md border border-mcq-lighter dark:border-mcq-darker animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <BarChart3 className="h-10 w-10 text-mcq-medium dark:text-mcq-light mb-3" />
            <h3 className="font-bold text-mcq-darkest dark:text-white mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your performance and see improvements as you continue to practice.
            </p>
          </div>
          
          <div className="bg-white dark:bg-mcq-darkest rounded-lg p-6 shadow-md border border-mcq-lighter dark:border-mcq-darker animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <GraduationCap className="h-10 w-10 text-mcq-medium dark:text-mcq-light mb-3" />
            <h3 className="font-bold text-mcq-darkest dark:text-white mb-2">Master Subjects</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive coverage of ETI and MGT subjects to help you excel in your studies.
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-center text-mcq-darkest dark:text-white mb-6">
            Choose a Subject to Begin
          </h2>
          <SubjectSelection />
        </div>
      </div>
    </div>
  );
};

export default Index;
