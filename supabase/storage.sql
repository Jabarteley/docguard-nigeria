
-- 1. Create a public bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- 2. Create a private bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);

-- 3. Set up security policies

-- ALLOW Public access to avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- ALLOW Users to upload their own avatars
create policy "Users can upload their own avatar."
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- ALLOW Users to update their own avatars
create policy "Users can update their own avatar."
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- ALLOW Users to upload their own documents
create policy "Users can upload their own documents."
  on storage.objects for insert
  with check (
    bucket_id = 'documents' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- ALLOW Users to view their own documents
create policy "Users can view their own documents."
  on storage.objects for select
  using (
    bucket_id = 'documents' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );

-- ALLOW Users to update their own documents
create policy "Users can update their own documents."
  on storage.objects for update
  using (
    bucket_id = 'documents' and
    auth.uid() = (storage.foldername(name))[1]::uuid
  );
