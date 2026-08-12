'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Save, Trash2, Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { MoodSelector } from './MoodSelector';
import { LuciditySelector } from './LuciditySelector';
import { TagInput } from './TagInput';
import { VoiceInput } from './VoiceInput';
import { Dream, Mood, Lucidity } from '@/types/dream';
import { formatDreamDate } from '@/lib/utils/date';

interface DreamEditorProps {
  initialDream?: Partial<Dream>;
  onSave: (dream: any, analyze: boolean) => void;
  isEditing?: boolean;
}

const DRAFT_KEY = 'dream_journal_draft';

export function DreamEditor({ initialDream, onSave, isEditing = false }: DreamEditorProps) {
  const [title, setTitle] = useState(initialDream?.title || '');
  const [date, setDate] = useState(initialDream?.dream_date || new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState(initialDream?.content || '');
  const [mood, setMood] = useState<Mood | null>(initialDream?.mood || null);
  const [lucidity, setLucidity] = useState<Lucidity | null>(initialDream?.lucidity || null);
  const [tags, setTags] = useState<string[]>(
    initialDream?.dream_tags
      ? (initialDream.dream_tags as any).map((t: any) => (typeof t === 'string' ? t : t.tag))
      : []
  );
  const [hasDraft, setHasDraft] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // Check for drafts on mount
  useEffect(() => {
    if (!isEditing) {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          // Only show draft prompt if there's substantial content
          if (parsed.content?.length > 10 || parsed.title) {
            setHasDraft(true);
          }
        } catch (e) {
          console.error('Failed to parse draft', e);
        }
      }
    }
  }, [isEditing]);

  const loadDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.date) setDate(parsed.date);
        if (parsed.content) setContent(parsed.content);
        if (parsed.mood) setMood(parsed.mood);
        if (parsed.lucidity) setLucidity(parsed.lucidity);
        if (parsed.tags) setTags(parsed.tags);
        setHasDraft(false);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
  };

  // Autosave
  useEffect(() => {
    if (isEditing) return; // Don't autosave when editing an existing dream

    const timer = setTimeout(() => {
      if (title || content) {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ title, date, content, mood, lucidity, tags })
        );
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, date, content, mood, lucidity, tags, isEditing]);

  const handleVoiceTranscript = useCallback((text: string) => {
    setContent((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + text);
  }, []);

  const handleSubmit = (analyze: boolean) => {
    if (!content.trim()) return;

    onSave(
      {
        title: title.trim() || 'Untitled Dream',
        date,
        content: content.trim(),
        mood,
        lucidity,
        tags,
      },
      analyze
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 animate-fade-in">
      {hasDraft && !isEditing && (
        <div className="bg-[var(--accent-soft)] border border-[var(--accent)] p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Info className="text-[var(--accent)]" size={20} />
            <span className="text-[var(--text-primary)] text-sm">
              You have an unsaved dream draft. Would you like to restore it?
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={clearDraft}>
              Discard
            </Button>
            <Button size="sm" onClick={loadDraft}>
              Restore
            </Button>
          </div>
        </div>
      )}

      <form ref={formRef} className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your dream a name..."
            className="w-full text-3xl md:text-4xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm bg-transparent border-none text-[var(--text-secondary)] focus:outline-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">The Dream</label>
            <VoiceInput onTranscript={handleVoiceTranscript} />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write everything you remember..."
            className="w-full min-h-[300px] p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] resize-y text-[var(--text-primary)] text-lg leading-relaxed shadow-inner transition-colors"
          />
          <div className="text-right text-xs text-[var(--text-muted)]">
            {content.length} characters
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MoodSelector value={mood} onChange={setMood} />
          <LuciditySelector value={lucidity} onChange={setLucidity} />
        </div>

        <div className="max-w-md">
          <TagInput tags={tags} onChange={setTags} />
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 items-center justify-end border-t border-[var(--border-default)]">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => handleSubmit(false)}
            disabled={!content.trim()}
          >
            <Save size={18} />
            {isEditing ? 'Save Changes' : 'Save Without Analysis'}
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
            onClick={() => handleSubmit(true)}
            disabled={!content.trim()}
          >
            <Sparkles size={18} />
            {isEditing ? 'Update & Re-analyze' : 'Analyze Dream'}
          </Button>
        </div>
      </form>
    </div>
  );
}
