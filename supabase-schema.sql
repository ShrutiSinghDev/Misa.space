create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  role text not null check (role in ('user', 'ai')),
  content text not null,
  created_at timestamp with time zone default now()
);

create index if not exists chat_messages_user_created_idx
  on chat_messages (user_email, created_at);
