import React from "react";
import SubjectSelection from "@/components/SubjectSelection";
import { GraduationCap } from "lucide-react";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen pb-10">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <GraduationCap className="mx-auto h-16 w-16 text-mcq-darkest dark:text-mcq-light mb-4" />
          <h1 className="text-3xl font-bold text-mcq-darkest dark:text-white mb-2">
            Welcome to TYCQ's
          </h1>
          <p className="text-muted-foreground">
            Select a subject below to start practicing with interactive flashcards.
            Master your knowledge with our comprehensive question bank.
          </p>
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
