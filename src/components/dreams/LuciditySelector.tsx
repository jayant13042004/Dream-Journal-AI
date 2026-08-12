'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lucidity } from '@/types/dream';
import { LUCIDITY_OPTIONS } from '@/lib/utils/constants';

interface LuciditySelectorProps {
  value: Lucidity | null;
  onChange: (lucidity: Lucidity) => void;
}

export function LuciditySelector({ value, onChange }: LuciditySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--text-secondary)]">Lucidity Level</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {LUCIDITY_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value as Lucidity)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-[var(--accent-soft)] border-[var(--accent)]'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-default)] hover:border-[var(--accent-soft)]'
              }`}
            >
              <div className="font-medium text-[var(--text-primary)] text-sm mb-1">{option.label}</div>
              <div className="text-xs text-[var(--text-muted)]">{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
