# **TASKS**

## **Done**

### **1. ドキュメントと仕様の集約**

- **Purpose**: 開発ルールと要件の統一
- **Files**: `AGENTS.md`, `CODEX.md`, `DESIGN.md`, `TECH.md`, `ENVIRONMENT.md`, `README.md`, `仕様書.md`, `仕様.md`
- **Output**: 現行仕様と運用ルールを参照できる状態
- **Constraints**: 内容はソース・オブ・トゥルースとして維持

---

### **2. 画面・機能スケルトンの実装**

- **Purpose**: モバイル前提の主要画面とコンポーネント土台の作成
- **Files**:
  `src/App.tsx`,
  `src/components/*`,
  `src/features/items/*`,
  `src/features/chat/*`,
  `src/features/user/*`,
  `src/features/admin/components/AdminDashboard.tsx`
- **Output**: 一覧 / 詳細 / 出品 / マイページ / チャット / 管理画面の UI 下地とフック
- **Constraints**: ローカル state による暫定遷移、実データ連携は未着手

---

### **3. Supabase クライアントと基本 API 追加**

- **Purpose**: DB / Storage / API 呼び出しの入口の整備
- **Files**:
  `src/libs/supabase/client.ts`,
  `src/libs/supabase/types.ts`,
  `src/features/items/api/*`,
  `src/features/chat/api/*`
- **Output**: CRUD / チャット用 API ラッパーと Zod スキーマの雛形
- **Constraints**: DB 型未定義、エラーハンドリングは最低限

---

## **Todo**

### **1. アプリシェルのビルド修正とナビゲーション整理**

- **Purpose**: AdminDashboard の未インポート解消とナビの整備
- **Files**: `src/App.tsx`, `src/components/Header.tsx`
- **Output**: 型エラーなしでビルド成功し、ナビゲーションが正常動作
- **Constraints**: モバイル 1 カラム UI を保持、デザイン変更なし

---

### **2. ルーティング導入（URL ベース遷移）**

- **Purpose**: ローカル state に依存しない URL 遷移へ移行
- **Files**: `src/main.tsx`, `src/App.tsx`, `src/config/routes.ts`
- **Output**:
  `/`, `/items/:id`, `/sell`, `/mypage`, `/chat/:roomId`, `/admin`
  へ対応するルーター構成
- **Constraints**: Vite + React Router 前提、Next.js 専用 API は使用しない

---

### **3. 認証 UI と Supabase Auth 連携**

- **Purpose**: Login / Register を Supabase Auth に接続し、AuthGate で保護
- **Files**:
  `src/components/Login.tsx`,
  `src/components/Register.tsx`,
  `src/features/user/hooks/useAuth.ts`,
  `src/features/user/components/AuthGate.tsx`
- **Output**: メール / Magic Link 認証、エラー・ローディング表示、未ログイン時ガード
- **Constraints**: 秘密情報は扱わない、UI デザイン変更なし

---

### **4. 出品フローのデータ連携とバリデーション強化**

- **Purpose**: Form → Confirm → createItem を実データへ接続
- **Files**:
  `ItemForm`, `FormConfirm`, `ImageUpload`,
  `useItemForm.ts`,
  `createItem.ts`, `updateItem.ts`
- **Output**:

  - Zod によるバリデーション
  - Storage への画像保存（bucket: `items`）
  - トースト / エラー表示

- **Constraints**: UI はそのまま、カテゴリ / ステータスを schema 準拠で保存

---

### **5. 商品一覧 / 詳細のデータ表示整備**

- **Purpose**: Supabase データに基づく一覧・詳細表示
- **Files**:
  `ItemList`, `ItemCard`, `ItemDetail`, `ItemCarousel`,
  `PurchaseButton`, `SellerInfo`,
  Hooks: `useItems`, `useItem`
- **Output**:
  正常なローディング / エラー / 空状態と、CTA → チャットの導線
- **Constraints**: 画像 1:1 を維持、UI デザインは変更しない

---

### **6. マイページの出品管理とお気に入り処理**

- **Purpose**: 出品一覧の CRUD とお気に入りの改善
- **Files**:
  `MyPage.tsx`,
  `MyItemList`, `MyItemCard`,
  Hooks: `useMyItems.ts`,
  API: `getMyItems`, `deleteItem`, `updateItem`
- **Output**:

  - 認証済みユーザーの出品管理
  - お気に入りのデータ連携または整理

- **Constraints**: 認証必須、UI 構造は保持

---

### **7. チャット一覧 / ルームの安定化とリアルタイム補強**

- **Purpose**: メッセージの取得・購読の安定化
- **Files**:
  API: `getChatRooms`, `getMessages`, `sendMessage`, `createChatRoom`
  Hook: `useChat.ts`
  Components: `ChatList`, `ChatRoom`
- **Output**:

  - 最新メッセージ付き一覧
  - リアルタイム購読
  - 適切なクリーンアップ

- **Constraints**: Supabase Realtime を使用、不要な全件 join をしない

---

### **8. 管理者フローとイベント系機能（段階導入）**

- **Purpose**: 最低限の admin 用 UI と権限チェック
- **Files**:
  `AdminDashboard.tsx`,
  `admin/items`, `admin/orders`（予定）
- **Output**:

  - 管理者のみ閲覧可能な一覧
  - 未実装部分には placeholder を用意

- **Constraints**: RLS に基づく role 判定、UI を壊さない

---

### **9. Supabase 型定義と環境変数の強化**

- **Purpose**: Database 型の整備と env サンプルの更新
- **Files**:
  `src/libs/supabase/types.ts`,
  `src/libs/supabase/client.ts`,
  `.env.sample`
- **Output**:
  items / rooms / messages / profiles の型定義
  安全なクライアント初期化
  最新の環境変数サンプル
- **Constraints**: 値は空のまま、TypeScript strict を維持

---

### **10. 認証ドメイン制限（ac.jp のみ許可）**

- **Purpose**: 学生専用メール（ac.jp ドメイン）以外の登録を禁止
- **Files**:
  `src/components/Register.tsx`（フロント：メールドメイン判定）
  `supabase/functions/auth-signup-check/index.ts`（サーバー：Auth Hook / Edge Function）
- **Output**:

  - フロント側で `.ac.jp` 以外の登録をブロック
  - サーバー側で API 経由の登録も完全拒否

- **Constraints**:

  - Magic Link / Email auth と整合
  - 不正ドメイン時は UI にエラー表示

---
