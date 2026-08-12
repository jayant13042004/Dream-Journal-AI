'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getRelativeDate } from '@/lib/utils/date';
import { MOODS } from '@/lib/utils/constants';
import type { Dream } from '@/types/dream';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface DreamCardProps {
  dream: Dream;
  index: number;
}

export function DreamCard({ dream, index }: DreamCardProps) {
  const mood = MOODS.find(m => m.value === dream.mood) || MOODS.find(m => m.value === 'neutral') || { emoji: '😐', color: 'bg-gray-100 text-gray-800', label: 'Neutral', value: 'neutral' };
  const moodKey = mood.value;
  
  const contentPreview = dream.content?.length > 100 
    ? dream.content.substring(0, 100) + '...' 
    : dream.content || '';

  const themes = dream.ai_themes || [];
  const primaryEmotion = dream.ai_emotions?.[0];

  return (
    <Link href={`/dream/${dream.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="h-full"
      >
        <Card className="h-full flex flex-col p-5 hover:shadow-md transition-all border-[var(--border-default)] bg-[var(--bg-card)] relative overflow-hidden group">
          {primaryEmotion && (
            <div 
              className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)] opacity-70 group-hover:opacity-100 transition-opacity" 
            />
          )}
          
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] line-clamp-1">
              {dream.title || "Untitled Dream"}
            </h3>
            <div 
              className={`flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full shrink-0 ${mood.color}`}
              title={mood.label}
            >
              <span>{mood.emoji}</span>
            </div>
          </div>
          
          <p className="text-[var(--text-muted)] text-xs mb-3">
            {getRelativeDate(dream.dream_date)}
          </p>
          
          <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-4 flex-grow">
            {contentPreview}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {themes.slice(0, 2).map((theme, i) => (
              <Badge key={i} variant="default" className="text-[10px] bg-[var(--bg-secondary)] border-[var(--border-default)] text-[var(--text-secondary)]">
                {theme}
              </Badge>
            ))}
            {((dream as any).dream_tags || []).slice(0, 2).map((tagObj: any, i: number) => {
              const tagName = tagObj.tag?.name || tagObj.tag || 'tag';
              return (
                <Badge key={`tag-${i}`} variant="default" className="text-[10px] text-[var(--text-secondary)] bg-[var(--bg-secondary)]">
                  #{tagName}
                </Badge>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
