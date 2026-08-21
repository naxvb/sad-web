-- 0001: example table demonstrating the RLS-first convention.
-- EVERY create table must ship in the same migration with RLS enabled + at least one policy,
-- because the browser connects with the public anon key and RLS is the only thing protecting
-- data. Replace `items` with your real domain, but keep this shape.

create table if not exists items (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  done       boolean not null default false,
  created_at timestamptz not null default now()
);

alter table items enable row level security;

-- Baseline policy: any authenticated user has full access. Tighten as your domain needs
-- (e.g. per-user rows via `using (user_id = auth.uid())`).
create policy authenticated_all on items
  for all
  to authenticated
  using (true)
  with check (true);
