# TASKS

## Backlog

- [DB/RLS] 仕様通りの RLS を適用・確認する（items: owner_id=auth.uid() で CRUD、chat_rooms/messages: 当事者のみ、admin_events: app_metadata.role='admin'）。
- [Storage] Supabase Storage の `items`（および avatars）バケットを公開読み取り＋認証アップロードで設定し、ポリシーを確認する。
- [Cleanup] 仕様外フィールド (`user_id`, `images`, `condition`, `updated_at` など) や Likes 機能の扱いを整理し、必要なら削除・非表示にする。
- [UX/Stability] Dev コンソールで `Extra attributes from the server: data-redeviation-bs-uid` 警告。ブラウザ拡張が `<html>` に `data-*` を付与している可能性を無効化/シークレットで再現確認し、必要なら `<html suppressHydrationWarning>` で抑止する。

## In Progress

-

## Done

- [Auth/UX] Supabase メールログインを PKCE + cookie フローに統一し、ホーム/一覧からダミーデータと `/items` 依存を排除して 404 を防止。
- [Auth] Supabase Magic Link を NEXT_PUBLIC_SITE_URL ベースのリダイレクトに統一し、/auth/callback で PKCE セッションを確立して `/` に戻るよう修正。

## Notes

- [DB] legacy カラム/型の移行方針（削除かマイグレーションか）を決める必要あり。
- [Feature] Likes/気になる機能は仕様外。残すか外すか要判断。
- [Env] 現状 Vite/React Router 実装のため、Next.js 移行手順とスコープを擦り合わせてから着手する。
