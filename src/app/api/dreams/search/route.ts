import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateEmbedding } from '@/lib/ai/embeddings';

// POST /api/dreams/search - Semantic + text search
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { query, limit = 10 } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Try semantic search first
    let semanticResults: Array<Record<string, unknown>> = [];
    try {
      const embedding = await generateEmbedding(query);
      const { data } = await supabase.rpc('match_dreams', {
        query_embedding: JSON.stringify(embedding),
        match_threshold: 0.3,
        match_count: limit,
        p_user_id: user.id,
      });
      semanticResults = data || [];
    } catch (embeddingError) {
      console.error('Semantic search failed, falling back to text search:', embeddingError);
    }

    // Also do text search as fallback/supplement
    const { data: textResults } = await supabase
      .from('dreams')
      .select('id, title, content, dream_date, mood, ai_summary, ai_themes')
      .eq('user_id', user.id)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,ai_summary.ilike.%${query}%`)
      .order('dream_date', { ascending: false })
      .limit(limit);

    // Merge results, preferring semantic matches
    const seenIds = new Set<string>();
    const mergedResults: Array<Record<string, unknown>> = [];

    for (const result of semanticResults) {
      const id = result.id as string;
      if (!seenIds.has(id)) {
        seenIds.add(id);
        mergedResults.push({ ...result, matchType: 'semantic' });
      }
    }

    for (const result of (textResults || [])) {
      if (!seenIds.has(result.id)) {
        seenIds.add(result.id);
        mergedResults.push({ ...result, matchType: 'text', similarity: 0 });
      }
    }

    return NextResponse.json({
      results: mergedResults.slice(0, limit),
      total: mergedResults.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
