'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mood } from '@/types/dream';
import { MOODS } from '@/lib/utils/constants';

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-secondary)]">Mood</label>
      <div className="flex flex-wrap gap-2">
        {MOODS.map((moodItem) => {
          const isSelected = value === moodItem.value;
          return (
            <motion.button
              key={moodItem.value}
              type="button"
              onClick={() => onChange(moodItem.value as Mood)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                isSelected
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border-[var(--border-default)] hover:border-[var(--accent-soft)]'
              }`}
            >
              <span className="text-lg">{moodItem.emoji}</span>
              <span className="text-sm font-medium">{moodItem.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
