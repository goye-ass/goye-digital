-- ================================================================
-- GOYE DIGITAL MARKETPLACE - DATABASE SCHEMA & RLS POLICIES
-- ================================================================

create table if not exists products (
  product_id text primary key,
  product_name text not null,
  category text not null,
  short_description text,
  full_description text,
  version text default '1.0',
  creator text default 'GOYE Team',
  ownership_status text not null check (ownership_status in ('OWNED_BY_GOYE','CREATED_FOR_GOYE','LICENSED_FOR_RESALE','PENDING_RIGHTS_REVIEW','DO_NOT_PUBLISH')),
  rights_documentation_status text default 'Verified',
  commercial_use_permission_status text default 'Commercial Allowed',
  file_type text,
  file_size text,
  price integer not null,
  currency text default 'NGN',
  product_status text default 'Active' check (product_status in ('Active','Draft','Archived')),
  publication_date date default current_date,
  last_updated date default current_date,
  download_count integer default 0,
  sales_count integer default 0,
  file_path_private text,
  preview_image text,
  license_terms text default 'Single buyer license, commercial use allowed, no redistribution/resale of file itself',
  usage_instructions text default 'Download, open in compatible app, customize for your business',
  refund_policy_ref text default 'Digital product, no refund after download, defective file replacement within 7 days'
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  product_id text references products(product_id),
  email text not null,
  amount integer not null,
  currency text default 'NGN',
  paystack_reference text,
  flutterwave_transaction_id text,
  status text default 'pending',
  download_url text,
  created_at timestamp default now()
);

-- RLS: Public can only read approved products
alter table products enable row level security;

create policy "public can read approved active products" on products for select using (
  ownership_status in ('OWNED_BY_GOYE','CREATED_FOR_GOYE','LICENSED_FOR_RESALE') 
  and product_status = 'Active'
);

create policy "admin full access" on products for all using (
  auth.role() = 'authenticated'
);
