# TASKS

## Done
- [done] ドキュメントと仕様の集約  
  - Purpose: 開発ルールと要件の統一。  
  - Files: AGENTS.md, CODEX.md, DESIGN.md, TECH.md, ENVIRONMENT.md, README.md, 仕様書.md, 仕様.md.  
  - Output: 現行仕様と運用ルールを参照できる状態。  
  - Constraints: 内容はソース・オブ・トゥルースとして維持。
- [done] 画面・機能スケルトンの実装  
  - Purpose: モバイル前提の主要画面とコンポーネント土台を用意。  
  - Files: src/App.tsx, src/components/*, src/features/items/*, src/features/chat/*, src/features/user/*, src/features/admin/components/AdminDashboard.tsx.  
  - Output: 一覧/詳細/出品/マイページ/チャット/管理画面の UI 下地とフック。  
  - Constraints: ローカル state ナビゲーションで暫定遷移、実データ連携は未完。
- [done] Supabase クライアントと基本 API 追加  
  - Purpose: DB/Storage/API 呼び出しの入口を準備。  
  - Files: src/libs/supabase/client.ts, src/libs/supabase/types.ts, src/features/items/api/*, src/features/chat/api/*.  
  - Output: CRUD/チャット用の基本 API ラッパーと Zod スキーマ下地。  
  - Constraints: DB 型未定義、エラーハンドリング・型安全性は最小。

## Todo
1) [todo] アプリシェルのビルド修正とナビゲーション整理  
   - Purpose: AdminDashboard の未インポート解消とボトムナビのアイコン/遷移整備。  
   - Files: src/App.tsx, src/components/Header.tsx ほか必要箇所。  
   - Output: 型エラーなくビルドできるアプリシェルと動作するナビゲーション。  
   - Constraints: モバイル 1 カラム UI を保持、デザイン変更なし。
2) [todo] ルーティング導入（URL ベース遷移）  
   - Purpose: ローカル state 依存を解消し、`/`, `/items/:id`, `/sell`, `/mypage`, `/chat/:roomId`, `/admin` 系へマップ。  
   - Files: src/main.tsx, src/App.tsx（またはルートコンポーネント新設）, src/config/routes.ts。  
   - Output: URL 直アクセス/履歴対応のルーター構成と画面遷移。  
   - Constraints: Vite/React Router 想定、Next 専用 API は使わない。
3) [todo] 認証 UI と Supabase Auth 連携  
   - Purpose: Login/Register を Supabase Auth に接続し、AuthGate で保護。  
   - Files: src/components/Login.tsx, src/components/Register.tsx, src/features/user/hooks/useAuth.ts, src/features/user/components/AuthGate.tsx。  
   - Output: メール/Magic Link でのログイン・登録、エラー/ローディング表示、未ログイン時のガード。  
   - Constraints: 秘密情報は扱わず、UI デザインを変更しない。
4) [todo] 出品フローのデータ連携とバリデーション強化  
   - Purpose: ItemForm → FormConfirm → createItem を接続し、画像アップロードと Zod 検証を実データに反映。  
   - Files: src/features/items/components/{ItemForm,FormConfirm,ImageUpload}, src/features/items/hooks/useItemForm.ts, src/features/items/api/{createItem,updateItem}.  
   - Output: バリデーション済みの出品/編集送信、Storage への画像保存、トースト/エラー表示。  
   - Constraints: バケット `items` を使用、UI 変更なし、ステータス/カテゴリを schema 準拠で保存。
5) [todo] 商品一覧/詳細のデータ表示整備  
   - Purpose: Supabase データに基づく検索・フィルタ・ソートと詳細表示（ユーザー情報/カルーセル/購入相談ボタン）。  
   - Files: src/features/items/components/{ItemList,ItemCard,ItemDetail,ItemCarousel,PurchaseButton,SellerInfo}, src/features/items/hooks/{useItems,useItem}.  
   - Output: 正常なローディング/エラー/空状態と CTA からチャット開始の導線。  
   - Constraints: 画像 1:1 比率を維持、UI デザインはそのまま。
6) [todo] マイページの出品管理とお気に入り処理  
   - Purpose: 自分の出品一覧に編集/削除を実装し、ハードコードされたお気に入りを実データに置換または非表示。  
   - Files: src/components/MyPage.tsx, src/features/user/components/{MyItemList,MyItemCard}, src/features/items/hooks/useMyItems.ts, src/features/items/api/{getMyItems,deleteItem,updateItem}.  
   - Output: 認証済みユーザーの出品管理 UI（削除確認、編集遷移）と整合の取れたお気に入り表示。  
   - Constraints: 認証必須、UI 構造は維持。
7) [todo] チャット一覧/ルームの安定化とリアルタイム補強  
   - Purpose: last message 取得の最適化、パートナー/商品情報の整形、エラー/ローディング対応、リアルタイム購読の健全化。  
   - Files: src/features/chat/api/{getChatRooms,getMessages,sendMessage,createChatRoom}, src/features/chat/hooks/useChat.ts, src/features/chat/components/{ChatList,ChatRoom}.  
   - Output: 最新メッセージ付きチャット一覧と途切れない受信・送信、適切なクリーンアップ。  
   - Constraints: Supabase Realtime を利用、不要な全件 join を避ける。
8) [todo] 管理者フローとイベント系の整備（必要なら段階導入）  
   - Purpose: AdminDashboard の権限確認強化とイベント/オーダー管理の最小実装または明示的スキップ。  
   - Files: src/features/admin/components/AdminDashboard.tsx, 追加予定の admin/items / admin/orders ページ。  
   - Output: 管理者のみが閲覧・削除できる一覧と、未実装機能には明確なプレースホルダーを表示。  
   - Constraints: RLS を前提にメタデータで判定、UI デザインは保持。
9) [todo] Supabase 型定義と環境変数の強化  
   - Purpose: DB スキーマを Database 型に反映し、環境変数欠如時の挙動と .env.sample を整理。  
   - Files: src/libs/supabase/types.ts, src/libs/supabase/client.ts, .env.sample。  
   - Output: items/rooms/messages/profiles の型定義、開発時の安全なクライアント初期化、最新の環境変数サンプル。  
   - Constraints: 値は空のまま、TypeScript strict を維持。
