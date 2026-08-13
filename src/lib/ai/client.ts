import { GoogleGenAI } from '@google/genai';

export const GENERATION_MODEL = 'gemini-3.5-flash-lite';
export const EMBEDDING_MODEL = 'gemini-embedding-001';

export function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from .env.local');
  }

  console.log('Gemini API key loaded:', apiKey.slice(0, 3) + '...');

  return new GoogleGenAI({
    apiKey,
    vertexai: false,
  });
}