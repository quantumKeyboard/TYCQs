
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserAttempt, UserProgress } from "@/types";

interface AppContextType {
  userProgress: UserProgress[];
  addProgress: (progress: UserProgress) => void;
  currentAttempt: UserAttempt | null;
  setCurrentAttempt: React.Dispatch<React.SetStateAction<UserAttempt | null>>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available
  const [userProgress, setUserProgress] = useState<UserProgress[]>(() => {
    const saved = localStorage.getItem("userProgress");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentAttempt, setCurrentAttempt] = useState<UserAttempt | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Save to localStorage whenever userProgress changes
  useEffect(() => {
    localStorage.setItem("userProgress", JSON.stringify(userProgress));
  }, [userProgress]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Add a new progress entry
  const addProgress = (progress: UserProgress) => {
    setUserProgress((prev) => [...prev, progress]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        userProgress,
        addProgress,
        currentAttempt,
        setCurrentAttempt,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
