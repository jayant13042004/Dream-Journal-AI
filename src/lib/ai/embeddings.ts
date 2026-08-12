import { getAIClient, EMBEDDING_MODEL } from '@/lib/ai/client';

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const ai = getAIClient();
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: {
        outputDimensionality: 768
      }
    });

    const embeddings = response.embeddings;
    if (!embeddings || embeddings.length === 0 || !embeddings[0].values) {
      throw new Error('No embedding values returned');
    }

    return embeddings[0].values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding.');
  }
}
