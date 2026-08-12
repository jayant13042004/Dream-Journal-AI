import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatWithDreamHistory } from '@/lib/ai/chat';

// POST /api/ai/chat - Chat with dream history
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch user's dream history for context
    const { data: dreams } = await supabase
      .from('dreams')
      .select('id, title, content, dream_date, mood, ai_themes, ai_summary')
      .eq('user_id', user.id)
      .order('dream_date', { ascending: false })
      .limit(50);

    const dreamContext = (dreams || []).map(d => ({
      id: d.id,
      title: d.title,
      content: d.content.substring(0, 500), // Truncate for context window
      date: d.dream_date,
      mood: d.mood || 'unknown',
      themes: d.ai_themes || [],
      summary: d.ai_summary || '',
    }));

    const result = await chatWithDreamHistory(
      message,
      dreamContext,
      conversationHistory || []
    );

    // Save messages to database
    await supabase.from('chat_messages').insert([
      {
        user_id: user.id,
        role: 'user',
        content: message,
        dream_references: [],
      },
      {
        user_id: user.id,
        role: 'assistant',
        content: result.response,
        dream_references: result.dreamReferences,
      },
    ]);

    return NextResponse.json({
      response: result.response,
      dreamReferences: result.dreamReferences,
    });
  } catch (error) {
    console.error('Chat error:', error);
    const message = error instanceof Error ? error.message : 'Chat failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
