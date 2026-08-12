import { getAIClient, GENERATION_MODEL } from '@/lib/ai/client';
import type { DreamEntity } from '@/types/dream';

const EXTRACT_ENTITIES_PROMPT = `
You are an AI that extracts entities from dream content.
Extract the key entities mentioned in the dream. The entity types must be one of: 'person', 'place', 'object', 'emotion', 'animal', 'activity', 'symbol', 'theme'.
Return the result as a JSON array of objects with this structure:
[
  {
    "entity_type": "string",
    "entity_name": "string",
    "confidence": number // between 0 and 1
  }
]
`;

export async function extractDreamEntities(dreamContent: string, dreamId: string, userId: string): Promise<DreamEntity[]> {
  try {
    const ai = getAIClient();
    
    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: dreamContent,
      config: {
        systemInstruction: EXTRACT_ENTITIES_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('AI returned an empty response.');
    }

    const entities: Array<{ entity_type: string, entity_name: string, confidence: number }> = JSON.parse(responseText);
    
    const timestamp = new Date().toISOString();
    return entities.map(entity => ({
      id: crypto.randomUUID(),
      dream_id: dreamId,
      user_id: userId,
      entity_type: entity.entity_type as DreamEntity['entity_type'],
      entity_name: entity.entity_name,
      confidence: entity.confidence,
      created_at: timestamp,
    }));
  } catch (error) {
    console.error('Error in extractDreamEntities:', error);
    throw new Error('Failed to extract entities from dream.');
  }
}
