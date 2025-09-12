import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';

export type AIProvider = 'gemini' | 'perplexity';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  context?: string;
  provider: AIProvider;
}

export async function getAIResponse({ messages, context, provider }: AIRequest) {
  const systemPrompt = `You are an AI coding assistant integrated into a Cursor-like IDE. 
  Current context: ${context || 'No specific context provided'}
  
  Help the user with:
  - Code generation and suggestions
  - Debugging and error fixing
  - Code explanations and documentation
  - Best practices and optimization
  - Architecture and design patterns
  
  Provide clear, actionable responses with code examples when relevant.`;

  if (provider === 'gemini') {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    return streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: systemPrompt,
      temperature: 0.7,
    });
  }

  if (provider === 'perplexity') {
    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error('Perplexity API key not configured');
    }

    // For now, return a simple response since Perplexity integration is complex
    // In production, you'd implement proper Perplexity API integration
    throw new Error('Perplexity integration not yet implemented in lib/ai.ts');
  }

  throw new Error('Invalid AI provider');
}
