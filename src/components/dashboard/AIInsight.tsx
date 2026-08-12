'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Dream } from '@/types/dream';

interface AIInsightProps {
  dreams: Dream[];
}

export function AIInsight({ dreams }: AIInsightProps) {
  const router = useRouter();

  if (dreams.length < 3) {
    return (
      <Card className="p-6 md:p-8 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)] border-[var(--border-default)]">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="bg-[var(--accent-soft)] p-3 rounded-full text-[var(--accent)] shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-2">
              AI Insights Loading...
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Record a few more dreams and I'll start finding patterns and insights in your subconscious journey.
            </p>
            <Button variant="secondary" onClick={() => router.push('/insights')} className="border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)]">
              Explore Insights Feature
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const allThemes = dreams.flatMap(d => d.ai_themes || []);
  const themeCounts = allThemes.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let topTheme = '';
  let maxCount = 0;
  for (const [theme, count] of Object.entries(themeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topTheme = theme;
    }
  }

  const insightText = maxCount > 1 
    ? `I've noticed the theme of "${topTheme}" appearing in ${maxCount} of your recent dreams. This might reflect your current waking life focus.`
    : `Your dreams are quite diverse lately! You're exploring many different themes and emotions.`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-12"
    >
      <Card className="relative overflow-hidden p-6 md:p-8 border border-[var(--accent)]/20 shadow-md bg-[var(--bg-card)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-br from-[var(--accent)] to-purple-500 p-4 rounded-2xl text-white shadow-lg shrink-0 w-fit"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          
          <div className="flex-grow">
            <h3 className="font-display font-semibold text-xl text-[var(--text-primary)] mb-2">
              Weekly Insight
            </h3>
            <p className="text-[var(--text-secondary)] text-lg mb-4 md:mb-0">
              {insightText}
            </p>
          </div>
          
          <Button 
            onClick={() => router.push('/insights')}
            className="shrink-0 bg-[var(--bg-primary)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] shadow-sm flex items-center gap-2"
          >
            Explore Deeper <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
