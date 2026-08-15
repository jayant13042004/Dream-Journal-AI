'use client';

import { motion } from 'framer-motion';
import { Brain, Heart, Sparkles, CalendarDays } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { Dream } from '@/types/dream';

interface PatternSnapshotProps {
  dreams: Dream[];
  entities: any[];
}

export function PatternSnapshot({ dreams, entities }: PatternSnapshotProps) {
  const thisMonthCount = dreams.filter(d => {
    if (!d.dream_date) return false;
    const date = new Date(d.dream_date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const getMostCommon = (arr: string[]) => {
    if (arr.length === 0) return null;
    const counts = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const allEmotions = dreams.flatMap(d => (d.ai_emotions as any[])?.map(e => typeof e === 'string' ? e : e.name) || []);
  const topEmotion = getMostCommon(allEmotions) || 'Need data';

  const allThemes = dreams.flatMap(d => d.ai_themes || []);
  const topTheme = getMostCommon(allThemes) || 'Need data';
  
  const allEntities = entities.map(e => e.name);
  const topEntity = getMostCommon(allEntities) || 'Need data';

  const hasData = dreams.length > 2;

  const stats = [
    {
      label: "Top Emotion",
      value: topEmotion,
      icon: Heart,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      label: "Top Theme",
      value: topTheme,
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      label: "Top Symbol",
      value: topEntity,
      icon: Brain,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      label: "Dreams This Month",
      value: thisMonthCount.toString(),
      icon: CalendarDays,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-6">
        Pattern Snapshot
      </h2>
      
      {!hasData ? (
        <Card className="p-8 text-center bg-[var(--bg-card)] border-[var(--border-default)]">
          <p className="text-[var(--text-secondary)]">
            Record a few more dreams to start seeing your subconscious patterns.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="p-4 flex flex-col items-start gap-3 border-[var(--border-default)] bg-[var(--bg-card)] h-full">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] font-medium mb-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-[15px] font-semibold text-[var(--text-primary)] capitalize truncate max-w-[100px]" title={stat.value}>
                    {stat.value}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
