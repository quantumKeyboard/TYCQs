import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Index from "./pages/Index";
import ChaptersPage from "./pages/ChaptersPage";
import QuizPage from "./pages/QuizPage";
import LoginPage from "./pages/LoginPage";
import { SavedQuestionsPage } from "./pages/SavedQuestionsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import { StrictMode } from "react";
import AdminPanel from '@/pages/AdminPanel';

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-background">
                  <Header />
                  <div className="flex-1">
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      
                      <Route path="/" element={<Index />} />
                      
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/chapters/:subject" element={
                        <ProtectedRoute>
                          <ChaptersPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/quiz/:chapterId" element={
                        <ProtectedRoute>
                          <QuizPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/saved-questions" element={
                        <ProtectedRoute>
                          <SavedQuestionsPage />
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } />
                      
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute requireAdmin>
                            <AdminPanel />
                          </ProtectedRoute>
                        }
                      />
                      
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;
