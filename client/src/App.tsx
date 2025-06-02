import React, { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DemoAuthProvider, useDemoAuth } from "./contexts/DemoAuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatPageWithAuth } from "./pages/ChatPageWithAuth";
import { LoginModal } from "./components/LoginModal";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

function DemoModeContent() {
  const { user, loading, signInWithGoogle } = useDemoAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fas fa-robot text-white text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading XGpt...
          </h3>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-robot text-white text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to XGpt Demo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Experience the full XGpt features in demo mode while Firebase authentication is being configured.
          </p>
          <Button 
            onClick={signInWithGoogle}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg"
          >
            Start Demo Session
          </Button>
        </div>
      </div>
    );
  }

  return <ChatPageWithAuth />;
}

function FirebaseContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="fas fa-robot text-white text-xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Loading XGpt...
          </h3>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? <ChatPageWithAuth /> : <LoginModal />}
      <Toaster />
    </>
  );
}

function AppContent() {
  const [useDemoMode, setUseDemoMode] = useState(false);

  if (useDemoMode) {
    return (
      <DemoAuthProvider>
        <div className="relative">
          <DemoModeContent />
          <Button
            onClick={() => setUseDemoMode(false)}
            variant="outline"
            size="sm"
            className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800"
          >
            Switch to Firebase
          </Button>
        </div>
      </DemoAuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="relative">
        <FirebaseContent />
        <Button
          onClick={() => setUseDemoMode(true)}
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800"
        >
          Try Demo Mode
        </Button>
      </div>
    </AuthProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
