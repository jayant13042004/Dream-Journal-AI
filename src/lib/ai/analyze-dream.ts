import { getAIClient, GENERATION_MODEL } from '@/lib/ai/client';
import { DREAM_ANALYSIS_PROMPT } from '@/lib/ai/prompts';
import type { DreamAnalysis } from '@/types/dream';

export async function analyzeDream(
  dreamContent: string,
  dreamDate: string,
  mood: string,
  lucidity: string,
  previousDreams?: Array<{ title: string; summary: string; date: string; themes: string[] }>
): Promise<DreamAnalysis> {
  try {
    const ai = getAIClient();
    
    let userMessage = `Dream Date: ${dreamDate}\nMood: ${mood}\nLucidity: ${lucidity}\n\nDream Content:\n${dreamContent}`;
    
    if (previousDreams && previousDreams.length > 0) {
      userMessage += '\n\nPrevious Dreams Context:\n' + JSON.stringify(previousDreams, null, 2);
    }

    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: userMessage,
      config: {
        systemInstruction: DREAM_ANALYSIS_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('AI returned an empty response.');
    }

    const analysis: DreamAnalysis = JSON.parse(responseText);
    return analysis;
  } catch (error) {
    console.error('Error in analyzeDream:', error);
    throw new Error('Failed to analyze dream. Please try again.');
  }
}
