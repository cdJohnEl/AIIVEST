const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SUPPORTED_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-120b'];

const rawUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const BACKEND_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

export async function generateChatCompletion(messages: { role: string; content: string }[]) {
  // 1. Try secure backend proxy endpoint first (protects API keys from client exposure)
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.content) {
        return data.content;
      }
    }
  } catch (backendError) {
    console.warn('[Chat] Backend proxy not reachable, checking client fallback...', backendError);
  }

  // 2. Fallback to direct client-side Groq call if VITE_GROQ_API_KEY is configured
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
    throw new Error('Chat service is unavailable. Please check your backend server or configure GROQ_API_KEY.');
  }

  let lastError: Error | null = null;

  for (const model of SUPPORTED_MODELS) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[Groq API] Error with ${model} (${response.status}):`, errorData);
        const errorMessage = errorData.error?.message || `Failed to generate completion from Groq using ${model} (HTTP ${response.status})`;
        lastError = new Error(errorMessage);

        // If it's an authentication error (401), trying other models won't help
        if (response.status === 401) {
          throw lastError;
        }

        continue; // Try next model fallback
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content;
    } catch (error: any) {
      if (error?.message?.toLowerCase().includes('api key') || error?.message?.includes('401')) {
        throw error;
      }
      console.error(`Groq API Error with ${model}:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error('Failed to generate completion from Groq using all fallback models');
}
