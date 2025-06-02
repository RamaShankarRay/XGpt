import React from "react";
import { motion } from "framer-motion";

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex justify-start mb-6"
    >
      <div className="max-w-3xl">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-robot text-white text-xs"></i>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-6 py-4 shadow-sm">
            <div className="flex space-x-1">
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
