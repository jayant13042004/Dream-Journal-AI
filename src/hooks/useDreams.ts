'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Dream, CreateDreamInput, UpdateDreamInput } from '@/types/dream';

export function useDreams() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchDreams = useCallback(async (options?: {
    page?: number;
    limit?: number;
    mood?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options?.page) params.set('page', String(options.page));
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.mood) params.set('mood', options.mood);
      if (options?.search) params.set('search', options.search);
      if (options?.sortBy) params.set('sortBy', options.sortBy);
      if (options?.sortOrder) params.set('sortOrder', options.sortOrder);
      if (options?.startDate) params.set('startDate', options.startDate);
      if (options?.endDate) params.set('endDate', options.endDate);

      const res = await fetch(`/api/dreams?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch dreams');
      const data = await res.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dreams';
      setError(message);
      return { dreams: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDream = useCallback(async (id: string): Promise<Dream | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dreams/${id}`);
      if (!res.ok) throw new Error('Dream not found');
      const data = await res.json();
      return data.dream;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dream';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDream = useCallback(async (input: CreateDreamInput & { tags?: string[] }): Promise<Dream | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create dream');
      }
      const data = await res.json();
      return data.dream;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create dream';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDream = useCallback(async (id: string, input: UpdateDreamInput & { tags?: string[] }): Promise<Dream | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dreams/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Failed to update dream');
      const data = await res.json();
      return data.dream;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update dream';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDream = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/dreams/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete dream');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete dream';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeDream = useCallback(async (dreamId: string, content: string, dreamDate: string, mood: string, lucidity: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamId, content, dream_date: dreamDate, mood, lucidity }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Analysis failed');
      }
      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchDreams = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dreams/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error('Search failed');
      return await res.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      return { results: [], total: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchDreams,
    fetchDream,
    createDream,
    updateDream,
    deleteDream,
    analyzeDream,
    searchDreams,
  };
}
