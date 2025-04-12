
import React from "react";
import ChapterSelection from "@/components/ChapterSelection";
import { BookOpenCheck } from "lucide-react";

const ChaptersPage: React.FC = () => {
  return (
    <div className="min-h-screen pb-10">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <BookOpenCheck className="mx-auto h-12 w-12 text-mcq-darkest dark:text-mcq-light mb-3" />
          <h1 className="text-2xl font-bold text-mcq-darkest dark:text-white mb-2">
            Select a Chapter
          </h1>
          <p className="text-muted-foreground">
            Choose a chapter to practice questions from that specific topic.
          </p>
        </div>
        
        <ChapterSelection />
      </div>
    </div>
  );
};

export default ChaptersPage;
