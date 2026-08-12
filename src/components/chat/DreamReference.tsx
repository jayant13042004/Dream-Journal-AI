import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface DreamReferenceProps {
  dreamId: string;
  title: string;
  date: string;
}

export function DreamReference({ dreamId, title, date }: DreamReferenceProps) {
  return (
    <Link href={`/dream/${dreamId}`} className="block mt-2">
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer group">
        <BookOpen className="w-4 h-4 text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors" />
        <div className="flex flex-col">
          <span className="text-xs font-medium text-[var(--text-primary)]">{title}</span>
          <span className="text-[10px] text-[var(--text-muted)]">{new Date(date).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
