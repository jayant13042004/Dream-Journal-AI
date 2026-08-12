import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/dreams - List user's dreams
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const mood = searchParams.get('mood');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'dream_date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const offset = (page - 1) * limit;

    let query = supabase
      .from('dreams')
      .select('*, dream_tags(tag)', { count: 'exact' })
      .eq('user_id', user.id);

    if (mood) {
      query = query.eq('mood', mood);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (startDate) {
      query = query.gte('dream_date', startDate);
    }

    if (endDate) {
      query = query.lte('dream_date', endDate);
    }

    const validSortColumns = ['dream_date', 'created_at', 'title', 'mood'];
    const column = validSortColumns.includes(sortBy) ? sortBy : 'dream_date';
    const ascending = sortOrder === 'asc';

    query = query
      .order(column, { ascending })
      .range(offset, offset + limit - 1);

    const { data: dreams, error, count } = await query;

    if (error) {
      console.error('Error fetching dreams:', error);
      return NextResponse.json({ error: 'Failed to fetch dreams' }, { status: 500 });
    }

    return NextResponse.json({
      dreams: dreams || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/dreams - Create a new dream
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, dream_date, date, mood, lucidity, tags } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Dream content is required' }, { status: 400 });
    }

    const finalDate = dream_date || date || new Date().toISOString().split('T')[0];

    // Create the dream
    const { data: dream, error } = await supabase
      .from('dreams')
      .insert({
        user_id: user.id,
        title: title || 'Untitled Dream',
        content: content.trim(),
        dream_date: finalDate,
        mood: mood || null,
        lucidity: lucidity || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dream:', error);
      return NextResponse.json({ error: 'Failed to create dream' }, { status: 500 });
    }

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagRecords = tags.map((tag: string) => ({
        dream_id: dream.id,
        user_id: user.id,
        tag: tag.trim(),
      }));

      await supabase.from('dream_tags').insert(tagRecords);
    }

    return NextResponse.json({ dream }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
