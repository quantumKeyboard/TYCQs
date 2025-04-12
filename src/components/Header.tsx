
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Home, BookOpen, LogIn } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-mcq-darker border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="text-mcq-darkest dark:text-white mr-2"
            onClick={() => navigate("/")}
          >
            <BookOpen className="h-5 w-5 mr-2 text-mcq-darkest dark:text-mcq-light" />
            <span className="font-bold">MCQ Quiz</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/login")}
            className="text-mcq-darkest dark:text-white"
          >
            <LogIn className="h-4 w-4 mr-1" />
            Login
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="border-mcq-medium dark:border-mcq-dark bg-white/80 dark:bg-mcq-darkest/70"
          >
            {isDarkMode ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-mcq-lighter rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-mcq-darkest rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
