-- Enable extensions
create extension if not exists "vector" with schema extensions;

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Dreams table
create table public.dreams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  dream_date date default current_date not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  mood text check (mood in ('peaceful','happy','anxious','confused','sad','excited','scared','neutral','other')),
  lucidity text check (lucidity in ('not_lucid','partially_lucid','lucid','not_sure')),
  ai_summary text,
  ai_analysis jsonb,
  ai_emotions jsonb,
  ai_symbols text[],
  ai_themes text[],
  embedding vector(768)
);

-- Dream entities table
create table public.dream_entities (
  id uuid default gen_random_uuid() primary key,
  dream_id uuid references public.dreams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  entity_type text not null check (entity_type in ('person','place','object','emotion','animal','activity','symbol','theme')),
  entity_name text not null,
  confidence float default 0.5,
  created_at timestamptz default now() not null
);

-- Dream tags table
create table public.dream_tags (
  id uuid default gen_random_uuid() primary key,
  dream_id uuid references public.dreams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tag text not null
);

-- User preferences table
create table public.user_preferences (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  timezone text default 'UTC',
  reminder_enabled boolean default false,
  preferred_journal_time time,
  theme text default 'system' check (theme in ('light','dark','system')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Chat messages table
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  dream_references text[],
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_dreams_user_id on public.dreams(user_id);
create index idx_dreams_dream_date on public.dreams(dream_date desc);
create index idx_dreams_created_at on public.dreams(created_at desc);
create index idx_dreams_mood on public.dreams(mood);
create index idx_dream_entities_dream_id on public.dream_entities(dream_id);
create index idx_dream_entities_user_id on public.dream_entities(user_id);
create index idx_dream_entities_type on public.dream_entities(entity_type);
create index idx_dream_tags_dream_id on public.dream_tags(dream_id);
create index idx_dream_tags_user_id on public.dream_tags(user_id);
create index idx_chat_messages_user_id on public.chat_messages(user_id);
create index idx_chat_messages_created_at on public.chat_messages(created_at);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.dreams enable row level security;
alter table public.dream_entities enable row level security;
alter table public.dream_tags enable row level security;
alter table public.user_preferences enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Dreams policies
create policy "Users can view own dreams" on public.dreams for select using (auth.uid() = user_id);
create policy "Users can insert own dreams" on public.dreams for insert with check (auth.uid() = user_id);
create policy "Users can update own dreams" on public.dreams for update using (auth.uid() = user_id);
create policy "Users can delete own dreams" on public.dreams for delete using (auth.uid() = user_id);

-- Dream entities policies
create policy "Users can view own entities" on public.dream_entities for select using (auth.uid() = user_id);
create policy "Users can insert own entities" on public.dream_entities for insert with check (auth.uid() = user_id);
create policy "Users can delete own entities" on public.dream_entities for delete using (auth.uid() = user_id);

-- Dream tags policies
create policy "Users can view own tags" on public.dream_tags for select using (auth.uid() = user_id);
create policy "Users can insert own tags" on public.dream_tags for insert with check (auth.uid() = user_id);
create policy "Users can delete own tags" on public.dream_tags for delete using (auth.uid() = user_id);

-- User preferences policies
create policy "Users can view own preferences" on public.user_preferences for select using (auth.uid() = user_id);
create policy "Users can insert own preferences" on public.user_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update own preferences" on public.user_preferences for update using (auth.uid() = user_id);

-- Chat messages policies
create policy "Users can view own messages" on public.chat_messages for select using (auth.uid() = user_id);
create policy "Users can insert own messages" on public.chat_messages for insert with check (auth.uid() = user_id);
create policy "Users can delete own messages" on public.chat_messages for delete using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  );
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
$$;

-- Trigger for new user
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Semantic search function
create or replace function match_dreams(
  query_embedding vector(768),
  match_threshold float default 0.5,
  match_count int default 10,
  p_user_id uuid default null
)
returns table (
  id uuid,
  title text,
  content text,
  dream_date date,
  mood text,
  ai_summary text,
  ai_themes text[],
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    d.id,
    d.title,
    d.content,
    d.dream_date,
    d.mood,
    d.ai_summary,
    d.ai_themes,
    1 - (d.embedding <=> query_embedding) as similarity
  from public.dreams d
  where
    d.user_id = p_user_id
    and d.embedding is not null
    and 1 - (d.embedding <=> query_embedding) > match_threshold
  order by d.embedding <=> query_embedding
  limit match_count;
end;
$$;
