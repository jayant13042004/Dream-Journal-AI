import { getAIClient, GENERATION_MODEL } from '@/lib/ai/client';
import { CHAT_SYSTEM_PROMPT } from '@/lib/ai/prompts';

interface DreamContext {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
  themes: string[];
  summary: string;
}

export async function chatWithDreamHistory(
  userMessage: string,
  dreamContext: DreamContext[],
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ response: string; dreamReferences: string[] }> {
  try {
    const ai = getAIClient();
    
    const contextString = dreamContext.length > 0 
      ? 'Context (User Dreams):\n' + JSON.stringify(dreamContext, null, 2)
      : 'Context (User Dreams): No dreams available.';
      
    const systemMessage = `${CHAT_SYSTEM_PROMPT}\n\n${contextString}\n\nWhen you reply, additionally provide a JSON list of dream IDs referenced in your response at the very end of your message in the format: <references>["id1", "id2"]</references>.`;

    const contents = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const response = await ai.models.generateContent({
      model: GENERATION_MODEL,
      contents: contents,
      config: {
        systemInstruction: systemMessage,
      },
    });

    const responseText = response.text || '';
    
    let cleanResponse = responseText;
    let dreamReferences: string[] = [];
    
    const refMatch = responseText.match(/<references>(.*?)<\/references>/);
    if (refMatch) {
      cleanResponse = responseText.replace(/<references>.*?<\/references>/, '').trim();
      try {
        dreamReferences = JSON.parse(refMatch[1]);
      } catch (e) {
        // ignore JSON parse error for references
      }
    }

    return {
      response: cleanResponse,
      dreamReferences
    };
  } catch (error) {
    console.error('Error in chatWithDreamHistory:', error);
    throw new Error('Failed to respond to chat.');
  }
}
