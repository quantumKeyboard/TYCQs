
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Home } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-mcq-darkest border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-2 text-mcq-darkest dark:text-white"
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5 mr-1" />
            <span className="font-bold">MCQ Quiz</span>
          </Button>
        </div>
        
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
