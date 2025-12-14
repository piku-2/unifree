# TASKS

## ✅ Implemented (Spec Matched)

- 商品一覧（カード＋カテゴリ絞り込み）
  - 根拠: `app/page.tsx` → `components/Home` → `useItems` → `getItems` が Supabase `items` を取得し、カテゴリ選択で絞り込み。
- 購入申請（チャット開始）
  - 根拠: `app/items/[id]/page.tsx` が `startChat` server action を呼び出し、`chat_rooms` を作成/再利用して `/chat/[roomId]` へリダイレクト。
- チャット画面・送信
  - 根拠: `app/chat/[roomId]/page.tsx` が当事者チェック後に `messages` を表示し、`sendMessage` server action で送信・再検証。`app/chat/page.tsx` で一覧取得。
- ログイン（Supabase メール OTP）
  - 根拠: `components/Login.tsx` で `supabase.auth.signInWithOtp` を実行し、`app/auth/callback/AuthCallbackClient.tsx` で `exchangeCodeForSession` を処理。
- Server Actions API 定義
  - 根拠: `app/actions/items.ts`（createItem/getItems/getItem）、`app/actions/chat.ts`（startChat/sendMessage）、`app/actions/admin.ts`（adminCreateItem）が仕様の関数名で存在。
- Next.js App Router ルート骨子
  - 根拠: `app/` 配下に `/`、`/items/[id]`、`/sell`、`/mypage`、`/chat/[roomId]`、`/admin`、`/admin/items`、`/admin/orders` ページが実装済み。
- RLS ポリシー（items/chat_rooms/messages/admin_events）
  - 根拠: `supabase/rls_policies.sql` で所有者・当事者・管理者の RLS を定義し、`app/actions/error.ts` と各 Server Action で権限エラーをハンドリング。
  - 注意: 実運用では本 SQL を Supabase プロジェクトへ apply 済みであることが前提。
- Supabase スキーマ整合性
  - 根拠: `supabase/types.ts` と `src/libs/supabase/types.ts` を実際の利用カラム（string bigint id、owner_id/user_id、images/image_url、status(selling/reserved/sold)、chat_rooms/messages の updated_at/is_read、likes）に統一。
- 出品フォーム（画像 1 枚必須・仕様統一）
  - 根拠: `/sell` server フォームと `createItem` server action が title/description/price/category と画像 1 枚の必須入力に統一され、SPA `SellPage` は新規登録経路から外れて `/sell` への誘導のみを行う。
- 商品詳細（出品者情報表示）
  - 根拠: `/items/[id]` server ページが `getItem` で出品者プロフィール（username/avatar）を取得し、ページ内に表示。

---

## 🟡 Partially Implemented (Spec Gap)

- マイページ（購入申請一覧）
  - 現状: `/mypage` は自分の出品とお気に入りのみ表示。
  - 不足: 自分が購入申請した/参加中のチャット（chat_rooms）一覧を表示する。
  - 根拠: `components/MyPage.tsx`（`useMyItems`, `getLikedItems` のみ使用）。
- 管理者ダッシュボード（イベント設定）
  - 現状: `/admin` はリンクのみで `admin_events` 未使用。
  - 不足: イベント名/日付の作成・更新 UI と `admin_events` CRUD を実装。
  - 根拠: `app/admin/page.tsx`, `supabase/types.ts`.
- 管理者による出品登録
  - 現状: `/admin/items` は単品 `items` 挿入のみでイベント紐づけ・一括登録なし。
  - 不足: イベント選択/紐づけ（最低でも単品登録時にイベント ID 保持）と登録 UI の整備。
  - 根拠: `app/admin/items/page.tsx`, `app/actions/admin.ts`.
- オーダー管理
  - 現状: `/admin/orders` は `chat_rooms` の羅列のみでステータス管理や承認操作なし。
  - 不足: 申請ステータスの表示/更新・フィルタリングを追加する。
  - 根拠: `app/admin/orders/page.tsx`.

---

## ❌ Not Implemented (To Do)

- UI/UX 指針（Violet トーン + shadcn/ui）
  - 作業: カラーパレットと主要 UI を仕様トーンに合わせ、ボタン/カード/入力を shadcn/ui コンポーネントへ置き換える。
  - 目安の実装場所: `app/**` の画面コンポーネントや `components/**` の共通 UI。

## Google OAuth Login

あなたはこのリポジトリの実装を理解している開発自動化エージェントです。

【目的】
Supabase Google OAuth が「アプリ側でログイン済みとして認識されているか」を確認するため、
一時的なデバッグログを追加してください。

【やること（必須）】

- items を取得している処理（items API / hook / fetch ロジック）の直前で、
  supabase.auth.getSession() を呼び、
  console.log で session の有無を出力する。
- 出力形式は以下に完全一致させること：

  console.log('SESSION_CHECK:', session);

【制約】

- 既存のロジック・UI・挙動を変更しないこと
- デバッグ用ログのみ追加すること
- 新しいファイルは作らない
- supabase client は既存の import を使うこと
- 永続的な修正は行わない（確認用の一時コード）

【ヒント】

- items 一覧取得で 400 が出ているため、
  その fetch / select / query の直前が最適な挿入位置
- session が null か object かで、次の修正方針が決まる

【完了条件】

- ブラウザの Console に
  SESSION_CHECK: null
  または
  SESSION_CHECK: { ... }
  が表示される状態にする

diff が High にならないよう、最小変更で対応してください。
