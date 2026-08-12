export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  dream_references?: Array<{ id: string; title: string; date: string }>;
  created_at: string;
  user_id?: string;
}

export interface AnalysisStage {
  name: string;
  status: 'pending' | 'active' | 'complete';
}

export interface PatternAnalysis {
  recurring_themes: string[];
  recurring_symbols: string[];
  recurring_people: string[];
  recurring_places: string[];
  emotional_patterns: string[];
  frequency_changes: string[];
  interesting_observations: string[];
}
