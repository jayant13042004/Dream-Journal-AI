'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Moon } from 'lucide-react';
import type { Dream } from '@/types/dream';
import { DreamCard } from './DreamCard';
import { EmptyState } from '@/components/ui/EmptyState';

interface RecentDreamsProps {
  dreams: Dream[];
}

export function RecentDreams({ dreams }: RecentDreamsProps) {
  const router = useRouter();

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
          Recent Dreams
        </h2>
        {dreams.length > 0 && (
          <Link href="/dreams" className="text-[var(--accent)] hover:opacity-80 text-sm font-medium flex items-center gap-1 transition-opacity">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {dreams.length === 0 ? (
        <EmptyState 
          icon={Moon}
          title="Your dream journal is empty" 
          description="Start recording your dreams to see them here and discover patterns."
          action={{
            label: "Record Your First Dream",
            onClick: () => router.push('/dream/new')
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreams.slice(0, 6).map((dream, index) => (
            <DreamCard key={dream.id} dream={dream} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
