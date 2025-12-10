# Campus Flea Market App

学生向けの軽量フリマアプリ。
商品一覧 → 詳細 → メッセージによる購入相談 → 取引成立 までを提供。

## Features

- 出品と購入が可能
- 画像複数枚アップロード
- チャット式の購入相談
- マイページで出品管理

---

## Tech Stack

- Vite + React + TypeScript
- shadcn/ui + Tailwind CSS
- Supabase（Auth / DB / Storage）

---

## Scripts

npm install
npm run dev
npm run build

---

## Directory Overview

src/features/items
src/features/messages
src/features/user
src/components/ui
src/components/common
src/libs
src/config

---

## Goals

- 学生でも迷わない最小 UX
- コードの責務分離（UI / feature / api）
- Supabase を最大限活用する構成
