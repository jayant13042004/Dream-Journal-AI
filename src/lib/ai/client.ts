import { GoogleGenAI } from '@google/genai';

export const GENERATION_MODEL = 'gemini-2.5-flash';
export const EMBEDDING_MODEL = 'gemini-embedding-001';

export function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set.');
  }
  return new GoogleGenAI({ apiKey });
}
