import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookText, BookType, GraduationCap, LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, signIn } = useAuth();
  
  // Get the redirect path from location state
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);
  
  const handleLoginWithGoogle = async () => {
    try {
      await signIn();
      toast({
        title: "Success",
        description: "Successfully signed in with Google",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-16 w-16 text-mcq-darkest dark:text-mcq-light animate-pulse" />
          <h1 className="mt-6 text-4xl font-extrabold text-mcq-darkest dark:text-white">
            TYCQ's
          </h1>
          <p className="mt-2 text-mcq-dark dark:text-mcq-light">
            Test your knowledge with interactive quizzes
          </p>
        </div>
        
        <Card className="border-2 border-mcq-lighter dark:border-mcq-darker flashcard-container animate-fade-in">
          <CardHeader className="flashcard-gradient text-white">
            <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-white/80 text-center">
              Sign in to track your progress and continue learning
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 border rounded-md flashcard-gradient-light">
                  <BookOpen className="mx-auto h-6 w-6 text-mcq-darkest" />
                  <p className="mt-1 text-xs font-medium text-mcq-darker">Study MCQs</p>
                </div>
                <div className="p-3 border rounded-md flashcard-gradient-light">
                  <BookText className="mx-auto h-6 w-6 text-mcq-darkest" />
                  <p className="mt-1 text-xs font-medium text-mcq-darker">Track Progress</p>
                </div>
                <div className="p-3 border rounded-md flashcard-gradient-light">
                  <BookType className="mx-auto h-6 w-6 text-mcq-darkest" />
                  <p className="mt-1 text-xs font-medium text-mcq-darker">Master Subjects</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              className="w-full flashcard-gradient hover:opacity-90 transition-opacity"
              onClick={handleLoginWithGoogle}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 TYCQ's. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
