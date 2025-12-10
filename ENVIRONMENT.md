# ENVIRONMENT

## Required Versions

- Node: 18+
- npm: 9+
- Vite: latest
- TypeScript: latest

---

## Environment Variables (.env)

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= # サーバー処理でのみ使用。フロントでは使わない。

※ Codex は値を絶対に生成しない

---

## Local Setup

npm install
npm run dev

---

## Build

## npm run build

## Supabase Setup

- Auth → Email enabled
- Storage → public バケット `items`
- Tables → items / messages / rooms を作成
- RLS → Authenticated のみ読み書き可

---

## Directory Safety

- `src/components/figma` は読み取り専用
- `src/styles` は生成物
- `node_modules` は絶対に編集禁止
