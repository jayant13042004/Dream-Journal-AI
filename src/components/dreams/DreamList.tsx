'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { List, AlignLeft, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Dream } from '@/types/dream';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDreamDate, getRelativeDate } from '@/lib/utils/date';
import { MOODS } from '@/lib/utils/constants';

interface DreamListProps {
  dreams: Dream[];
  isLoading: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

export function DreamList({ dreams, isLoading }: DreamListProps) {
  const [view, setView] = useState<'list' | 'timeline'>('list');

  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      {/* View Toggle */}
      <div className="flex justify-end mb-6 gap-2">
        <Button
          variant={view === 'list' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setView('list')}
          title="List View"
          className="p-2"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant={view === 'timeline' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setView('timeline')}
          title="Timeline View"
          className="p-2"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={view === 'timeline' ? 'relative pl-4 md:pl-0' : 'space-y-4'}
      >
        {view === 'timeline' && (
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border-default)] transform md:-translate-x-1/2" />
        )}

        {dreams.map((dream, index) => {
          const moodInfo = MOODS.find(m => m.value === dream.mood);
          return (
            <motion.div key={dream.id} variants={itemVariants}>
              {view === 'list' ? (
                <Link href={`/dream/${dream.id}`} className="block">
                  <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--accent)] transition-colors flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-[var(--text-primary)] truncate">
                          {dream.title || 'Untitled Dream'}
                        </h3>
                        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap ml-2">
                          {getRelativeDate(dream.dream_date)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                        {dream.content}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {dream.mood && (
                          <Badge variant="mood" className="text-xs">
                            {moodInfo ? `${moodInfo.emoji} ${moodInfo.label}` : dream.mood}
                          </Badge>
                        )}
                        {(dream as any).dream_tags?.map((t: any) => (
                          <Badge key={t.tag} variant="default" className="text-xs">
                            {t.tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 self-center" />
                  </div>
                </Link>
              ) : (
              <div className={`relative flex items-center justify-between md:justify-normal w-full mb-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-[var(--accent)] rounded-full transform -translate-x-1.5 md:-translate-x-1.5 ring-4 ring-[var(--bg-primary)] z-10" />
                
                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] ml-8 md:ml-0 group">
                  <Link href={`/dream/${dream.id}`} className="block">
                    <div className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] group-hover:border-[var(--accent)] transition-all transform group-hover:-translate-y-1">
                      <div className="text-sm text-[var(--accent)] mb-1 font-medium">
                        {formatDreamDate(dream.dream_date)}
                      </div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 truncate">
                        {dream.title || 'Untitled Dream'}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                        {dream.content}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
          );
        })}
      </motion.div>

      {/* Pagination Placeholder */}
      {dreams.length > 0 && (
        <div className="flex justify-center mt-8">
           <Button variant="secondary" size="sm">Load More</Button>
        </div>
      )}
    </div>
  );
}
