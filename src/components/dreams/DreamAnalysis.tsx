'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, HelpCircle } from 'lucide-react';
import { Dream, DreamAnalysis as IDreamAnalysis } from '@/types/dream';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface DreamAnalysisProps {
  analysis: IDreamAnalysis;
  dream: Dream;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export function DreamAnalysis({ analysis, dream }: DreamAnalysisProps) {
  if (!analysis) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 mt-8"
    >
      {/* Summary */}
      <motion.div variants={itemVariants}>
        <Card className="bg-[var(--accent-soft)] border-[var(--accent)]/20 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BookOpen size={100} />
          </div>
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)] mb-3">
              <BookOpen size={20} className="text-[var(--accent)]" />
              Dream Summary
            </h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotional Landscape */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
              AI-estimated emotional signals
            </h3>
            <div className="space-y-4 mb-4">
              {analysis.emotions?.map((emotion, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize text-[var(--text-primary)]">{emotion.name}</span>
                    <span className="text-[var(--text-secondary)]">{emotion.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${emotion.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)]"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] italic">
              These percentages represent AI-estimated signals, not scientifically measured values.
            </p>
          </Card>
        </motion.div>

        {/* Key Elements */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
              Key Elements
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.key_elements?.map((element: string, index: number) => (
                <Badge key={index} variant="default" className="px-3 py-1 text-sm font-medium">
                  {element}
                </Badge>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Possible Interpretations */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            Possible Interpretations
          </h3>
          <div className="space-y-4">
            {analysis.possible_interpretations?.map((interpretation: string, index: number) => (
              <div key={index} className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                <p className="italic text-[var(--text-primary)] leading-relaxed">
                  {interpretation}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Interpretations are subjective suggestions based on common psychological patterns.
          </p>
        </Card>
      </motion.div>

      {/* Reflection Questions */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
            Reflection Questions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysis.reflection_questions?.map((question: string, index: number) => (
              <div key={index} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                <HelpCircle className="text-[var(--accent)] shrink-0 mt-0.5" size={18} />
                <p className="text-[var(--text-primary)] text-sm font-medium">{question}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* AI Insight */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-[var(--accent-soft)] to-transparent border-[var(--accent)]/30">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)] mb-3">
            <Sparkles size={20} className="text-[var(--accent)]" />
            AI Insight
          </h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {analysis.insight}
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
