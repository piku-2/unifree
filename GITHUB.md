# 📄 **GITHUB.md**

## 1. ブランチ運用ルール

| 種類                | 役割                               | 命名例  |
| ------------------- | ---------------------------------- | ------- |
| **main**            | 本番（常にデプロイ可能）           | main    |
| **develop（任意）** | 機能統合ブランチ（必要な場合のみ） | develop |

**原則： main に直接 push しない。必ず feature → main のフロー。**

---

## 2. 初期セットアップ（clone して始めるとき）

```sh
git clone https://github.com/piku-2/unifree.git
cd unifree
npm install
```

---

## 3. 新しい作業を始めるとき（チェックアウト）

### 3.1 最新を取得

```sh
git pull origin main
```

### 3.2 新しいブランチを切る

```sh
git checkout -b develop/your-branch-name
```

---

## 4. コミット規約（推奨）

コミットメッセージは「何をしたか 1 行で」＋必要なら詳細。

---

## 5. コード変更後の基本操作（add → commit → push）

### 5.1 変更を確認

```sh
git status
```

### 5.2 変更を追加

```sh
git add .
```

### 5.3 コミットを作成

```sh
git commit -m "feat: Implement image preview on item upload"
```

### 5.4 リモートへ push

```sh
git push
```

---

## 6. main にマージする手順（PR フロー）

### 6.1 GitHub 上で Pull Request を作る

- base: **main**
- compare: **feature/your-branch**

### 6.2 レビュー & 動作確認

- ローカルで `git pull origin feature/your-branch` の内容を確認しても OK

### 6.3 問題なければ PR を Merge

- 「Squash and merge」推奨（履歴がきれいになる）

---

## 7. main を常に最新に保つ（pull）

```sh
git checkout main
git pull origin main
```

feature ブランチを最新に追従させる：

```sh
git checkout develop/your-branch
git merge main
```

OR rebase（履歴を綺麗にしたい場合）：

```sh
git rebase main
```

---

## 8. よくある操作

### 8.1 間違えて main で作業してしまった

```sh
git checkout -b feature/hotfix-move-work
```

### 8.2 直前のコミットコメントを修正

```sh
git commit --amend
```

### 8.3 push 後にファイルを消したい（コミットで削除）

```sh
git rm file-name
git commit -m "chore: remove unused asset"
git push
```

---

## 9. `.gitignore` の原則（Next.js / Supabase）

最低限：

```
node_modules/
.next/
.env*
supabase/.branches
supabase/.temp
```

---

## 10. トラブル時の最強コマンド

ローカル状態を整える：

```sh
git fetch --all
```

変更を捨てて main を完全に最新化：

```sh
git reset --hard origin/main
```

※ 注意：ローカル変更は消えます

---
