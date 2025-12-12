# TASKS

## Backlog

- [DB/RLS] 仕様通りの RLS を適用・確認する（items: owner_id=auth.uid() で CRUD、chat_rooms/messages: 当事者のみ、admin_events: app_metadata.role='admin'）。
- [Storage] Supabase Storage の `items`（および avatars）バケットを公開読み取り＋認証アップロードで設定し、ポリシーを確認する。
- [Auth] Supabase Dashboard に本番 URL (`https://unifree-iota.vercel.app/auth/callback` 等) を登録し、Magic Link が本番でも戻ることを確認する。
- [Cleanup] 仕様外フィールド (`user_id`, `images`, `condition`, `updated_at` など) や Likes 機能の扱いを整理し、必要なら削除・非表示にする。

## In Progress

- なし

## Done

- [Env/Auth] Supabase クライアントを Next 用に client/server 分離し、環境変数を `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` に切り替えて認証動線を App Router で動作させる。
- [DB/Schema] Supabase 型定義を仕様準拠に更新する（profiles: id/username/created_at、items: bigint id + owner_id/title/description/price/category/status[selling|reserved|sold]/image_url/created_at、chat_rooms/messages/admin_events も bigint 指定）し、legacy カラムを扱わないよう型を揃える。
- [Auth/UI] ログイン（Magic Link）と `/auth/callback` を App Router のページとして移植し、メール OTP 送信・セッション確立を確認する。
- [Items/API] `app/actions/createItem` を実装し、単一画像アップロード（Storage 経由）→ `image_url` 保存で items に insert するサーバーアクションに統一する。
- [Items/API] `app/actions/getItems`/`getItem` を実装し、カテゴリ等フィルター付きで items を取得するサーバーアクションを提供する。
- [Chat/API] `app/actions/startChat(itemId)` と `sendMessage(roomId, content)` を実装し、buyer/seller 当事者チェック付きでチャット開始・送信できるようにする。
- [Admin/API] `app/actions/adminCreateItem` など管理者向けサーバーアクションを実装し、admin role でのみイベント商品登録・申請取得ができるようにする。
- [Items/UI] トップ `/` を商品一覧（カテゴリ絞り込み付き ItemCard グリッド）ページに置き換え、`getItems` サーバーアクションのデータを表示する。
- [Items/UI] `/sell` 出品フォームを App Router に移植し、`createItem` サーバーアクションを使って出品できるようにする。
- [Items/UI] `/items/[id]` 詳細ページを App Router に移植し、`getItem` サーバーアクションとチャット開始アクションを用いて購入申請を行えるようにする。
- [Items/UI] `/mypage` に自分の出品一覧と購入申請一覧（チャット/申請履歴）を表示し、サーバーアクション経由で取得する。
- [Chat/UI] `/chat/[roomId]` とチャット一覧を App Router に移植し、サーバーアクションを利用してメッセージ取得/送信する。
- [Admin/UI] `/admin`, `/admin/items`, `/admin/orders` を管理者判定付きで Supabase データと連携させ、イベント情報・商品登録・申請管理を動作させる。
- [Routing/Permissions] App Router で認証ガード・権限ガードを実装し、sell/mypage/chat/admin 系ページで未認証/非管理者のアクセスを制限する。
- [Auth] Supabase Auth の localhost 向け Site URL/Redirect URL（`http://localhost:3000` + `/auth/callback`）設定と Magic Link の動作確認済み。
- [Auth/UI] ログイン画面から Google ログインを削除し、メール認証のみ提示。
- [DB/Items] items→profiles の join を `items_owner_id_fkey` に修正し、出品者情報を取得できるようにした。
- [DB/RLS] items の RLS を `owner_id` ベースに統一し、`auth.uid() = owner_id` で insert/update/delete を許可するように調整済み（DB.md 反映済み）。
- [Setup/Routing] Next.js App Router を初期化し、`app/` 配下にレイアウトと `/`, `/items/[id]`, `/sell`, `/mypage`, `/chat/[roomId]`, `/admin`, `/admin/items`, `/admin/orders` の各ページ雛形を用意する。

## Notes

- [DB] legacy カラム/型の移行方針（削除かマイグレーションか）を決める必要あり。
- [Feature] Likes/気になる機能は仕様外。残すか外すか要判断。
- [Env] 現状 Vite/React Router 実装のため、Next.js 移行手順とスコープを擦り合わせてから着手する。
