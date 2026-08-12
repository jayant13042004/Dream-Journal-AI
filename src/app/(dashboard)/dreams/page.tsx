'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DreamFilters, DreamFiltersState } from '@/components/dreams/DreamFilters';
import { DreamList } from '@/components/dreams/DreamList';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Plus, BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Dream } from '@/types/dream';
import { useAuth } from '@/hooks/useAuth';

function DreamsListContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [filters, setFilters] = useState<DreamFiltersState>({
    search: searchParams.get('search') || '',
    mood: searchParams.get('mood') || null,
    startDate: searchParams.get('startDate') || null,
    endDate: searchParams.get('endDate') || null,
    sort: (searchParams.get('sort') as 'newest' | 'oldest' | 'a-z') || 'newest',
  });

  const [dreams, setDreams] = useState<Dream[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters.search]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (filters.mood) params.set('mood', filters.mood);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [debouncedSearch, filters.mood, filters.startDate, filters.endDate, filters.sort, router]);

  // Fetch dreams
  const fetchDreams = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('dreams')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (debouncedSearch) {
        query = query.or(`title.ilike.%${debouncedSearch}%,content.ilike.%${debouncedSearch}%`);
      }
      if (filters.mood) {
        query = query.eq('mood', filters.mood);
      }
      if (filters.startDate) {
        query = query.gte('dream_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('dream_date', filters.endDate);
      }

      switch (filters.sort) {
        case 'oldest':
          query = query.order('dream_date', { ascending: true });
          break;
        case 'a-z':
          query = query.order('title', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('dream_date', { ascending: false });
          break;
      }

      const { data, error, count } = await query.limit(20);

      if (error) throw error;
      setDreams(data as Dream[]);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching dreams:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, debouncedSearch, filters.mood, filters.startDate, filters.endDate, filters.sort, supabase]);

  useEffect(() => {
    if (!authLoading) {
      fetchDreams();
    }
  }, [fetchDreams, authLoading]);

  if (authLoading) {
    return <div className="p-8 text-center text-[var(--text-muted)]">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Dreams</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {totalCount} {totalCount === 1 ? 'dream' : 'dreams'} recorded
          </p>
        </div>
        <Button onClick={() => router.push('/dream/new')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Record Dream
        </Button>
      </div>

      <DreamFilters 
        filters={filters} 
        onFilterChange={setFilters} 
      />

      {dreams.length === 0 && !isLoading ? (
        <div className="mt-12">
          <EmptyState
            icon={BookOpen}
            title={debouncedSearch || filters.mood ? "No matching dreams" : "No dreams yet"}
            description={
              debouncedSearch || filters.mood 
                ? "Try adjusting your filters to find what you're looking for."
                : "Start tracking your subconscious adventures today."
            }
            action={
              !debouncedSearch && !filters.mood ? {
                label: "Record your first dream",
                onClick: () => router.push('/dream/new')
              } : undefined
            }
          />
        </div>
      ) : (
        <DreamList 
          dreams={dreams} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
}

export default function DreamsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--text-muted)]">Loading dreams...</div>}>
      <DreamsListContainer />
    </Suspense>
  );
}
