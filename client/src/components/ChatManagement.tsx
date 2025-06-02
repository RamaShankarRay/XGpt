import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit3, Trash2, Download, Share2 } from "lucide-react";
import { Chat } from "@shared/schema";

interface ChatManagementProps {
  chat: Chat;
  onRename: (chatId: string, newTitle: string) => void;
  onDelete: (chatId: string) => void;
  onExport?: (chatId: string) => void;
  onShare?: (chatId: string) => void;
}

export const ChatManagement: React.FC<ChatManagementProps> = ({
  chat,
  onRename,
  onDelete,
  onExport,
  onShare,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== chat.title) {
      onRename(chat.id, newTitle.trim());
    }
    setIsRenaming(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setNewTitle(chat.title);
      setIsRenaming(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Rename Chat */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1">
            <Edit3 className="w-3 h-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter new chat title"
              maxLength={100}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRenaming(false)}>
                Cancel
              </Button>
              <Button onClick={handleRename}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Chat */}
      {onExport && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1"
          onClick={() => onExport(chat.id)}
        >
          <Download className="w-3 h-3" />
        </Button>
      )}

      {/* Share Chat */}
      {onShare && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1"
          onClick={() => onShare(chat.id)}
        >
          <Share2 className="w-3 h-3" />
        </Button>
      )}

      {/* Delete Chat */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20">
            <Trash2 className="w-3 h-3 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{chat.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => onDelete(chat.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};