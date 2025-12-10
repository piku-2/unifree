# DESIGN

## Overview

このアプリは、大学内の学生が手軽に「出品・購入・取引メッセージ」を行えるミニマルなフリマアプリ。
Web アプリとしてモバイル最適化され、最低限の操作で商品が売買できる UI/UX を提供する。

全体は以下の 5 領域で構成される：

- ホーム（商品一覧）
- 商品詳細
- 出品フォーム
- マイページ（自分の出品物管理）
- 取引メッセージ画面

---

## Global UI Rules

- モバイルファースト。1 カラムレイアウト。
- カードデザイン中心。画像比率は 1:1。
- primary 色は青系、アクセントは紫系。
- shadcn/ui コンポーネントを基盤とする。
- ローディング、エラー、空状態を明確に表示する。

---

## Screen Designs

### 1. ホーム（商品一覧）

- 商品カード表示（画像 / タイトル / 価格）
- カテゴリフィルター（後から追加可能）
- 検索バー
- 新着順・人気順の並び替え

**Components**

- `<ItemCard />`
- `<SearchBar />`
- `<ItemList />`

---

### 2. 商品詳細

- 画像カルーセル
- 商品名 / 価格 / 説明
- 出品者情報
- 「メッセージして購入相談」ボタン

**Components**

- `<ItemCarousel />`
- `<SellerInfo />`
- `<PurchaseButton />`

---

### 3. 出品フォーム

- 入力項目：画像（複数）/ タイトル / 説明 / カテゴリ / 価格
- Draft → Confirm → Submit の 3 段階フロー

**Components**

- `<ImageUpload />`
- `<ItemForm />`
- `<FormConfirm />`

---

### 4. マイページ

- 自分の出品一覧
- 編集 / 削除
- プロフィール編集（後で実装）

**Components**

- `<MyItemCard />`
- `<MyItemList />`

---

### 5. 取引メッセージ画面

- チャット形式
- テキスト送信 / 画像送信（任意）
- 取引が成立したら “取引完了” を双方が押す

**Components**

- `<ChatMessage />`
- `<ChatInput />`

---

## Component Hierarchy

App
├─ features/items
│ ├─ ItemList
│ ├─ ItemCard
│ ├─ ItemDetail
│ └─ ItemForm
├─ features/messages
│ ├─ ChatRoom
│ └─ ChatBubble
├─ features/user
│ ├─ MyPage
│ └─ Profile
└─ components/ui (shadcn)

---

## User Flow

### 商品購入フロー

1. 商品一覧を見る
2. 商品をタップ
3. 詳細を見る
4. 購入相談ボタン → チャット開始
5. 出品者と相談
6. 取引完了

### 出品フロー

1. マイページ
2. 出品ボタン
3. 入力
4. 確認
5. 投稿
6. 一覧に反映

---

## Nicer Extras（後で TASKS.md に含めない）

- プッシュ通知（Supabase Realtime）
- お気に入り機能
