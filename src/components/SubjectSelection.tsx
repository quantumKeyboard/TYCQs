
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Briefcase } from "lucide-react";

const SubjectSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-10 text-mcq-darkest">MCQ Quiz Application</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="card-shadow border-2 border-mcq-lightest hover:border-mcq-medium transition-all">
          <CardHeader className="mcq-gradient text-white rounded-t-md">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2" />
              ETI
            </CardTitle>
            <CardDescription className="text-mcq-lightest">
              Emerging Trends in IT
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>
              Study questions related to Artificial Intelligence, Internet of Things,
              Digital Forensics, Hacking, and more.
            </p>
            <ul className="list-disc list-inside mt-3 text-muted-foreground">
              <li>6 Units of study material</li>
              <li>Multiple choice questions</li>
              <li>Detailed explanations</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-mcq-medium hover:bg-mcq-darker"
              onClick={() => navigate("/chapters/ETI")}
            >
              Start ETI
            </Button>
          </CardFooter>
        </Card>

        <Card className="card-shadow border-2 border-mcq-lightest hover:border-mcq-medium transition-all">
          <CardHeader className="mcq-gradient text-white rounded-t-md">
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2" />
              MGT
            </CardTitle>
            <CardDescription className="text-mcq-lightest">
              Management
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>
              Study questions related to Management concepts, Planning, Organizing,
              Safety Management, and Legislative Acts.
            </p>
            <ul className="list-disc list-inside mt-3 text-muted-foreground">
              <li>5 Units of study material</li>
              <li>Multiple choice questions</li>
              <li>Practical scenarios</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-mcq-medium hover:bg-mcq-darker"
              onClick={() => navigate("/chapters/MGT")}
            >
              Start MGT
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SubjectSelection;
