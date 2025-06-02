import { Chat, Message } from "@shared/schema";

export class LocalChatStorage {
  private getStorageKey(userId: string, type: 'chats' | 'messages', chatId?: string): string {
    if (type === 'chats') {
      return `xgpt_${userId}_chats`;
    }
    return `xgpt_${userId}_chat_${chatId}_messages`;
  }

  async getChats(userId: string): Promise<Chat[]> {
    const key = this.getStorageKey(userId, 'chats');
    const chatsJson = localStorage.getItem(key);
    if (!chatsJson) return [];
    
    try {
      const chats = JSON.parse(chatsJson);
      return chats.sort((a: Chat, b: Chat) => b.updatedAt - a.updatedAt);
    } catch {
      return [];
    }
  }

  async saveChat(userId: string, chat: Chat): Promise<void> {
    const key = this.getStorageKey(userId, 'chats');
    const chats = await this.getChats(userId);
    const existingIndex = chats.findIndex(c => c.id === chat.id);
    
    if (existingIndex >= 0) {
      chats[existingIndex] = chat;
    } else {
      chats.push(chat);
    }
    
    localStorage.setItem(key, JSON.stringify(chats));
  }

  async deleteChat(userId: string, chatId: string): Promise<void> {
    const chatsKey = this.getStorageKey(userId, 'chats');
    const messagesKey = this.getStorageKey(userId, 'messages', chatId);
    
    const chats = await this.getChats(userId);
    const filteredChats = chats.filter(c => c.id !== chatId);
    
    localStorage.setItem(chatsKey, JSON.stringify(filteredChats));
    localStorage.removeItem(messagesKey);
  }

  async getMessages(userId: string, chatId: string): Promise<Message[]> {
    const key = this.getStorageKey(userId, 'messages', chatId);
    const messagesJson = localStorage.getItem(key);
    if (!messagesJson) return [];
    
    try {
      const messages = JSON.parse(messagesJson);
      return messages.sort((a: Message, b: Message) => a.timestamp - b.timestamp);
    } catch {
      return [];
    }
  }

  async saveMessage(userId: string, message: Message): Promise<void> {
    const key = this.getStorageKey(userId, 'messages', message.chatId);
    const messages = await this.getMessages(userId, message.chatId);
    messages.push(message);
    localStorage.setItem(key, JSON.stringify(messages));
  }

  async generateId(): Promise<string> {
    return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const localChatStorage = new LocalChatStorage();