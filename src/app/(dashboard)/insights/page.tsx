'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Card, EmptyState, Spinner, Badge } from '@/components/ui';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Activity, Hash, Fingerprint } from 'lucide-react';
import { Dream, DreamEntity } from '@/types/dream';
import { PatternAnalysis } from '@/types/ai';

export default function InsightsPage() {
  const { user } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [entities, setEntities] = useState<DreamEntity[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      setLoading(true);
      
      const [dreamsRes, entitiesRes] = await Promise.all([
        supabase.from('dreams').select('*').eq('user_id', user.id).order('date', { ascending: true }),
        supabase.from('dream_entities').select('*').eq('user_id', user.id)
      ]);
      
      if (dreamsRes.data) setDreams(dreamsRes.data as Dream[]);
      if (entitiesRes.data) setEntities(entitiesRes.data as DreamEntity[]);
      
      setLoading(false);
    }
    
    fetchData();
  }, [user, supabase]);

  useEffect(() => {
    async function fetchInsights() {
      if (dreams.length < 3) return;
      setInsightsLoading(true);
      
      try {
        const response = await fetch('/api/ai/patterns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dreams })
        });
        
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights || []);
        }
      } catch (e) {
        console.error('Failed to fetch insights', e);
      } finally {
        setInsightsLoading(false);
      }
    }
    
    if (dreams.length >= 3 && insights.length === 0) {
      fetchInsights();
    }
  }, [dreams, insights.length]);

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
        <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Insights</h1>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState 
            title="Not enough data yet" 
            description="You need a few more dreams before patterns start appearing. Keep journaling!"
            icon={TrendingUp}
          />
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const frequencyData = dreams.reduce((acc, dream) => {
    const month = new Date(dream.dream_date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) existing.count += 1;
    else acc.push({ name: month, count: 1 });
    return acc;
  }, [] as any[]);

  const emotionsData = dreams.reduce((acc, dream) => {
    const emotions = dream.ai_analysis?.emotions || [];
    emotions.forEach((emotion: any) => {
      const name = typeof emotion === 'string' ? emotion : emotion.name;
      const existing = acc.find(item => item.name === name);
      if (existing) existing.value += 1;
      else acc.push({ name, value: 1 });
    });
    return acc;
  }, [] as any[]).sort((a, b) => b.value - a.value).slice(0, 5);

  const themeData = dreams.reduce((acc, dream) => {
    if (dream.ai_themes) {
      dream.ai_themes.forEach(theme => {
        const existing = acc.find(item => item.name === theme);
        if (existing) existing.value += 1;
        else acc.push({ name: theme, value: 1 });
      });
    }
    return acc;
  }, [] as any[]).sort((a, b) => b.value - a.value).slice(0, 8);

  const colors = ['#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Insights</h1>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="p-6 h-96 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-[var(--accent)]" />
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Dream Frequency</h2>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={frequencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--accent)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-card)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6 h-96 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Hash className="text-[var(--accent)]" />
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Recurring Themes</h2>
            </div>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={themeData} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={12} hide />
                  <YAxis dataKey="name" type="category" stroke="var(--text-primary)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
                    cursor={{ fill: 'var(--bg-secondary)', opacity: 0.4 }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {themeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-[var(--accent)]" />
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">AI Insights</h2>
            </div>
            
            {insightsLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : insights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-start gap-3">
                    <Sparkles className="text-[var(--accent)] shrink-0 w-5 h-5 mt-0.5" />
                    <p className="text-[var(--text-primary)] text-sm leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-[var(--text-muted)]">
                AI is analyzing your dreams to find deeper patterns. Check back later.
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Fingerprint className="text-[var(--accent)]" />
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Common Symbols</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {entities.slice(0, 20).map((entity, idx) => (
                <Badge key={entity.id || idx} variant="default" className="px-3 py-1.5 text-sm">
                  {entity.entity_name}
                </Badge>
              ))}
              {entities.length === 0 && (
                <p className="text-[var(--text-muted)] text-sm">No significant symbols detected yet.</p>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
