-- Row Level Security policies for Supabase
-- Applies ownership and participant-based access control to core tables.

-- items: only owners can read/write their own rows
alter table public.items enable row level security;
alter table public.items force row level security;

drop policy if exists "Items owners select" on public.items;
create policy "Items owners select"
  on public.items
  for select
  using (owner_id = auth.uid());

drop policy if exists "Items owners insert" on public.items;
create policy "Items owners insert"
  on public.items
  for insert
  with check (owner_id = auth.uid());

drop policy if exists "Items owners update" on public.items;
create policy "Items owners update"
  on public.items
  for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Items owners delete" on public.items;
create policy "Items owners delete"
  on public.items
  for delete
  using (owner_id = auth.uid());

-- chat_rooms: only buyer or seller can access their rooms
alter table public.chat_rooms enable row level security;
alter table public.chat_rooms force row level security;

drop policy if exists "Chat rooms participants access" on public.chat_rooms;
create policy "Chat rooms participants access"
  on public.chat_rooms
  for all
  using (buyer_id = auth.uid() or seller_id = auth.uid())
  with check (buyer_id = auth.uid() or seller_id = auth.uid());

-- messages: only participants of the room can access messages
alter table public.messages enable row level security;
alter table public.messages force row level security;

drop policy if exists "Messages room participants access" on public.messages;
create policy "Messages room participants access"
  on public.messages
  for all
  using (
    exists (
      select 1
      from public.chat_rooms cr
      where cr.id = room_id
        and (cr.buyer_id = auth.uid() or cr.seller_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.chat_rooms cr
      where cr.id = room_id
        and (cr.buyer_id = auth.uid() or cr.seller_id = auth.uid())
    )
  );

-- admin_events: only admin role holders can access
alter table public.admin_events enable row level security;
alter table public.admin_events force row level security;

drop policy if exists "Admin events admin only" on public.admin_events;
create policy "Admin events admin only"
  on public.admin_events
  for all
  using (coalesce(auth.jwt() ->> 'role', '') = 'admin')
  with check (coalesce(auth.jwt() ->> 'role', '') = 'admin');
