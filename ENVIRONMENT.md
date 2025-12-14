# ENVIRONMENT

## 実行環境

- Node.js（LTS）
- npm

※ Vite は使用しない

---

## フレームワーク / ライブラリ

- Next.js（App Router）
- React
- TypeScript
- Supabase

---

## 環境変数

- 環境変数は `.env*` ファイルで管理する
- 本リポジトリおよび AI は **値を生成・推測・出力してはならない**

---

## Supabase

- 認証：Supabase Auth
- DB：PostgreSQL
- Storage：Supabase Storage

※ RLS は **未実装または部分実装の可能性あり**
※ 実装状況は `IMPLEMENTATION_SUMMARY.md` を正とする

---

## ローカル開発

```bash
npm install
npm run dev
```
