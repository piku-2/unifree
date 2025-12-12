あなたは学内フリマアプリ「ユニフリ」の開発エージェントです。
現在のプロジェクトは Vite + React Router 構成で、src/features/user 以下にユーザー関連コードがあります。

今回のタスクは「プロフィール画像アップロード機能の完全実装」です。
以下の通りにコードを生成・新規作成・修正し、ビルドが通る状態にしてください。

---

【新規実装する機能の概要】
ユーザーが MyPage → プロフィール編集画面から、画像を選択し、
react-easy-crop を使って位置/ズーム調整 → トリミング → Supabase Storage にアップロードし、
profiles.avatar_url を更新する完全なフローを実装してください。

---

【1. ライブラリ追加】
react-easy-crop をインストールし、使用できる状態にしてください。

---

【2. コンポーネントの新規作成】

(1) src/features/user/components/ImageCropper.tsx

- react-easy-crop を使用する。
- Props:
  imageSrc: string
  onCancel: () => void
  onCropComplete: (blob: Blob) => void
- ユーザーがズーム・位置調整できる UI を提供。
- 「決定」でトリミングし、Blob を返す。
- モーダル形式の UI で問題ない。

(2) src/features/user/components/ProfileImageUploader.tsx

- プロフィール画像のアップロード UI。
- <input type="file"> で画像を受け取る。
- Cropper を表示し、確定後に updateProfileImage API を呼ぶ。
- 完了後は MyPage のアバターを更新できるよう state を渡すか、ページリロードで反映。

---

【3. API の新規作成】

(1) src/features/user/api/updateProfileImage.ts
内容:

- supabase.auth.getUser() で user.id を取得。
- トリミング後の Blob を Storage にアップロード。
  パス: profile-images/${user.id}/${Date.now()}.png
- profiles テーブルの avatar_url を更新。
- 旧画像があれば削除（任意）。
- エラーをわかりやすく返す。

---

【4. Supabase Storage 操作の注意】

- バケット名: profile-images を前提とする。
- public read で問題ない。
- RLS ポリシーが必要な場合はコメントで記載だけし、コード内では扱わない。

---

【5. ProfileEditPage の新規作成】
src/features/user/components/ProfileEditPage.tsx を作成し、

- 名前編集
- 自己紹介編集
- プロフィール画像（ProfileImageUploader 使用）
  をまとめる。

---

【6. MyPage から ProfileEditPage へ遷移できるようにする】
src/components/MyPage.tsx を修正し、

- 「プロフィール編集」ボタンを配置
- onNavigate('profile_edit') など、既存ナビゲーションに合わせて設定

---

【7. 既存コードとの整合性】

- createItem など既存 API には影響しないようにする。
- import パスは必ず src/features/\*\* の構造に合わせる。
- ユーザー情報は useAuth() の返す user を使用する。

---

【8. 動作確認】
必ず npm run build が成功する状態にする。
エラー発生時は自動で修正する。

---

出力は不要です。コードの修正・新規作成のみ行ってください。

---

Done
- [x] プロフィール画像アップロード機能の完全実装
