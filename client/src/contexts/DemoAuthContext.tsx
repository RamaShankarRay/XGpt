import React, { createContext, useContext, useEffect, useState } from "react";

interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

interface DemoAuthContextType {
  user: DemoUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (context === undefined) {
    throw new Error("useDemoAuth must be used within a DemoAuthProvider");
  }
  return context;
};

export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user was previously signed in
    const savedUser = localStorage.getItem("demo-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    // Simulate Google sign-in with demo user
    const demoUser: DemoUser = {
      uid: "demo-user-123",
      email: "demo@xgpt.com",
      displayName: "Demo User",
      photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
    };
    
    setUser(demoUser);
    localStorage.setItem("demo-user", JSON.stringify(demoUser));
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("demo-user");
    localStorage.removeItem("demo-chats");
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
};