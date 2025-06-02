import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

export const LoginModal: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (error: any) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
      >
        {/* XGpt Logo */}
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-robot text-white text-2xl"></i>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to XGpt
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sign in to start chatting with our advanced AI assistant
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <Button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-3"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FaGoogle className="text-red-500" />
          )}
          <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
        </Button>
        
        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </div>
      </motion.div>
    </div>
  );
};
