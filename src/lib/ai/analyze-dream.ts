import {
  getAIClient,
  GENERATION_MODELS,
  shouldFallbackToNextModel,
} from '@/lib/ai/client';
import { DREAM_ANALYSIS_PROMPT } from '@/lib/ai/prompts';
import type { DreamAnalysis } from '@/types/dream';

export async function analyzeDream(
  dreamContent: string,
  dreamDate: string,
  mood: string,
  lucidity: string,
  previousDreams?: Array<{
    title: string;
    summary: string;
    date: string;
    themes: string[];
  }>
): Promise<DreamAnalysis> {
  try {
    const ai = getAIClient();

    let userMessage = `Dream Date: ${dreamDate}\nMood: ${mood}\nLucidity: ${lucidity}\n\nDream Content:\n${dreamContent}`;

    if (previousDreams && previousDreams.length > 0) {
      userMessage +=
        '\n\nPrevious Dreams Context:\n' +
        JSON.stringify(previousDreams, null, 2);
    }

    let response: Awaited<
      ReturnType<typeof ai.models.generateContent>
    > | null = null;

    for (const model of GENERATION_MODELS) {
      try {
        console.log(`Trying Gemini model for dream analysis: ${model}`);

        response = await ai.models.generateContent({
          model,
          contents: userMessage,
          config: {
            systemInstruction: DREAM_ANALYSIS_PROMPT,
            responseMimeType: 'application/json',
          },
        });

        console.log(`Dream analysis succeeded with: ${model}`);
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

    const analysis: DreamAnalysis = JSON.parse(cleanedText);

    return analysis;
  } catch (error) {
    console.error('Error in analyzeDream:', error);
    throw new Error('Failed to analyze dream. Please try again.');
  }
}