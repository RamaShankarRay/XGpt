import React, { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Chat, Message } from "@shared/schema";
import { openaiService } from "@/lib/openai";
import { localChatStorage } from "@/lib/localChatStorage";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  orderBy, 
  query, 
  where,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Menu, Sun, Moon, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const ChatPageWithAuth: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"gpt-4o" | "gpt-3.5-turbo">("gpt-4o");
  const [useFirebase, setUseFirebase] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Load user's chats (Firebase or Local Storage)
  useEffect(() => {
    if (!user) return;

    if (useFirebase) {
      try {
        const chatsQuery = query(
          collection(db, "users", user.uid, "chats"),
          orderBy("updatedAt", "desc")
        );

        const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
          const userChats = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Chat[];
          setChats(userChats);
        }, (error) => {
          console.log("Firebase not configured, using local storage");
          setUseFirebase(false);
          loadLocalChats();
        });

        return unsubscribe;
      } catch (error) {
        console.log("Firebase not configured, using local storage");
        setUseFirebase(false);
        loadLocalChats();
      }
    } else {
      loadLocalChats();
    }
  }, [user, useFirebase]);

  const loadLocalChats = async () => {
    if (!user) return;
    try {
      const localChats = await localChatStorage.getChats(user.uid);
      setChats(localChats);
    } catch (error) {
      console.error("Error loading local chats:", error);
    }
  };

  // Load messages for current chat (Firebase or Local Storage)
  useEffect(() => {
    if (!user || !currentChat) {
      setMessages([]);
      return;
    }

    if (useFirebase) {
      try {
        const messagesQuery = query(
          collection(db, "users", user.uid, "chats", currentChat.id, "messages"),
          orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const chatMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Message[];
          setMessages(chatMessages);
        }, (error) => {
          console.log("Loading messages from local storage");
          loadLocalMessages();
        });

        return unsubscribe;
      } catch (error) {
        loadLocalMessages();
      }
    } else {
      loadLocalMessages();
    }
  }, [user, currentChat, useFirebase]);

  const loadLocalMessages = async () => {
    if (!user || !currentChat) return;
    try {
      const localMessages = await localChatStorage.getMessages(user.uid, currentChat.id);
      setMessages(localMessages);
    } catch (error) {
      console.error("Error loading local messages:", error);
    }
  };

  const createNewChat = async () => {
    if (!user) return;

    try {
      const chatId = await localChatStorage.generateId();
      const newChat: Chat = {
        id: chatId,
        title: "New Chat",
        userId: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messageCount: 0,
      };

      if (useFirebase) {
        try {
          const docRef = await addDoc(collection(db, "users", user.uid, "chats"), {
            title: newChat.title,
            userId: newChat.userId,
            createdAt: newChat.createdAt,
            updatedAt: newChat.updatedAt,
            messageCount: newChat.messageCount,
          });
          newChat.id = docRef.id;
        } catch (error) {
          console.log("Using local storage for new chat");
          setUseFirebase(false);
          await localChatStorage.saveChat(user.uid, newChat);
        }
      } else {
        await localChatStorage.saveChat(user.uid, newChat);
      }

      setCurrentChat(newChat);
      setIsSidebarOpen(false);
      
      toast({
        title: "New chat created",
        description: "Start a conversation!",
      });
    } catch (error) {
      console.error("Error creating chat:", error);
      toast({
        title: "Error",
        description: "Failed to create new chat",
        variant: "destructive",
      });
    }
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setIsSidebarOpen(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!user) return;

    try {
      if (useFirebase) {
        try {
          await deleteDoc(doc(db, "users", user.uid, "chats", chatId));
        } catch (error) {
          await localChatStorage.deleteChat(user.uid, chatId);
        }
      } else {
        await localChatStorage.deleteChat(user.uid, chatId);
      }
      
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
      
      toast({
        title: "Chat deleted",
        description: "Chat has been removed",
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
    }
  };

  const generateChatTitle = (firstMessage: string): string => {
    const words = firstMessage.split(" ").slice(0, 6);
    return words.join(" ") + (firstMessage.split(" ").length > 6 ? "..." : "");
  };

  const sendMessage = async (content: string) => {
    if (!user || !currentChat || isLoading) return;

    try {
      setIsLoading(true);
      setIsTyping(true);

      // Create user message
      const userMessageId = await localChatStorage.generateId();
      const userMessage: Message = {
        id: userMessageId,
        content,
        role: "user",
        timestamp: Date.now(),
        chatId: currentChat.id,
      };

      // Save user message
      if (useFirebase) {
        try {
          await addDoc(
            collection(db, "users", user.uid, "chats", currentChat.id, "messages"),
            {
              content: userMessage.content,
              role: userMessage.role,
              timestamp: userMessage.timestamp,
              chatId: userMessage.chatId,
            }
          );
        } catch (error) {
          await localChatStorage.saveMessage(user.uid, userMessage);
        }
      } else {
        await localChatStorage.saveMessage(user.uid, userMessage);
      }

      // Update chat title if this is the first message
      if (messages.length === 0) {
        const newTitle = generateChatTitle(content);
        const updatedChat = {
          ...currentChat,
          title: newTitle,
          updatedAt: Date.now(),
          messageCount: 1,
        };

        if (useFirebase) {
          try {
            await updateDoc(doc(db, "users", user.uid, "chats", currentChat.id), {
              title: newTitle,
              updatedAt: Date.now(),
              messageCount: 1,
            });
          } catch (error) {
            await localChatStorage.saveChat(user.uid, updatedChat);
          }
        } else {
          await localChatStorage.saveChat(user.uid, updatedChat);
        }
        
        setCurrentChat(updatedChat);
      }

      // Prepare messages for OpenAI
      const chatHistory = [
        ...messages,
        userMessage
      ].map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Get AI response
      const response = await openaiService.sendMessage({
        messages: chatHistory,
        model: selectedModel,
        temperature: 0.7,
        max_tokens: 1000,
      });

      setIsTyping(false);

      // Create AI message
      const aiMessageId = await localChatStorage.generateId();
      const aiMessage: Message = {
        id: aiMessageId,
        content: response.content,
        role: "assistant",
        timestamp: Date.now(),
        chatId: currentChat.id,
      };

      // Save AI message
      if (useFirebase) {
        try {
          await addDoc(
            collection(db, "users", user.uid, "chats", currentChat.id, "messages"),
            {
              content: aiMessage.content,
              role: aiMessage.role,
              timestamp: aiMessage.timestamp,
              chatId: aiMessage.chatId,
            }
          );
        } catch (error) {
          await localChatStorage.saveMessage(user.uid, aiMessage);
        }
      } else {
        await localChatStorage.saveMessage(user.uid, aiMessage);
      }

      // Update chat
      const finalUpdatedChat = {
        ...currentChat,
        updatedAt: Date.now(),
        messageCount: messages.length + 2,
      };

      if (useFirebase) {
        try {
          await updateDoc(doc(db, "users", user.uid, "chats", currentChat.id), {
            updatedAt: Date.now(),
            messageCount: messages.length + 2,
          });
        } catch (error) {
          await localChatStorage.saveChat(user.uid, finalUpdatedChat);
        }
      } else {
        await localChatStorage.saveChat(user.uid, finalUpdatedChat);
      }

    } catch (error: any) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    toast({
      title: "Copied to clipboard",
      description: "Message content copied successfully",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar
        chats={chats}
        currentChatId={currentChat?.id}
        onCreateNewChat={createNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {currentChat?.title || "XGpt"}
            </h2>
            {!useFirebase && (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded">
                Local Mode
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as "gpt-4o" | "gpt-3.5-turbo")}
              className="text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white"
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </header>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto bg-white dark:bg-gray-900"
        >
          <div className="max-w-4xl mx-auto p-4">
            {!currentChat ? (
              // Welcome Screen
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-robot text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to XGpt
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                  Ask me anything! I'm here to help you with coding, creative writing, analysis, and more.
                </p>
                <Button onClick={createNewChat} className="bg-primary hover:bg-primary-dark">
                  Start New Chat
                </Button>
              </div>
            ) : (
              // Chat Messages
              <div>
                {messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    userPhotoURL={user?.photoURL || undefined}
                    onCopy={handleCopy}
                  />
                ))}
                
                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        {currentChat && (
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={isTyping}
          />
        )}
      </div>
    </div>
  );
};