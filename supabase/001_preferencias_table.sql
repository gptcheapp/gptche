-- Tabela genérica de preferências por device_id (anônimo, mesmo padrão do histórico de chat)
-- Extensível: qualquer preferência futura (tema, som, etc.) usa o mesmo par chave/valor.

create table if not exists preferencias (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  chave text not null,
  valor text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (device_id, chave)
);

create index if not exists idx_preferencias_device_id on preferencias (device_id);

alter table preferencias enable row level security;

-- Mesmo modelo de RLS anônima já usado no histórico: sem auth real, confia no device_id.
create policy "anon pode inserir preferencias"
  on preferencias for insert
  to anon
  with check (true);

create policy "anon pode ler preferencias"
  on preferencias for select
  to anon
  using (true);

create policy "anon pode atualizar preferencias"
  on preferencias for update
  to anon
  using (true);
