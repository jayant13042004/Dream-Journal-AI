'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dream } from '@/types/dream';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import Link from 'next/link';
import { ChevronRight, CalendarDays } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatDreamDate } from '@/lib/utils/date';
import { Badge } from '@/components/ui/Badge';
import { MOODS } from '@/lib/utils/constants';

export default function CalendarPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [direction, setDirection] = useState(0);

  const fetchDreamsForMonth = useCallback(async (date: Date) => {
    if (!user) return;
    setIsLoading(true);

    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Fetch from previous month's last week to next month's first week to cover grid
    const startDate = new Date(year, month - 1, 20).toISOString();
    const endDate = new Date(year, month + 1, 14).toISOString();

    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) throw error;
      setDreams(data as Dream[]);
    } catch (error) {
      console.error('Error fetching calendar dreams:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (!authLoading) {
      fetchDreamsForMonth(currentMonth);
    }
  }, [currentMonth, fetchDreamsForMonth, authLoading]);

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // If clicking a date from previous/next month, navigate to it
    if (date.getMonth() !== currentMonth.getMonth()) {
      setDirection(date.getMonth() > currentMonth.getMonth() ? 1 : -1);
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const selectedDreams = selectedDate 
    ? dreams.filter(d => {
        const dDate = new Date(d.dream_date);
        return dDate.getDate() === selectedDate.getDate() &&
               dDate.getMonth() === selectedDate.getMonth() &&
               dDate.getFullYear() === selectedDate.getFullYear();
      })
    : [];

  if (authLoading) {
    return <div className="p-8 flex justify-center"><Spinner /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 relative min-h-[500px]">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-primary)]/50 backdrop-blur-sm rounded-xl">
              <Spinner size="lg" />
            </div>
          )}
          <CalendarGrid
            currentMonth={currentMonth}
            dreams={dreams}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            direction={direction}
          />
        </div>

        {/* Selected Date Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-default)] p-6 sticky top-6">
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6 pb-4 border-b border-[var(--border-default)]">
              {selectedDate ? formatDreamDate(selectedDate.toISOString()) : 'Select a date'}
            </h3>

            {selectedDreams.length > 0 ? (
              <div className="space-y-4">
                {selectedDreams.map(dream => {
                  const moodInfo = MOODS.find(m => m.value === dream.mood);
                  return (
                    <Link href={`/dream/${dream.id}`} key={dream.id} className="block group">
                      <div className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-transparent group-hover:border-[var(--accent)] transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-[var(--text-primary)] line-clamp-1">{dream.title || 'Untitled Dream'}</h4>
                          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                          {dream.content}
                        </p>
                        {dream.mood && (
                          <Badge variant="default" className="text-xs">
                            {moodInfo ? `${moodInfo.emoji} ${moodInfo.label}` : dream.mood}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No dreams"
                description={selectedDate && selectedDate <= new Date() ? "You didn't record any dreams on this date." : "Future dates cannot have dreams."}
                action={selectedDate && selectedDate <= new Date() ? {
                  label: "Record a dream for this date",
                  onClick: () => router.push(`/dream/new?date=${selectedDate.toISOString().split('T')[0]}`)
                } : undefined}
                className="py-8"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
