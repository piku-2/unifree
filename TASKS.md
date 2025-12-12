# TASKS

## Backlog

- [DB/RLS] 仕様通りの RLS を適用・確認する（items: owner_id=auth.uid() で CRUD、chat_rooms/messages: 当事者のみ、admin_events: app_metadata.role='admin'）。
- [Storage] Supabase Storage の `items`（および avatars）バケットを公開読み取り＋認証アップロードで設定し、ポリシーを確認する。
- [Auth] Supabase Dashboard に本番 URL (`https://unifree-iota.vercel.app/auth/callback` 等) を登録し、Magic Link が本番でも戻ることを確認する。
- [Cleanup] 仕様外フィールド (`user_id`, `images`, `condition`, `updated_at` など) や Likes 機能の扱いを整理し、必要なら削除・非表示にする。
- [UX/Stability] Dev コンソールで `Extra attributes from the server: data-redeviation-bs-uid` 警告。ブラウザ拡張が `<html>` に `data-*` を付与している可能性を無効化/シークレットで再現確認し、必要なら `<html suppressHydrationWarning>` で抑止する。

## In Progress

- なし

## Done

- [Build/Config] `next.config.js` が ESM export のまま `package.json` に `"type": "module"` がないため `MODULE_TYPELESS_PACKAGE_JSON` 警告が出る。影響を確認しつつ (a) CJS へ戻す、(b) `next.config.mjs` へリネーム、(c) `type: module` 追加のいずれかで解消する。 → CJS 形式に戻し、警告解消。

## Notes

- [DB] legacy カラム/型の移行方針（削除かマイグレーションか）を決める必要あり。
- [Feature] Likes/気になる機能は仕様外。残すか外すか要判断。
- [Env] 現状 Vite/React Router 実装のため、Next.js 移行手順とスコープを擦り合わせてから着手する。
