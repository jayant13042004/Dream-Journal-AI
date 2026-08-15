import {
  getAIClient,
  GENERATION_MODELS,
  shouldFallbackToNextModel,
} from '@/lib/ai/client';
import { PATTERN_ANALYSIS_PROMPT } from '@/lib/ai/prompts';
import type { PatternAnalysis } from '@/types/ai';

export async function analyzeDreamPatterns(
  dreams: Array<{
    title: string;
    content: string;
    date: string;
    mood: string;
    ai_themes?: string[];
    ai_emotions?: Array<{ name: string; percentage: number }>;
  }>
): Promise<PatternAnalysis> {
  try {
    const ai = getAIClient();

    const userMessage = JSON.stringify(dreams, null, 2);

    let response: Awaited<
      ReturnType<typeof ai.models.generateContent>
    > | null = null;

    for (const model of GENERATION_MODELS) {
      try {
        console.log(`Trying Gemini model for pattern analysis: ${model}`);

        response = await ai.models.generateContent({
          model,
          contents: userMessage,
          config: {
            systemInstruction: PATTERN_ANALYSIS_PROMPT,
            responseMimeType: 'application/json',
          },
        });

        console.log(`Pattern analysis succeeded with: ${model}`);
        break;
      } catch (error) {
        console.error(`Gemini model ${model} failed:`, error);

        if (!shouldFallbackToNextModel(error)) {
          throw error;
        }

        console.log(`Falling back from ${model} to the next model...`);
      }
    }

    if (!response) {
      throw new Error('All Gemini generation models failed.');
    }

    const responseText = response.text;

    if (!responseText) {
      throw new Error('AI returned an empty response.');
    }

    // Clean up response text to isolate JSON
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/i, '');
      cleanedText = cleanedText.replace(/\n?```$/i, '');
    }
    cleanedText = cleanedText.trim();

    // Isolate actual JSON object starting from first '{' and ending at last '}'
    const startIdx = cleanedText.indexOf('{');
    const endIdx = cleanedText.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleanedText = cleanedText.substring(startIdx, endIdx + 1);
    }

    const analysis: PatternAnalysis = JSON.parse(cleanedText);

    return analysis;
  } catch (error) {
    console.error('Error in analyzeDreamPatterns:', error);
    throw new Error('Failed to analyze dream patterns.');
  }
}