'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DreamEditor } from '@/components/dreams/DreamEditor';
import { AnalysisProgress } from '@/components/dreams/AnalysisProgress';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/Toast';

export default function NewDreamPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);

  const handleSave = async (dreamData: any, analyze: boolean) => {
    if (!user) {
      toast.error('You must be logged in to save a dream.');
      return;
    }

    try {
      // 1. Save dream to database
      const response = await fetch('/api/dreams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...dreamData, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to save dream');
      }

      const { dream } = await response.json();
      localStorage.removeItem('dream_journal_draft');
      toast.success('Dream saved successfully!');

      // 2. Trigger analysis if requested
      if (analyze) {
        setIsAnalyzing(true);
        
        // Progress animation logic
        const interval = setInterval(() => {
          setCurrentStage((prev) => {
            if (prev >= 5) {
              clearInterval(interval);
              return prev;
            }
            return prev + 1;
          });
        }, 1500);

        try {
          const aiResponse = await fetch('/api/ai/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dreamId: dream.id, content: dream.content }),
          });

          if (!aiResponse.ok) {
            console.error('Analysis failed');
            toast.error('Analysis failed, but your dream was saved.');
          }
        } catch (error) {
          console.error('Error during analysis:', error);
          toast.error('Error during analysis.');
        } finally {
          clearInterval(interval);
          setIsAnalyzing(false);
          router.push(`/dream/${dream.id}`);
        }
      } else {
        router.push(`/dream/${dream.id}`);
      }

    } catch (error) {
      console.error('Error saving dream:', error);
      toast.error('Failed to save dream.');
    }
  };

  return (
    <div className="container py-8">
      <AnalysisProgress isAnalyzing={isAnalyzing} currentStage={currentStage} />
      <DreamEditor onSave={handleSave} />
    </div>
  );
}
