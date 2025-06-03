import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { openaiRequestSchema } from "@shared/schema";
import { z } from "zod";

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // OpenAI Chat Completion endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const body = openaiRequestSchema.parse(req.body);
      
      if (!process.env.VITE_OPENAI_API_KEY) {
        return res.status(500).json({ 
          error: "OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables." 
        });
      }

      const completion = await openai.chat.completions.create({
        model: body.model,
        messages: body.messages,
        temperature: body.temperature,
        max_tokens: body.max_tokens,
        stream: false,
      });

      const response = completion.choices[0]?.message;
      
      if (!response) {
        return res.status(500).json({ error: "No response from OpenAI" });
      }

      res.json({ 
        content: response.content,
        role: response.role,
        usage: completion.usage 
      });

    } catch (error: any) {
      console.error("OpenAI API Error:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid request format",
          details: error.errors 
        });
      }
      
      if (error.status === 401) {
        return res.status(401).json({ 
          error: "Invalid OpenAI API key. Please check your API key configuration." 
        });
      }
      
      if (error.status === 429) {
        return res.status(429).json({ 
          error: "Rate limit exceeded. Please try again later." 
        });
      }
      
      res.status(500).json({ 
        error: "Failed to get response from OpenAI",
        message: error.message 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: Date.now(),
      openaiConfigured: !!(process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY)
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
