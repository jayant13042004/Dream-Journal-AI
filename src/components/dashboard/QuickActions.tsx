'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, PenLine, Book, Sparkles } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="md:col-span-2"
      >
        <Link href="/dream/new" className="block h-full">
          <div className="h-full rounded-2xl bg-gradient-to-r from-[var(--accent)] to-purple-500 p-6 flex flex-col justify-between text-white shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <PenLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-semibold mb-1">Record a Dream</h2>
              <p className="text-white/80">Write down what you remember before it fades away.</p>
            </div>
          </div>
        </Link>
      </motion.div>

      <div className="flex flex-col gap-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
          <Link href="/dreams" className="block h-full">
            <div className="h-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[var(--accent-soft)] p-3 rounded-xl text-[var(--accent)]">
                <Book className="w-5 h-5" />
              </div>
              <span className="font-medium text-[var(--text-primary)]">View All Dreams</span>
            </div>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
          <Link href="/insights" className="block h-full">
            <div className="h-full rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[var(--accent-soft)] p-3 rounded-xl text-[var(--accent)]">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-medium text-[var(--text-primary)]">Explore Patterns</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
