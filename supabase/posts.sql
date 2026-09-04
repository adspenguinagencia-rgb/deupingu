-- Cole no SQL Editor e clique Correr

alter table public.profiles add column if not exists foto text;

create table if not exists public.posts (
  id text primary key,
  autor_id text not null,
  legenda text not null default '',
  midia text,
  video boolean default false,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

drop policy if exists "posts_select" on public.posts;
create policy "posts_select" on public.posts for select using (true);

drop policy if exists "posts_insert" on public.posts;
create policy "posts_insert" on public.posts for insert with check (true);

drop policy if exists "posts_update" on public.posts;
create policy "posts_update" on public.posts for update using (true);

drop policy if exists "posts_delete" on public.posts;
create policy "posts_delete" on public.posts for delete using (true);

insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do nothing;

drop policy if exists "midia_read" on storage.objects;
create policy "midia_read" on storage.objects for select using (bucket_id = 'midia');

drop policy if exists "midia_write" on storage.objects;
create policy "midia_write" on storage.objects for insert with check (bucket_id = 'midia');

drop policy if exists "midia_update" on storage.objects;
create policy "midia_update" on storage.objects for update using (bucket_id = 'midia');
