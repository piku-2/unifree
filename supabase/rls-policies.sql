-- items RLS
alter table public.items enable row level security;
create policy if not exists "items_select_all" on public.items for select using (true);
create policy if not exists "items_insert_owner" on public.items for insert with check (owner_id = auth.uid());
create policy if not exists "items_update_owner" on public.items for update using (owner_id = auth.uid());
create policy if not exists "items_delete_owner" on public.items for delete using (owner_id = auth.uid());

-- chat_rooms / messages RLS: only participants
alter table public.chat_rooms enable row level security;
create policy if not exists "chat_rooms_participants" on public.chat_rooms for all
  using (buyer_id = auth.uid() or seller_id = auth.uid())
  with check (buyer_id = auth.uid() or seller_id = auth.uid());

alter table public.messages enable row level security;
create policy if not exists "messages_participants" on public.messages for all
  using (
    exists (
      select 1 from public.chat_rooms c
      where c.id = room_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.chat_rooms c
      where c.id = room_id and (c.buyer_id = auth.uid() or c.seller_id = auth.uid())
    )
  );

-- admin_events RLS: admin only (requires app_metadata.role = 'admin')
alter table public.admin_events enable row level security;
create policy if not exists "admin_events_select_admin" on public.admin_events
  for select using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
create policy if not exists "admin_events_write_admin" on public.admin_events
  for all using (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
