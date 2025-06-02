import { useEffect } from "react";

interface KeyboardShortcuts {
  onNewChat?: () => void;
  onToggleSidebar?: () => void;
  onToggleTheme?: () => void;
  onFocusInput?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K for new chat
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        shortcuts.onNewChat?.();
      }
      
      // Cmd/Ctrl + Shift + S for toggle sidebar
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        shortcuts.onToggleSidebar?.();
      }
      
      // Cmd/Ctrl + Shift + L for toggle theme
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        shortcuts.onToggleTheme?.();
      }
      
      // Forward slash to focus input
      if (event.key === '/' && event.target === document.body) {
        event.preventDefault();
        shortcuts.onFocusInput?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};