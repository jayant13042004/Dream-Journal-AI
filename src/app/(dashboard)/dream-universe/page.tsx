'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Spinner, EmptyState } from '@/components/ui';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { Dream } from '@/types/dream';

export default function DreamUniversePage() {
  const { user } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const { data } = await supabase.from('dreams').select('*').eq('user_id', user.id);
      if (data) setDreams(data as Dream[]);
      setLoading(false);
    }
    fetchData();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (dreams.length < 3) {
    return (
      <div className="p-6 max-w-4xl mx-auto h-full flex flex-col">
        <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Dream Universe</h1>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState 
            title="Universe still forming" 
            description="Log more dreams to see your personalized dream universe."
            icon={Network}
          />
        </div>
      </div>
    );
  }

  // Simplified visualization using simple concentric circles and DOM nodes
  const themes = new Map<string, number>();
  dreams.forEach(d => {
    d.ai_themes?.forEach(t => {
      themes.set(t, (themes.get(t) || 0) + 1);
    });
  });

  const sortedThemes = Array.from(themes.entries()).sort((a, b) => b[1] - a[1]);
  const mainTheme = sortedThemes[0]?.[0] || 'Unknown';
  const subThemes = sortedThemes.slice(1, 7).map(t => t[0]);

  return (
    <div className="flex flex-col h-full p-6 max-w-6xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dream Universe</h1>
        <p className="text-[var(--text-muted)] mt-1">A visual representation of your subconscious patterns.</p>
      </div>

      <div className="flex-1 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] flex items-center justify-center overflow-hidden relative">
        <div className="relative w-full max-w-2xl aspect-square">
          {/* Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] h-[80%] rounded-full border border-[var(--border-default)] opacity-20 absolute" />
            <div className="w-[50%] h-[50%] rounded-full border border-[var(--border-default)] opacity-40 absolute" />
            <div className="w-[20%] h-[20%] rounded-full border border-[var(--accent)] opacity-30 absolute bg-[var(--accent-soft)]" />
          </div>

          {/* Center node */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-[#818cf8] to-[#c084fc] flex items-center justify-center shadow-lg text-white font-medium text-center p-2 text-sm z-20 cursor-pointer hover:scale-105 transition-transform"
            >
              {mainTheme}
            </motion.div>
          </div>

          {/* Sub nodes */}
          {subThemes.map((theme, i) => {
            const angle = (i / subThemes.length) * Math.PI * 2;
            const radius = 35; // percentage
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            
            return (
              <motion.div
                key={theme}
                initial={{ opacity: 0, x: '50%', y: '50%' }}
                animate={{ opacity: 1, left: `${x}%`, top: `${y}%`, x: '-50%', y: '-50%' }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                className="absolute w-16 h-16 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--border-default)] text-[var(--text-primary)] flex items-center justify-center text-xs text-center p-1 shadow-sm cursor-pointer hover:border-[var(--accent)] hover:z-30 transition-colors z-10"
              >
                {theme}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
