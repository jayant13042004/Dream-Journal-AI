import {
  getAIClient,
  GENERATION_MODELS,
  shouldFallbackToNextModel,
} from '@/lib/ai/client';
import type { DreamEntity } from '@/types/dream';

const EXTRACT_ENTITIES_PROMPT = `
You are an AI that extracts entities from dream content.
Extract the key entities mentioned in the dream. The entity types must be one of: 'person', 'place', 'object', 'emotion', 'animal', 'activity', 'symbol', 'theme'.
Return the result as a JSON array of objects with this structure:
[
  {
    "entity_type": "string",
    "entity_name": "string",
    "confidence": number
  }
]
`;

export async function extractDreamEntities(
  dreamContent: string,
  dreamId: string,
  userId: string
): Promise<DreamEntity[]> {
  try {
    const ai = getAIClient();

    let response: Awaited<
      ReturnType<typeof ai.models.generateContent>
    > | null = null;

    for (const model of GENERATION_MODELS) {
      try {
        console.log(`Trying Gemini model for entity extraction: ${model}`);

        response = await ai.models.generateContent({
          model,
          contents: dreamContent,
          config: {
            systemInstruction: EXTRACT_ENTITIES_PROMPT,
            responseMimeType: 'application/json',
          },
        });

        console.log(`Entity extraction succeeded with: ${model}`);
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

    // Isolate actual JSON array starting from first '[' and ending at last ']'
    const startIdx = cleanedText.indexOf('[');
    const endIdx = cleanedText.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      cleanedText = cleanedText.substring(startIdx, endIdx + 1);
    }

    const entities: Array<{
      entity_type: string;
      entity_name: string;
      confidence: number;
    }> = JSON.parse(cleanedText);

    const timestamp = new Date().toISOString();

    return entities.map((entity) => ({
      id: crypto.randomUUID(),
      dream_id: dreamId,
      user_id: userId,
      entity_type:
        entity.entity_type as DreamEntity['entity_type'],
      entity_name: entity.entity_name,
      confidence: entity.confidence,
      created_at: timestamp,
    }));
  } catch (error) {
    console.error('Error in extractDreamEntities:', error);
    throw new Error('Failed to extract entities from dream.');
  }
}