import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeDream } from '@/lib/ai/analyze-dream';
import { extractDreamEntities } from '@/lib/ai/extract-entities';
import { generateEmbedding } from '@/lib/ai/embeddings';

// POST /api/ai/analyze - Analyze a dream with AI
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dreamId, content, dream_date, mood, lucidity } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Dream content is required' }, { status: 400 });
    }

    // Fetch recent dreams for context (exclude current dream)
    const { data: recentDreams } = await supabase
      .from('dreams')
      .select('title, ai_summary, dream_date, ai_themes')
      .eq('user_id', user.id)
      .neq('id', dreamId || '')
      .order('dream_date', { ascending: false })
      .limit(10);

    const previousDreams = recentDreams
      ?.filter(d => d.ai_summary)
      .map(d => ({
        title: d.title,
        summary: d.ai_summary!,
        date: d.dream_date,
        themes: d.ai_themes || [],
      }));

    // Run AI analysis
    const analysis = await analyzeDream(
      content,
      dream_date || new Date().toISOString().split('T')[0],
      mood || 'neutral',
      lucidity || 'not_sure',
      previousDreams
    );

    // Extract entities
    let entities: Awaited<ReturnType<typeof extractDreamEntities>> = [];
    try {
      if (dreamId) {
        entities = await extractDreamEntities(content, dreamId, user.id);
      }
    } catch (entityError) {
      console.error('Entity extraction failed (non-critical):', entityError);
    }

    // Generate embedding for semantic search
    let embedding: number[] | null = null;
    try {
      embedding = await generateEmbedding(
        `${content}\n\nThemes: ${analysis.themes.join(', ')}\nEmotions: ${analysis.emotions.map(e => e.name).join(', ')}`
      );
    } catch (embeddingError) {
      console.error('Embedding generation failed (non-critical):', embeddingError);
    }

    // Update the dream with AI analysis
    if (dreamId) {
      const updatePayload: Record<string, unknown> = {
        ai_summary: analysis.summary,
        ai_analysis: analysis,
        ai_emotions: analysis.emotions,
        ai_symbols: analysis.key_elements,
        ai_themes: analysis.themes,
        updated_at: new Date().toISOString(),
      };

      if (embedding) {
        updatePayload.embedding = JSON.stringify(embedding);
      }

      await supabase
        .from('dreams')
        .update(updatePayload)
        .eq('id', dreamId)
        .eq('user_id', user.id);

      // Save entities
      if (entities.length > 0) {
        // Clear old entities first
        await supabase
          .from('dream_entities')
          .delete()
          .eq('dream_id', dreamId)
          .eq('user_id', user.id);

        await supabase
          .from('dream_entities')
          .insert(entities);
      }
    }

    return NextResponse.json({
      analysis,
      entities,
      embeddingGenerated: !!embedding,
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    const message = error instanceof Error ? error.message : 'AI analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
