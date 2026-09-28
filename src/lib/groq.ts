const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SUPPORTED_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

export async function generateChatCompletion(messages: { role: string; content: string }[]) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
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
        const errorData = await response.json();
        console.error(`[Groq API] Error with ${model}:`, errorData);
        lastError = new Error(errorData.error?.message || `Failed to generate completion from Groq using ${model}`);
        continue; // Try next model fallback
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error(`Groq API Error with ${model}:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error('Failed to generate completion from Groq using all fallback models');
}
