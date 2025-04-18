import React from "react";
import { SavedQuestions } from "@/components/SavedQuestions";

export const SavedQuestionsPage: React.FC = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Saved Questions</h1>
      <SavedQuestions />
    </div>
  );
}; 