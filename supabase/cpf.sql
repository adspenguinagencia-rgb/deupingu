create table if not exists public.contas_cpf (
  cpf text primary key,
  senha text not null,
  nome text default '',
  cidade text default '',
  uf text default '',
  user_id text,
  created_at timestamptz default now()
);
alter table public.contas_cpf enable row level security;
drop policy if exists "cpf_all" on public.contas_cpf;
create policy "cpf_all" on public.contas_cpf for all using (true) with check (true);
