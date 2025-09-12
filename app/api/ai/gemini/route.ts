import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `You are an AI coding assistant integrated into a Cursor-like IDE. 
      Current context: ${context || 'No specific context provided'}
      
      Help the user with:
      - Code generation and suggestions
      - Debugging and error fixing
      - Code explanations and documentation
      - Best practices and optimization
      - Architecture and design patterns
      
      Provide clear, actionable responses with code examples when relevant.`,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Gemini API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request with Gemini' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
