-- ============================================================
-- Setup Supabase pour le formulaire de contact
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- 1) Table des messages de contact
create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  message     text not null
);

-- 2) Activer Row Level Security
alter table public.contacts enable row level security;

-- 3) Autoriser UNIQUEMENT l'insertion par les visiteurs anonymes.
--    Personne ne peut lire les messages via la clé publishable.
--    Toi, tu les lis depuis le Dashboard (Table editor) — protégé par ton login.
create policy "anon_can_insert_contacts"
  on public.contacts
  for insert
  to anon
  with check (true);

-- (Optionnel) garde-fou anti-spam basique : limiter la taille des champs
alter table public.contacts
  add constraint contacts_message_len check (char_length(message) <= 4000),
  add constraint contacts_name_len check (char_length(name) <= 200),
  add constraint contacts_email_len check (char_length(email) <= 320);
