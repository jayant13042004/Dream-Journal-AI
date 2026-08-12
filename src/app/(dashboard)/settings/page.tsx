'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Card, Input, Button, Spinner } from '@/components/ui';
import { toast } from '@/components/ui/Toast';
import { Moon, Sun, Monitor, Download, Trash2, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [reminder, setReminder] = useState(true);
  const [journalTime, setJournalTime] = useState('08:00');
  const [aiDepth, setAiDepth] = useState('standard');

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      const { data: prefs } = await supabase.from('user_preferences').select('*').eq('user_id', user.id).single();
      
      if (profile?.display_name) setName(profile.display_name);
      if (prefs) {
        if (prefs.timezone) setTimezone(prefs.timezone);
        if (prefs.reminder_enabled !== undefined) setReminder(prefs.reminder_enabled);
        if (prefs.journal_time) setJournalTime(prefs.journal_time);
        if (prefs.ai_depth) setAiDepth(prefs.ai_depth);
      }
      
      setLoading(false);
    }
    
    loadProfile();
  }, [user, supabase]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase.from('profiles').update({ display_name: name }).eq('id', user.id);
      if (error) throw error;
      toast.success('Profile updated');
    } catch (e) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrefs = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase.from('user_preferences').upsert({
        user_id: user.id,
        timezone,
        reminder_enabled: reminder,
        journal_time: journalTime,
        ai_depth: aiDepth
      });
      if (error) throw error;
      toast.success('Preferences saved');
    } catch (e) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    try {
      const { data } = await supabase.from('dreams').select('*').eq('user_id', user.id);
      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dream_journal_export.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      toast.error('Export failed');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 pb-20">
      <h1 className="text-3xl font-bold text-[var(--text-primary)]">Settings</h1>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] border-b border-[var(--border-default)] pb-4">Account</h2>
        
        <div className="space-y-4 max-w-md">
          <Input 
            label="Display Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Input 
            label="Email" 
            value={user?.email || ''} 
            disabled 
          />
          <Button onClick={handleSaveProfile} disabled={saving} className="mt-2">
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] border-b border-[var(--border-default)] pb-4">Journal Preferences</h2>
        
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-primary)]">Preferred Journal Time</label>
            <input 
              type="time" 
              value={journalTime} 
              onChange={(e) => setJournalTime(e.target.value)}
              className="w-full p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">Daily Reminder</p>
              <p className="text-xs text-[var(--text-muted)]">Get a notification to log your dreams</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={reminder} onChange={(e) => setReminder(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-full peer peer-checked:bg-[var(--accent)] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-primary)]">AI Analysis Depth</label>
            <div className="grid grid-cols-3 gap-2">
              {['quick', 'standard', 'deep'].map(depth => (
                <button
                  key={depth}
                  onClick={() => setAiDepth(depth)}
                  className={`p-2 text-sm rounded-lg capitalize border transition-colors ${aiDepth === depth ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] font-medium' : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                >
                  {depth}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSavePrefs} disabled={saving} variant="secondary" className="mt-2">
            Save Preferences
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] border-b border-[var(--border-default)] pb-4">Appearance</h2>
        
        <div className="grid grid-cols-3 gap-4 max-w-md">
          <button onClick={() => setTheme('light')} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${theme === 'light' ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'}`}>
            <Sun className="mb-2" size={24} />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button onClick={() => setTheme('dark')} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${theme === 'dark' ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'}`}>
            <Moon className="mb-2" size={24} />
            <span className="text-sm font-medium">Dark</span>
          </button>
          <button onClick={() => setTheme('system')} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${theme === 'system' ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]' : 'border-[var(--border-default)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'}`}>
            <Monitor className="mb-2" size={24} />
            <span className="text-sm font-medium">System</span>
          </button>
        </div>
      </Card>

      <Card className="p-6 space-y-6 border-red-200 dark:border-red-900/30">
        <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-4">
          <AlertTriangle className="text-red-500" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Privacy & Data</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">Export Data</h3>
              <p className="text-sm text-[var(--text-muted)] mt-1">Download all your dreams as a JSON file.</p>
            </div>
            <Button variant="secondary" onClick={handleExportData} className="shrink-0 flex gap-2">
              <Download size={16} /> Export
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20">
            <div>
              <h3 className="font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
              <p className="text-sm text-red-500/80 mt-1">Permanently delete your account and all data.</p>
            </div>
            <Button variant="danger" className="shrink-0 flex gap-2" onClick={() => alert('Confirmation required')}>
              <Trash2 size={16} /> Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
