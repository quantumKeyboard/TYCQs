import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { ChevronLeft, User, BookOpen, Award } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, savedQuestions } = useUserData();

  // Calculate statistics
  const totalAttempts = progress.length;
  const correctAnswers = progress.filter(p => p.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-2"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Info Card */}
        <Card className="flashcard-container">
          <CardHeader className="flashcard-gradient text-white">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-6">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="h-16 w-16 rounded-full border-2 border-mcq-medium"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-mcq-lighter flex items-center justify-center">
                  <User className="h-8 w-8 text-mcq-darkest" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">{user?.displayName}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card className="flashcard-container">
          <CardHeader className="flashcard-gradient text-white">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-mcq-lighter/20 dark:bg-mcq-darker/20">
                <p className="text-sm text-muted-foreground">Questions Attempted</p>
                <p className="text-2xl font-semibold">{totalAttempts}</p>
              </div>
              <div className="p-4 rounded-lg bg-mcq-lighter/20 dark:bg-mcq-darker/20">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-semibold">{accuracy}%</p>
              </div>
              <div className="p-4 rounded-lg bg-mcq-lighter/20 dark:bg-mcq-darker/20">
                <p className="text-sm text-muted-foreground">Correct Answers</p>
                <p className="text-2xl font-semibold">{correctAnswers}</p>
              </div>
              <div className="p-4 rounded-lg bg-mcq-lighter/20 dark:bg-mcq-darker/20">
                <p className="text-sm text-muted-foreground">Saved Questions</p>
                <p className="text-2xl font-semibold">{savedQuestions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="md:col-span-2 flashcard-container">
          <CardHeader className="flashcard-gradient text-white">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {progress.length > 0 ? (
              <div className="space-y-4">
                {progress.slice(-5).reverse().map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-mcq-lighter/20 dark:bg-mcq-darker/20"
                  >
                    <div className="flex items-center gap-3">
                      {item.isCorrect ? (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                      <span className="text-sm">
                        {item.isCorrect ? 'Correctly answered' : 'Incorrectly answered'} a question
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No activity yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage; 