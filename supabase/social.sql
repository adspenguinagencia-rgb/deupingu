create table if not exists public.stories (
  id text primary key,
  autor_id text not null,
  midia text,
  video boolean default false,
  criado_em bigint
);
create table if not exists public.comunidades_app (
  slug text primary key,
  nome text,
  descricao text,
  capa text,
  tipo text default 'aberta',
  dono_id text
);
create table if not exists public.recados (
  id text primary key,
  de text,
  para text,
  texto text
);
create table if not exists public.crushes (
  de text,
  para text,
  primary key (de, para)
);
alter table public.stories enable row level security;
alter table public.comunidades_app enable row level security;
alter table public.recados enable row level security;
alter table public.crushes enable row level security;
drop policy if exists "s_all" on public.stories;
create policy "s_all" on public.stories for all using (true) with check (true);
drop policy if exists "c_all" on public.comunidades_app;
create policy "c_all" on public.comunidades_app for all using (true) with check (true);
drop policy if exists "r_all" on public.recados;
create policy "r_all" on public.recados for all using (true) with check (true);
drop policy if exists "k_all" on public.crushes;
create policy "k_all" on public.crushes for all using (true) with check (true);
