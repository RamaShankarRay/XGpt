import React from "react";
import { Message } from "@shared/schema";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/contexts/ThemeContext";

interface ChatBubbleProps {
  message: Message;
  userPhotoURL?: string;
  onCopy?: (content: string) => void;
  onRegenerate?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  userPhotoURL,
  onCopy,
  onRegenerate 
}) => {
  const { theme } = useTheme();
  const isUser = message.role === "user";
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit" 
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.(message.content);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}
    >
      <div className="max-w-3xl">
        <div className={`flex items-end space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
          {isUser ? (
            <Avatar className="w-8 h-8">
              <img 
                src={userPhotoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"} 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover"
              />
            </Avatar>
          ) : (
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <i className="fas fa-robot text-white text-xs"></i>
            </div>
          )}
          
          <div className={`${
            isUser 
              ? "bg-primary text-white rounded-2xl rounded-br-md" 
              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl rounded-bl-md"
          } px-6 py-4 shadow-sm`}>
            {isUser ? (
              <p className="text-sm leading-relaxed">{message.content}</p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={theme === "dark" ? oneDark : oneLight}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
            
            {!isUser && (
              <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCopy}
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Good
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  Bad
                </Button>
                {onRegenerate && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onRegenerate}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Regenerate
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${
          isUser ? "text-right" : "text-left"
        }`}>
          {timestamp}
        </div>
      </div>
    </motion.div>
  );
};
