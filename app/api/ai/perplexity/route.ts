export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    if (!process.env.PERPLEXITY_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Perplexity API key not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Convert messages to Perplexity format
    const perplexityMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are an AI research assistant with access to real-time information. 
            Current context: ${context || 'No specific context provided'}
            
            Help the user with:
            - Research and fact-checking
            - Latest technology trends and updates
            - Documentation and API references
            - Troubleshooting with current information
            - Code examples with up-to-date best practices
            
            Provide accurate, current information with proper citations when possible.`
          },
          ...perplexityMessages
        ],
        temperature: 0.3,
        stream: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Perplexity API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request with Perplexity' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
