import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Sun, Moon, Settings, LogOut, Trash2, MessageSquare, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Chat } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  chats: Chat[];
  currentChatId?: string;
  onCreateNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChatId,
  onCreateNewChat,
  onSelectChat,
  onDeleteChat,
  isOpen,
  onClose,
}) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:bg-gray-50 lg:dark:bg-gray-900 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 lg:h-full">
        {/* Desktop Sidebar Content */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">XGpt</h1>
            </div>
          </div>
          
          <Button
            onClick={onCreateNewChat}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* Desktop Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Recent Chats
          </h3>
          
          <div className="space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs">Start a conversation to see your chat history</p>
              </div>
            ) : (
              chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative"
                >
                  <div
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center justify-between cursor-pointer ${
                      currentChatId === chat.id 
                        ? "bg-gray-200 dark:bg-gray-700" 
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Desktop Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {user && (
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <Avatar className="w-10 h-10">
                <img 
                  src={user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"} 
                  alt="User Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed z-50 h-full lg:hidden"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">XGpt</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            onClick={onCreateNewChat}
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Recent Chats
          </h3>
          
          <div className="space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs">Start a conversation to see your chat history</p>
              </div>
            ) : (
              chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative"
                >
                  <div
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center justify-between cursor-pointer ${
                      currentChatId === chat.id 
                        ? "bg-gray-200 dark:bg-gray-700" 
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Theme Toggle and Settings */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* User Profile */}
          {user && (
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <Avatar className="w-10 h-10">
                <img 
                  src={user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"} 
                  alt="User Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};
