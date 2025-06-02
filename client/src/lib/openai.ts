import { OpenAIRequest } from "@shared/schema";

export class OpenAIService {
  private baseUrl = "/api";

  async sendMessage(request: OpenAIRequest): Promise<{
    content: string;
    role: string;
    usage?: any;
  }> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get response from AI");
    }

    return response.json();
  }

  async healthCheck(): Promise<{
    status: string;
    timestamp: number;
    openaiConfigured: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/health`);
    
    if (!response.ok) {
      throw new Error("Health check failed");
    }

    return response.json();
  }
}

export const openaiService = new OpenAIService();
