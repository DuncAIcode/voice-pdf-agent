-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Documents Table
create table if not exists documents (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    file_path text not null,
    original_name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Form Fields Table (Extracted keys from PDF)
create table if not exists form_fields (
    id uuid primary key default uuid_generate_v4(),
    document_id uuid references documents(id) on delete cascade not null,
    field_name text not null,
    field_label text,
    field_type text,
    page_number integer,
    coordinates jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transcriptions Table (Diarized text)
create table if not exists transcriptions (
    id uuid primary key default uuid_generate_v4(),
    document_id uuid references documents(id) on delete cascade not null,
    speaker text,
    content text,
    start_time float,
    end_time float,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table documents enable row level security;
alter table form_fields enable row level security;
alter table transcriptions enable row level security;

-- Policies (Simple user isolation)
create policy "Users can view their own documents" on documents for select using (auth.uid() = user_id);
create policy "Users can insert their own documents" on documents for insert with check (auth.uid() = user_id);

create policy "Users can view form fields of their documents" on form_fields for select using (
    exists (select 1 from documents where id = form_fields.document_id and user_id = auth.uid())
);

create policy "Users can view transcriptions of their documents" on transcriptions for select using (
    exists (select 1 from documents where id = transcriptions.document_id and user_id = auth.uid())
);
