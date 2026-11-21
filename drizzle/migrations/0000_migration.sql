create table public.orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text not null,
  phone text not null,
  address jsonb not null,
  status text not null default 'placed',
  payment_method text not null default 'cod',
  payment_status text not null default 'pending',
  subtotal integer not null,
  discount integer not null default 0,
  shipping integer not null default 0,
  total integer not null,
  coupon text,
  created_at timestamptz not null default now()
);
grant all on public.orders to service_role;
alter table public.orders enable row level security;

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  name_snapshot text not null,
  size text not null,
  color_name text not null,
  price_snapshot integer not null,
  qty integer not null check (qty > 0)
);
grant all on public.order_items to service_role;
alter table public.order_items enable row level security;

create table public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
grant insert on public.newsletter to anon, authenticated;
grant all on public.newsletter to service_role;
alter table public.newsletter enable row level security;
create policy "anyone can subscribe" on public.newsletter for insert to anon, authenticated with check (length(email) between 5 and 255);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
grant insert on public.messages to anon, authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "anyone can send a message" on public.messages for insert to anon, authenticated with check (length(message) between 1 and 4000 and length(name) between 1 and 120 and length(email) between 5 and 255);