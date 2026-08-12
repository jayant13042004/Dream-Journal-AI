'use client';

import { motion } from 'framer-motion';
import { getGreeting } from '@/lib/utils/date';
import type { Profile } from '@/types/user';
import type { Dream } from '@/types/dream';

interface GreetingProps {
  profile: Profile | null;
  dreams: Dream[];
}

export function Greeting({ profile, dreams }: GreetingProps) {
  const greeting = getGreeting(profile?.name || undefined);
  
  const today = new Date().toISOString().split('T')[0];
  const hasDreamedToday = dreams.some(d => {
    if (!d.dream_date) return false;
    return d.dream_date.split('T')[0] === today;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-[var(--text-primary)] mb-2">
        {greeting}
      </h1>
      <p className="text-[var(--text-secondary)] text-lg">
        {hasDreamedToday 
          ? "You recorded a dream today. Excellent work maintaining your journal!" 
          : "Ready to record what you remember?"}
      </p>
    </motion.div>
  );
}
