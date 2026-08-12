'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart, Search, Sparkles, Network, CheckCircle } from 'lucide-react';

const STAGES = [
  { id: 1, label: 'Reading your dream...', icon: BookOpen },
  { id: 2, label: 'Identifying emotions...', icon: Heart },
  { id: 3, label: 'Finding recurring elements...', icon: Search },
  { id: 4, label: 'Exploring possible meanings...', icon: Sparkles },
  { id: 5, label: 'Connecting with your dream history...', icon: Network },
];

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  currentStage: number; // 0-based index or 1-based index, let's assume 1-based matching id
}

export function AnalysisProgress({ isAnalyzing, currentStage }: AnalysisProgressProps) {
  if (!isAnalyzing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-xl max-w-md w-full border border-[var(--border-default)]"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Analyzing Dream</h2>
            <p className="text-[var(--text-muted)] text-sm">
              Our AI is exploring the depths of your subconscious...
            </p>
          </div>

          <div className="space-y-4">
            {STAGES.map((stage, index) => {
              const isActive = currentStage === stage.id;
              const isComplete = currentStage > stage.id;
              const isPending = currentStage < stage.id;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-4 transition-all duration-300 ${
                    isPending ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  <div
                    className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isComplete
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                    }`}
                  >
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      >
                        <CheckCircle size={20} />
                      </motion.div>
                    ) : (
                      <Icon size={20} />
                    )}

                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-[var(--accent)] border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
