
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { getChaptersBySubject } from "@/data/mockData";
import { Subject } from "@/types";
import { useAppContext } from "@/contexts/AppContext";

const ChapterSelection: React.FC = () => {
  const { subject } = useParams<{ subject: Subject }>();
  const navigate = useNavigate();
  const { userProgress } = useAppContext();

  // If subject is not a valid Subject type, default to "ETI"
  const validSubject: Subject = subject === "ETI" || subject === "MGT" ? subject : "ETI";
  
  const chapters = getChaptersBySubject(validSubject);

  // Calculate completion percentage for each chapter
  const getCompletionPercentage = (chapterId: string) => {
    const completedQuestions = userProgress.filter(
      (progress) => progress.questionId.startsWith(chapterId)
    );
    // This is a simplified example, you'd need to know the total number of questions per chapter
    return Math.min(
      100,
      Math.round((completedQuestions.length / 3) * 100)
    );
  };

  return (
    <div className="container mx-auto py-10 animate-fade-in">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-mcq-darkest flex-1 text-center">
          {validSubject} Chapters
        </h1>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="card-shadow hover:border-mcq-medium transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-start">
                <BookOpen className="h-5 w-5 mr-2 mt-1 text-mcq-medium" />
                <span>{chapter.title.split(":")[0]}</span>
              </CardTitle>
              <CardDescription>
                {chapter.title.split(":")[1]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 bg-mcq-palest rounded overflow-hidden">
                <div
                  className="h-full bg-mcq-medium"
                  style={{ width: `${getCompletionPercentage(chapter.id)}%` }}
                ></div>
              </div>
              <p className="text-xs mt-1 text-right text-muted-foreground">
                {getCompletionPercentage(chapter.id)}% complete
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-mcq-medium hover:bg-mcq-darker"
                onClick={() => navigate(`/quiz/${chapter.id}`)}
              >
                Start Quiz
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChapterSelection;
