'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DreamAnalysis } from '@/components/dreams/DreamAnalysis';
import { Dream } from '@/types/dream';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDreamDate, getRelativeDate } from '@/lib/utils/date';
import { Edit2, Trash2, Calendar, Sparkles } from 'lucide-react';
import { MOODS } from '@/lib/utils/constants';
import { toast } from '@/components/ui/Toast';

export default function DreamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const supabase = createClient();
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchDream = async () => {
      try {
        const { data: dreamData, error } = await supabase
          .from('dreams')
          .select('*, analysis:dream_analyses(*)')
          .eq('id', resolvedParams.id)
          .single();

        if (error) throw error;
        setDream(dreamData);
      } catch (error) {
        console.error('Error fetching dream:', error);
        toast.error('Failed to load dream.');
      } finally {
        setLoading(false);
      }
    };

    fetchDream();
  }, [resolvedParams.id, supabase]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', resolvedParams.id);

      if (error) throw error;
      
      toast.success('Dream deleted');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting dream:', error);
      toast.error('Failed to delete dream.');
    }
  };

  const handleAnalyze = async () => {
    if (!dream) return;
    setAnalyzing(true);
    
    try {
      const aiResponse = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamId: dream.id, content: dream.content }),
      });

      if (!aiResponse.ok) throw new Error('Analysis failed');

      const analysisData = await aiResponse.json();
      setDream((prev) => prev ? { ...prev, analysis: [analysisData] } : null);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error('Analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-pulse space-y-8">
        <div className="h-10 bg-[var(--bg-secondary)] rounded w-2/3"></div>
        <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-full"></div>
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-full"></div>
          <div className="h-4 bg-[var(--bg-secondary)] rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dream Not Found</h1>
        <p className="text-[var(--text-secondary)]">The dream you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  const moodData = MOODS.find((m) => m.value === dream.mood);
  const analysis = dream.ai_analysis;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 pb-24">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-tight">
              {dream.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDreamDate(new Date(dream.dream_date))}
                <span className="text-[var(--text-muted)] ml-1">
                  ({getRelativeDate(new Date(dream.dream_date))})
                </span>
              </span>
              {moodData && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                  {moodData.emoji} {moodData.label}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => router.push(`/dream/${dream.id}/edit`)}>
              <Edit2 size={16} className="mr-2" />
              Edit
            </Button>
            <Button variant="secondary" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => setShowDeleteModal(true)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>

        {(dream as any).dream_tags && (dream as any).dream_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(dream as any).dream_tags.map((t: any) => (
              <Badge key={t.tag} variant="default">#{t.tag}</Badge>
            ))}
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed p-6 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] shadow-sm">
          {dream.content}
        </div>
      </div>

      {/* Analysis Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">AI Analysis</h2>
          {!analysis && (
            <Button onClick={handleAnalyze} disabled={analyzing} className="flex items-center gap-2">
              <Sparkles size={16} />
              {analyzing ? 'Analyzing...' : 'Analyze Dream'}
            </Button>
          )}
        </div>

        {analysis ? (
          <DreamAnalysis analysis={analysis} dream={dream} />
        ) : (
          <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-default)] border-dashed">
            <Sparkles size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-secondary)] mb-4 max-w-md mx-auto">
              Unlock hidden meanings, emotional insights, and recurring themes in this dream with our AI analysis.
            </p>
            <Button onClick={handleAnalyze} disabled={analyzing} size="lg">
              <Sparkles size={18} className="mr-2" />
              {analyzing ? 'Exploring your subconscious...' : 'Analyze Now'}
            </Button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Delete Dream?</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete "{dream.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
