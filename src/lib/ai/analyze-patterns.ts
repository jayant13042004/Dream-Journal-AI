import { getAIClient, GENERATION_MODEL } from '@/lib/ai/client';
import { PATTERN_ANALYSIS_PROMPT } from '@/lib/ai/prompts';
import type { PatternAnalysis } from '@/types/ai';

export async function analyzeDreamPatterns(
  dreams: Array<{ title: string; content: string; date: string; mood: string; ai_themes?: string[]; ai_emotions?: Array<{ name: string; percentage: number }> }>
): Promise<PatternAnalysis> {
  try {
    const ai = getAIClient();
    
    const userMessage = JSON.stringify(dreams, null, 2);

    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: userMessage,
      config: {
        systemInstruction: PATTERN_ANALYSIS_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('AI returned an empty response.');
    }

    const analysis: PatternAnalysis = JSON.parse(responseText);
    return analysis;
  } catch (error) {
    console.error('Error in analyzeDreamPatterns:', error);
    throw new Error('Failed to analyze dream patterns.');
  }
}
