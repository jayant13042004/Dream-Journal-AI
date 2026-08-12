'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Dream } from '@/types/dream';
import { Greeting } from '@/components/dashboard/Greeting';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentDreams } from '@/components/dashboard/RecentDreams';
import { PatternSnapshot } from '@/components/dashboard/PatternSnapshot';
import { AIInsight } from '@/components/dashboard/AIInsight';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id) return;
      
      const supabase = createClient();
      
      try {
        const [dreamsResponse, entitiesResponse] = await Promise.all([
          supabase
            .from('dreams')
            .select('*, dream_tags(tag:tags(*))')
            .eq('user_id', user.id)
            .order('dream_date', { ascending: false })
            .limit(12),
          supabase
            .from('dream_entities')
            .select('name, category')
            .eq('user_id', user.id)
            .limit(50)
        ]);
        
        if (dreamsResponse.data) {
          setDreams(dreamsResponse.data as any[]);
        }
        
        if (entitiesResponse.data) {
          setEntities(entitiesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchDashboardData();
    }
  }, [user?.id, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 w-full animate-pulse">
        <Skeleton className="h-12 w-64 mb-2 rounded-lg" />
        <Skeleton className="h-6 w-96 mb-8 rounded-lg" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Skeleton className="h-40 rounded-2xl md:col-span-2 bg-[var(--bg-card)]" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-full rounded-2xl bg-[var(--bg-card)]" />
            <Skeleton className="h-full rounded-2xl bg-[var(--bg-card)]" />
          </div>
        </div>

        <Skeleton className="h-8 w-48 mb-6 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Skeleton className="h-64 rounded-xl bg-[var(--bg-card)]" />
          <Skeleton className="h-64 rounded-xl bg-[var(--bg-card)]" />
          <Skeleton className="h-64 rounded-xl bg-[var(--bg-card)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 w-full">
      <Greeting profile={profile} dreams={dreams} />
      <QuickActions />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <RecentDreams dreams={dreams} />
        </div>
        <div className="w-full lg:w-1/3">
          <PatternSnapshot dreams={dreams} entities={entities} />
        </div>
      </div>
      
      <AIInsight dreams={dreams} />
    </div>
  );
}
