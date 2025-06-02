import { z } from "zod";

// Chat message schema
export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.enum(["user", "assistant"]),
  timestamp: z.number(),
  chatId: z.string(),
});

// Chat schema
export const chatSchema = z.object({
  id: z.string(),
  title: z.string(),
  userId: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  messageCount: z.number().default(0),
});

// OpenAI API request schema
export const openaiRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })),
  model: z.enum(["gpt-4o", "gpt-3.5-turbo"]).default("gpt-4o"),
  temperature: z.number().min(0).max(2).default(0.7),
  max_tokens: z.number().min(1).max(4000).default(1000),
});

// User schema for Firebase
export const userSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().optional(),
  createdAt: z.number(),
});

export type Message = z.infer<typeof messageSchema>;
export type Chat = z.infer<typeof chatSchema>;
export type OpenAIRequest = z.infer<typeof openaiRequestSchema>;
export type User = z.infer<typeof userSchema>;

export type InsertMessage = Omit<Message, "id">;
export type InsertChat = Omit<Chat, "id" | "createdAt" | "updatedAt">;
