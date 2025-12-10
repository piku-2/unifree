# 🚫 **【触っちゃダメ】基本的に手動で編集しないディレクトリ**

## **1. `node_modules/`**

- 自動生成物。書き換え禁止（壊れます）
- ライブラリのコードを直接編集するのは NG（アップデートで消える）

## **2. `src/app/api/*`（一部注意）**

- **Route Handler を自分で書くのは OK**
- ただし **自動生成された型や内部ファイルは作らない**
- Server Actions を中心に使うなら `api/` は最低限で OK

## **3. `src/components/figma/`**

- Figma から自動生成される UI の置き場扱い
- 原則「上書きされても問題ない UI 断片」を置く場所
- **ロジックやビジネス用途の UI はここに置かない**

## **4. `src/styles/`（過度に触るのは非推奨）**

- Tailwind を使うならここは **global.css くらいしか使わない**
- ロジックで使うデザイン変数は `config/` や `ui/` 内に移す方がよい

---

# 🟨 **【注意】触ってもいいが責務に気をつける場所**

## **5. `src/components/common/`**

- ページ横断の UI（Spinner, EmptyState, Layout など）だけ置くべき
- **ドメイン依存 UI はここに置かない**

## **6. `src/hooks/`**

- アプリ横断の汎用カスタムフックだけ置く
- items や users など、特定ドメインのロジックは features 配下で管理

---

# 🟩 **【積極的に触る場所】今後の開発で最も重要なディレクトリ**

---

# ① `src/app/**`（Next.js のページ・レイアウト・Server Actions）

ここが **アプリの入口（ルーティング）**。

### 役割

- ページ
- レイアウト
- Loading UI
- Server Actions（ページ専用ロジック）

### 触る具体例

```
src/app/(public)/items/page.tsx
src/app/dashboard/page.tsx
src/app/(auth)/login/page.tsx
```

---

# ② `src/features/*`（アプリのコアロジック。最重要）

例：

```
src/features/items/
src/features/users/
```

ここは **“ドメインのすべてをまとめる場所”**。

### 置くもの

| 種類        | 説明                                                         |
| ----------- | ------------------------------------------------------------ |
| components/ | アイテムカード、プロフィールカードなど “特定ドメイン専用 UI” |
| hooks/      | items を取得する useItems(), useCreateItem() など            |
| actions.ts  | Supabase + Server Actions を使ったロジック                   |
| schema.ts   | Zod で型バリデーション                                       |
| types.ts    | 型情報（必要なら）                                           |

Next.js が巨大化してもここさえ守れば破綻しません。

---

# ③ `src/libs/*`（共通基盤レイヤー）

例：

```
src/libs/supabase/
src/libs/auth/
src/libs/utils/
```

### 役割

| ディレクトリ | 役割                                                       |
| ------------ | ---------------------------------------------------------- |
| supabase/    | SSR/Client 用 Supabase クライアント、型、Service Role 処理 |
| auth/        | セッション管理、middleware helpers                         |
| utils/       | 共通関数（formatDate や priceFormat など）                 |

**ビジネスロジックは絶対ここに書かない（features に寄せる）** のがコツ。

---

# ④ `src/components/ui/`（shadcn/ui 拡張・デザインコンポーネント）

UI ライブラリの再利用部品を置く場所。

例：

- Button
- Input
- Dialog
- Card

ここは **ロジック禁止**。
「スタイルを適用しただけの純粋な UI パーツ」に限定する。

---

# ⑤ `src/schemas/`（共通 Zod スキーマ）

アプリ横断で再利用されるスキーマを置く。
ドメイン固有のスキーマは features に置く。

---

# ⑥ `src/config/`（設定情報だけ）

- ルーティング設定
- ナビゲーション設定
- feature flags
- 定数

など **アプリを動かすための “変更される可能性がある値”** を管理。

---

# 🎯 最終まとめ：この構造で “絶対に守るべきルール”

| ディレクトリ          | 触る？           | 役割                               |
| --------------------- | ---------------- | ---------------------------------- |
| node_modules          | ❌               | 自動生成・編集禁止                 |
| src/app               | ⭕               | ページ／レイアウト／Server Actions |
| src/features          | ⭕⭕⭕（最重要） | ビジネスロジック・UI（ドメイン別） |
| src/libs              | ⭕               | Supabase・auth・utils の基盤       |
| src/components/ui     | ⭕               | UI ライブラリ（shadcn）            |
| src/components/common | ⭕               | 汎用 UI                            |
| src/hooks             | ⭕               | 汎用 Hooks                         |
| src/schemas           | ⭕               | 共通 Zod                           |
| src/config            | ⭕               | 設定                               |
| src/styles            | △                | global.css などだけ                |
| src/components/figma  | △                | 自動生成の置き場（ロジック禁止）   |
