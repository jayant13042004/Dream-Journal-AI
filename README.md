# 🌙 Dream Journal AI

> A private, AI-powered dream journal that helps you record your dreams, explore their potential meanings, and discover recurring subconscious patterns over time.

Dream Journal AI is designed as a calm, beautiful, and premium space for self-reflection. It is built not to give authoritative psychological diagnoses, but to act as a reflective partner that helps you explore the emotional themes, symbols, and narratives of your dreams.

---

## ✨ Features

- **✍️ Distraction-Free Editor**: A clean, elegant interface designed to let you write without distractions.
- **🎙️ Voice Dictation**: Speak your dreams directly into the journal using real-time voice-to-text dictation.
- **🧠 Multidimensional AI Analysis**: powered by **Gemini 2.5 Flash**, the app automatically:
  - Generates a concise summary.
  - Extracts key symbols and elements (people, places, animals, themes).
  - Estimates emotional signals and trends.
  - Provides subjective, reflective readings (never authoritative medical statements).
- **📊 Subconscious Insights**: View trend charts showing dream frequency, mood changes, and top themes over time.
- **🔮 Interactive Dream Universe**: Explore a custom concentric network map connecting your dreams, recurring themes, and symbols.
- **💬 Subconscious AI Chat**: Engage in conversations with a chat assistant that has secure, contextual access only to your personal dream history.
- **🔐 Absolute Privacy & Security**: Secured with Supabase authentication and Row-Level Security (RLS) to ensure your dreams remain strictly yours.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS variables
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + `pgvector` for semantic search)
- **AI Engine**: [Google Gen AI SDK](https://github.com/google/generative-ai-js) (using `gemini-2.5-flash` and `gemini-embedding-001`)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later)
- A [Supabase](https://supabase.com/) project
- A [Google AI Studio API Key](https://aistudio.google.com/) for Gemini models

### Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jayant13042004/Dream-Journal-AI.git
   cd Dream-Journal-AI
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (based on `.env.example`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Initialize Supabase Database**:
   Run the initial database schema SQL file located in `supabase/migrations/001_initial_schema.sql` on your Supabase SQL Editor. This will:
   - Enable the `pgvector` extension.
   - Create tables for `profiles`, `dreams`, `dream_entities`, `dream_tags`, `user_preferences`, and `chat_messages`.
   - Setup Row-Level Security (RLS) policies.
   - Install the semantic search helper function `match_dreams`.

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📂 Project Structure

```
├── supabase/                 # DB migrations and initial SQL schema
├── public/                   # Static assets (logo, icons, etc.)
└── src/
    ├── app/                  # Next.js App Router (Layouts & Routes)
    │   ├── (dashboard)/      # Protected dashboard route group (Dashboard, Calendar, Chat, Settings)
    │   ├── api/              # API route handlers (CRUD, AI Analysis, Semantic Search)
    │   └── login/            # Auth pages
    ├── components/
    │   ├── layout/           # Sidebar, Navigation, Header, ThemeProvider
    │   ├── dashboard/        # Dashboard layout widgets
    │   ├── dreams/           # Editor, filters, list views, AI results
    │   └── ui/               # Core primitives (Button, Modal, Toast, Badge, Card)
    ├── hooks/                # useAuth, useDreams, useVoiceInput
    ├── lib/
    │   ├── ai/               # AI Service Layer & prompts configuration
    │   ├── supabase/         # SSR Supabase Client config & middleware
    │   └── utils/            # Shared formatting helpers and constants
    └── types/                # Unified TypeScript interfaces
```

---

## 🔒 Privacy & Data Policy

Your dreams are deeply personal. We ensure that:
1. **Row-Level Security**: Every database query is restricted to your authenticated user ID at the PostgreSQL level.
2. **No Data Leakage**: Your dream context is sent to the Gemini API securely for analysis and vector embeddings but is never stored or used to train public models.
3. **Data Control**: You can export all your recorded dreams as a JSON file or delete your account and entire dream history instantly via the Settings page.
