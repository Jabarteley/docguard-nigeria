-- Migration: Add 'evidence' storage bucket for RPA screenshots
-- Date: 2025-01-01

-- 1. Create 'evidence' bucket (private, for audit trail)
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing; -- Prevent error if already exists

-- 2. Policy: Allow authenticated users to upload their own evidence
create policy "Users can upload their own evidence."
  on storage.objects for insert
  with check (
    bucket_id = 'evidence' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- 3. Policy: Allow authenticated users to view their own evidence
create polic-- Migration: Add 'evidence' storage bucket for RPA screenshots
-- Date: 2025-01-01

-- 1. Create 'evidence' bucket (private, for audit trail)
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing; -- Prevent error if already exists

-- 2. Policy: Allow authenticated users to upload their own evidence
create policy "Users can upload their own evidence."
  on storage.objects for insert
  with check (
    bucket_id = 'evidence' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- 3. Policy: Allow authenticated users to view their own evidence
create policy "Users can view their own evidence."
  on storage.objects for select
  using (
    bucket_id = 'evidence' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- 4. Policy: Allow authenticated users to update their own evidence (optional, for retries)
create policy "Users can update their own evidence."
  on storage.objects for update
  using (
    bucket_id = 'evidence' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );
y "Users can view their own evidence."
  on storage.objects for select
  using (
    bucket_id = 'evidence' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- 4. Policy: Allow authenticated users to update their own evidence (optional, for retries)
create policy "Users can update their own evidence."
  on storage.objects for update
  using (
    bucket_id = 'evidence' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );
