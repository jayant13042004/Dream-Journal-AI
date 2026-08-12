'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Input, Button, Spinner } from '@/components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User as UserIcon } from 'lucide-react';
import { ChatMessage } from '@/types/ai';
import { DreamReference } from '@/components/chat/DreamReference';

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadHistory() {
      if (!user) return;
      
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
        
      if (data) setMessages(data as ChatMessage[]);
      setLoading(false);
    }
    
    loadHistory();
  }, [user, supabase]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || !user) return;
    
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue.trim(),
      created_at: new Date().toISOString(),
      user_id: user.id
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history: messages })
      });
      
      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.reply,
          created_at: new Date().toISOString(),
          user_id: user.id,
          dream_references: data.dreamReferences
        };
        
        setMessages(prev => [...prev, aiMsg]);
        
        // Save to DB in background
        await supabase.from('chat_messages').insert([
          { ...userMsg },
          { ...aiMsg }
        ]);
      }
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestQuestion = (q: string) => {
    setInputValue(q);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6">
      <div className="mb-6 shrink-0">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Talk to your dreams</h1>
        <p className="text-[var(--text-muted)] mt-1">Ask questions about your dream patterns, themes, and history.</p>
      </div>

      <div className="flex-1 min-h-0 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-default)] flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] mb-4">
                <Sparkles size={32} />
              </div>
              <div>
                <h3 className="text-xl font-medium text-[var(--text-primary)] mb-2">I am your AI Dream Guide</h3>
                <p className="text-[var(--text-muted)] max-w-md">I can help you interpret recurring themes, track emotional patterns, or recall specific dreams.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  "What are my most common dreams?",
                  "Which emotions appear most often?",
                  "Have my dreams changed recently?",
                  "Tell me about dreams involving water"
                ].map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => suggestQuestion(q)}
                    className="p-3 text-sm text-left rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--accent)] border border-[var(--border-default)]'}`}>
                    {msg.role === 'user' ? <UserIcon size={16} /> : <Sparkles size={16} />}
                  </div>
                  <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--accent)] text-white rounded-tr-sm' : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-tl-sm'}`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    {msg.dream_references && msg.dream_references.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.dream_references.map((ref, idx) => (
                          <DreamReference key={idx} dreamId={ref.id} title={ref.title} date={ref.date} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 flex-row"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] text-[var(--accent)] border border-[var(--border-default)] flex items-center justify-center shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div className="px-4 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-tl-sm flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-[var(--bg-card)] border-t border-[var(--border-default)]">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your dreams..."
              className="w-full pl-4 pr-12 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-xl resize-none outline-none focus:border-[var(--accent)] transition-colors min-h-[52px] max-h-32 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              rows={1}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 bottom-2 h-9 w-9 text-[var(--accent)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent-hover)] p-0"
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
            >
              <Send size={18} />
            </Button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-[var(--text-muted)]">Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
