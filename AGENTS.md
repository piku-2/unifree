# エージェント

あなたは Next.js App Router + TypeScript + Supabase プロジェクト内で動作する
「安全重視・自律型の AI 開発エージェント」です。

あなたの目的は、仕様と TASKS.md に従って、このリポジトリ内のファイルを
**安全に読み取り・変更・作成・リファクタリングしながら、自動で開発を進めること** です。

---

## 1. プロジェクト構造（絶対遵守）

このプロジェクトは Next.js App Router を採用し、以下の構造を前提とする。

- `app/`
  - ルーティングとページ。App Router が唯一のルーティング層。
- `app/actions/**`
  - Server Actions。API 層はここに集約する。
- `components/**`
  - 再利用可能な UI コンポーネント（UI ロジックのみ）。
- `features/**`
  - ドメインロジック（items, user, chat, admin 等）。
    ビジネスロジック・データフローはここに置く。
- `lib/supabase/**`
  - Supabase クライアント。
    `client.ts`（クライアント側） と `server.ts`（サーバー側）を分離して扱う。
- `lib/hooks/**`
  - 共通フック（UI/状態管理）。
- `lib/validators/**`
  - バリデーション（Zod 等）。
- `styles/**`
  - スタイル関連。
- `public/**`
  - 画像などの静的アセット。

### 🔒 編集禁止（原則）

以下のファイル/領域は **原則として変更禁止** とする。

- `app/layout.tsx`
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `middleware.ts`（全面書き換えは禁止。必要なら最小限の追記のみ）
- `next.config.js`（大規模変更禁止）
- `.env*`（値を推測・生成しない）

これらへの大規模変更を伴う diff は「高リスク」と判定し、自動適用してはならない。

---

## 2. コーディング標準

- Next.js App Router + React 関数コンポーネント + Hooks
- TypeScript 厳格型付け
- Tailwind CSS ユーティリティクラス
- 2 スペースインデント・シングルクォート・セミコロン

UI コンポーネント内に過度なビジネスロジックを入れず、
複雑なロジックは `features/**` や `app/actions/**` に分離すること。

---

## 3. レベル 2 自動開発ポリシー

あなたは **TASKS.md の Backlog を自動的に処理するエージェント** である。

- Backlog の先頭タスクのみを処理対象とする。
- 必要なファイルを特定・読み取りし、最小限の修正でタスクを完了させる。
- 差分（diff）を生成し、自身で危険度を評価する。
- 低〜中リスクの diff は自動適用してよい。
- 高リスク diff は自動拒否し、理由と代替案を提示してタスクを停止する。
- タスク完了後、TASKS.md を更新し、対象タスクを Backlog から Done に移動する。
- Backlog が空になるまで、この処理を自動で繰り返す。

ユーザーからの「yes proceed」の入力は前提にしない。
**安全判定と適用判断は、すべてあなた自身が行う。**

---

## 4. diff 危険度評価ルール

生成した diff は必ず次の 3 段階で自己評価すること：

### 🟢 Low（自動適用 OK）

- 新規ファイルの追加
- 既存ファイルへの軽微な追記（小さな関数・型・UI 追加など）
- `app/actions/**` への server action 追加
- `features/**` へのロジック追加
- 型定義・バリデーションの追加
- 既存 UI への軽微な Tailwind クラス調整

### 🟡 Medium（慎重だが自動適用 OK）

- 既存のコンポーネントや hooks の編集（挙動改善・仕様対応）
- server action の挙動変更（後方互換を保つ範囲）
- Supabase クエリの追加や軽微な変更
- RLS 設定の微調整（仕様書に沿った修正）

### 🔴 High（自動拒否）

次のいずれかを含む diff は **高リスク** と判定し、自動適用してはならない：

- `app/layout.tsx` の変更
- `middleware.ts` の全面書き換え
- `lib/supabase/client.ts` / `server.ts` の削除・置換
- `next.config.js` の大規模改変
- 100 行以上連続する削除
- 既存 server actions の破壊的変更（API シグネチャの変更・削除など）
- DB スキーマの破壊的変更（カラム削除・型変更など）

High と判定した場合は、以下のみを行う：

1. なぜ High と判断したかを短く説明する。
2. より安全な代替案（分割、別レイヤーへの回避策など）を提案する。
3. diff を適用せず、そのタスクを停止する。

---

## 5. 自動化が許可されるフォルダ

あなたが **自由に読み書きしてよい範囲** は次の通り：

- `app/**`（ただし `app/layout.tsx` は上記の通り特別扱い）
- `app/actions/**`
- `components/**`
- `features/**`
- `lib/hooks/**`
- `lib/validators/**`
- `styles/**`
- `supabase/types.ts`

以下は原則として読み取り専用とする：

- `lib/supabase/**`
- `public/**`（画像追加は可だが、既存アセット削除は避ける）

---

## 6. TASKS.md ベースの開発順序

TASKS.md の Backlog はカテゴリ別に整理されている。
あなたは次の優先度で Backlog のタスクを処理する：

1. Auth / User Management
2. Database / Schema / RLS
3. Server Actions / API Layer
4. Storage / Upload System
5. Item Listing / Purchase Flow
6. MyPage / Profile
7. Admin / Event Management
8. Routing / Permissions
9. UX / Stability
10. Likes Feature（仕様外調整）

タスク間に依存関係がある場合は、
必要な前提タスクを内部的に優先して処理してよいが、
TASKS.md 上のカテゴリ構造は尊重し、できる限り崩さないこと。

---

## 7. タスク実行フロー

ユーザーが Codex に対して「Backlog を処理せよ」と指示した状態を想定する。

1. **要求の分析**

   - 今が「TASKS.md 実行モード」であることを確認する。

2. **対象タスクの選択**

   - Backlog の先頭タスクまたは最優先カテゴリのタスクを 1 件選ぶ。

3. **影響範囲の特定**

   - 関連する `app/**`, `features/**`, `app/actions/**`, `lib/**` を特定・読み取りする。

4. **変更案の設計と diff 生成**

   - 必要な最小の変更でタスクを満たす diff を作る。
   - 既存の構造・命名・パターンを尊重する。

5. **危険度評価**

   - 上記ルールに従い Low / Medium / High を判定する。

6. **適用 or 停止**

   - Low / Medium → 自動で適用してよい。
   - High → diff を適用せず、理由と代替手段を説明して停止する。

7. **TASKS.md 更新**
   - タスク完了後、TASKS.md を開き、対象タスクを Backlog から Done に移動する。
   - 既存のフォーマットを崩さずに更新する。

---

## 8. 安全対策と制約事項（共通）

- `.env` の値は絶対に推測・出力しない。
- `node_modules/` は絶対に変更しない。
- 不要な抽象化や「とりあえずのリファクタリング」は行わない。
- ユーザーが指示していない大規模リファクタリングは避ける。
- UI デザイン（Figma 想定の見た目）は勝手に変えない。

---

## 9. 成功基準

あなたの仕事は、次を満たすときに成功とみなされる：

- 仕様書と TASKS.md に書かれた要件を満たしている。
- Next.js App Router + Supabase の構造が保たれている。
- TypeScript の型チェックが通る。
- `npm run build` が成功する状態を維持している。
- TASKS.md の Backlog が、段階的に Done に移動していく。
