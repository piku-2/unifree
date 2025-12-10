# TECH

## Tech Stack

- Frontend: Vite + React + TypeScript
- State: React Hooks + Context (必要に応じて Zustand 追加可)
- UI: shadcn/ui + Tailwind CSS
- Storage / Backend: Supabase (Auth / Table / Storage / Realtime)

---

## Data Schema (Supabase)

### `items`

| column      | type      | notes                   |
| ----------- | --------- | ----------------------- |
| id          | uuid      | PK                      |
| user_id     | uuid      | FK (auth.users)         |
| title       | text      | not null                |
| description | text      | not null                |
| price       | integer   | not null                |
| images      | text[]    | Supabase Storage のパス |
| created_at  | timestamp | default now()           |

### `messages`

| column     | type      | notes         |
| ---------- | --------- | ------------- |
| id         | uuid      | PK            |
| room_id    | uuid      | Chat room     |
| sender_id  | uuid      | FK            |
| body       | text      | optional      |
| image_url  | text      | optional      |
| created_at | timestamp | default now() |

### `rooms`

| column    | type | notes    |
| --------- | ---- | -------- |
| id        | uuid | PK       |
| item_id   | uuid | FK items |
| buyer_id  | uuid | FK users |
| seller_id | uuid | FK users |

---

## Directory Structure Rules

src/
├─ features/
│ ├─ items/
│ │ ├─ components/
│ │ ├─ hooks/
│ │ ├─ api/
│ │ └─ pages/
│ ├─ messages/
│ └─ user/
├─ libs/
├─ config/
├─ components/ui (shadcn)
├─ components/common
└─ components/figma (read-only)

---

## API Layer

各 feature に `api/` を作り、Supabase クエリを集約：

例： `src/features/items/api/getItems.ts`

## export async function getItems() { ... }

## Auth

- Supabase Auth（email ログイン or Magic Link）
- ログインしていない場合、購入相談・出品はできない

---

## Validation

- Zod を使う（shadcn と相性が良い）
- すべてのフォームに schema をつける

---

## Error Handling

- try/catch + toast
- API エラーは UI 層ではなく feature の内部で処理

---

## Loading State

- skeleton + spinner
- isLoading / isSubmitting を統一管理

---

## Realtime (Optional)

- messages テーブルを subscribe してチャット自動更新
