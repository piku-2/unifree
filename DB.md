
## 訂正版 Supabase セットアップガイド（完全版）

````md
# Supabase セットアップガイド（修正版）

このプロジェクトで使用する Supabase のセットアップ手順とデーターベース構築用 SQL をまとめます。

## 1. プロジェクトの作成

1. [Supabase](https://supabase.com/) にアクセスし、ログインします。
2. 「New Project」をクリックします。
3. **Name**: プロジェクト名（`free market`）を入力します。
4. **Database Password**: 強力なパスワードを設定し、忘れないようにメモしてください。
5. **Region**: 最寄りのリージョン（例: `Tokyo`）を選択します。
6. 「Create new project」をクリックし、セットアップが完了するまで数分待ちます。

## 2. 環境変数の設定

1. ダッシュボードのサイドバーから **Settings** (歯車アイコン) > **API** を開きます。
2. **Project URL** と **anon public** キーをコピーします。
3. プロジェクトのルートディレクトリに `.env` ファイルを作成し（`.env.sample` をコピー）、以下のように記述します。

```env
VITE_SUPABASE_URL=あなたのProject URL
VITE_SUPABASE_ANON_KEY=あなたのanon publicキー
````

## 3. データベース構築 (SQL)

ダッシュボードのサイドバーから **SQL Editor** を開き、以下の SQL を実行してテーブルを作成します。

> [!IMPORTANT]
> 以下の SQL は、ユーザー認証 (Supabase Auth) と連動する `users` テーブル、および `items`, `chat_rooms`, `messages` テーブルを作成し、Row Level Security (RLS) を設定します。

```sql
-- 0. 必要に応じて拡張が有効になっていることを確認（Supabase では通常デフォルト有効）
-- create extension if not exists "pgcrypto";

-----------------------------------------
-- 1. Users テーブル (public config)
-----------------------------------------

-- auth.users の変更をトリガーして自動同期する設定
create table public.users (
  id uuid not null references auth.users on delete cascade,
  name text,
  avatar_url text,
  department text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

alter table public.users enable row level security;

create policy "Public profiles are viewable by everyone." on public.users
  for select using (true);

create policy "Users can insert their own profile." on public.users
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.users
  for update using (auth.uid() = id);

-- auth.users の新規登録時に public.users を自動作成するトリガー
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, department)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'department');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-----------------------------------------
-- 2. Items テーブル (商品)
-----------------------------------------

create table public.items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,

  title text not null,
  description text not null,
  price integer not null,

  -- 画像情報: JSONB に変更（例: [{ "url": "...", "width": 800, "height": 600 }]）
  images jsonb default '[]'::jsonb,

  category text not null,
  condition text,

  status text default 'on_sale' check (status in ('on_sale', 'sold_out', 'trading')),

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.items enable row level security;

create policy "Items are viewable by everyone." on public.items
  for select using (true);

create policy "Users can insert their own items." on public.items
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own items." on public.items
  for update using (auth.uid() = user_id);

create policy "Users can delete their own items." on public.items
  for delete using (auth.uid() = user_id);


-----------------------------------------
-- 3. Chat Rooms テーブル (チャットルーム)
-----------------------------------------

create table public.chat_rooms (
  id uuid default gen_random_uuid() primary key,
  item_id uuid references public.items(id) not null,
  buyer_id uuid references public.users(id) not null,
  seller_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 同じ (item, buyer, seller) の組み合わせで複数ルームが作られないようにする
create unique index chat_room_unique
  on public.chat_rooms (item_id, buyer_id, seller_id);

alter table public.chat_rooms enable row level security;

create policy "Users can view their own chat rooms." on public.chat_rooms
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Users can create chat rooms." on public.chat_rooms
  for insert with check (auth.uid() = buyer_id);

create policy "Users can update their own chat rooms." on public.chat_rooms
  for update using (auth.uid() = buyer_id or auth.uid() = seller_id);


-----------------------------------------
-- 4. Messages テーブル (メッセージ)
-----------------------------------------

create table public.messages (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references public.chat_rooms(id) on delete cascade not null,
  sender_id uuid references public.users(id) not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

create policy "Users can view messages in their rooms." on public.messages
  for select using (
    exists (
      select 1 from public.chat_rooms
      where id = messages.room_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

create policy "Users can insert messages in their rooms." on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.chat_rooms
      where id = room_id
      and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );
```

## 4. Storage の設定

商品画像を保存するための Storage Bucket を作成します。

1. サイドバーから **Storage** を開きます。
2. 「New Bucket」をクリックします。
3. **Name** に `items` と入力します。
4. **Public** (Anyone can read objects) を **ON** にします。
5. 「Save」をクリックします。
6. Policies タブで `items` バケットに対し、「New Policy」を作成します。

   * "Allow authenticated uploads" テンプレートを使用し、ログインユーザーにアップロード許可を与えます。

### Policy SQL Example (Optional)

```sql
-- Storage policies via SQL (Advanced)
insert into storage.buckets (id, name, public) values ('items', 'items', true);

create policy "Public Access" on storage.objects
  for select using ( bucket_id = 'items' );

create policy "Authenticated Insert" on storage.objects
  for insert with check ( bucket_id = 'items' and auth.role() = 'authenticated' );
```

````

---

## 注意点（運用・実装まわり）

1. **すでにテーブルを作っている場合の注意**
   - `items.images` など、型変更が入っているので、本番 DB ですでに運用中なら `alter table` でマイグレーションする必要があります（`drop table` するとデータが消える）。
   - 開発中で DB を捨てて良いなら、一度テーブル削除 → 上記 SQL をそのまま流すのがシンプルです。

2. **フロントエンド側での images の扱い**
   - 型は `jsonb` なので、TypeScript 側では
     ```ts
     type ItemImage = { url: string; width?: number; height?: number };
     type Item = { images: ItemImage[]; /* ... */ };
     ```
     のような形で扱うのがおすすめです。

3. **チャットルーム作成時のエラーハンドリング**
   - `create unique index` によって、同じ組み合わせで `insert` すると DB 側でエラーになります。
   - アプリ側では「既存のチャットルームがあればそれを再利用する」ロジックにするか、
     - 先に `select` でルームを探す
     - なければ `insert`
     - あればそのルームの `id` に遷移
     のように制御すると UX が安定します。

---
