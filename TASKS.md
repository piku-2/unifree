# Backlog

## **Routing / Page Scaffolds**

- なし

## **Auth / User Management**

- なし

## **Database / Schema / RLS**

- なし

## **Server Actions / API Layer**

- [dev] Generate all server action skeletons（items/chat/admin/profile/storage）? API 基盤
- [dev] Implement required API actions:
  sendMessage / updateItem / adminCreateEvent / adminUpdateStatus / deleteItem など ? 仕様書 7 API

## **Item Listing / Purchase Flow**

## **Storage / Upload System**

- [dev] Define Storage buckets (items/avatar), path naming rules, ACL/RLS policy ? Storage 設計
- [dev] Implement shared upload utility for avatar / item images ? Upload 基盤

## **MyPage / Profile**

## **Admin / Event Management**

- [dev] Create admin_events initial seed + data flow setup ? イベント初期データ

## **Likes Feature (仕様外対策)**

- [dev] Decide on likes feature (implement table + RLS or remove entirely) ? 仕様整合性維持

## **Routing Guards / Permissions**

- [dev] App Router: Route protection (middleware + server-side auth checks) - ルート保護追加

## **UX / Stability**

- なし

---

# **In Progress**

- なし

# **Done**

## **Routing / Page Scaffolds**

- [dev] Align routing/page scaffolds with spec pages (/items/[id], /sell, /mypage, /chat/[roomId], /admin/items, /admin/orders) and navigation map - 仕様書 3/4 画面構成対応

## **Auth / User Management**

- [dev] Implement Supabase email auth (@ac.jp) with login/register routes; remove OAuth-only gap - 仕様書 2 ログイン対応
- [dev] Rebuild Supabase Provider & Auth Context for App Router ? App Router 基盤再構築
- [dev] Add App Router Supabase Auth provider (client user-only context, initialUser from server) - App Router 認証土台
- [dev] App Router: Implement Auth login/logout flow (Google OAuth + Email signIn, server actions) - ログイン/ログアウトフロー完了

## **Database / Schema / RLS**

- [dev] Fix DB schema/types to match spec (items owner_id/image_url/status, profiles.username, admin_events, chat/messages adjustments, likes) - 仕様書 5 Schema
- [dev] Apply RLS policies for items/chat_rooms/messages/admin_events - 仕様書 5 RLS

## **Item Listing / Purchase Flow**

- [dev] Complete item create/edit flow with Storage upload, server action createItem, default selling status, price >=100 - 仕様書 2 出品
- [dev] Implement Item List Flow (App Router /items listing page with Supabase server fetch)
- [dev] Implement Item Detail Flow (App Router /items/[id] detail page with purchase action hook)
- [dev] Implement Purchase Request / startChat Flow (App Router server action)
- [dev] Implement Chat Room Flow (App Router chat UI + sendMessage action)
- [dev] Implement MyPage Flow (App Router /mypage listing for own items and chats)

## **MyPage / Profile**

- [dev] Implement profile editor (username + avatar_url) with server action ? プロフィール編集

## **Admin / Event Management**

- [dev] Build admin event management UI
  (/admin/items, /admin/orders) for event setup, item registration, applications ? 仕様書 2 管理者機能
- [dev] Implement Admin Dashboard for App Router (/admin, /admin/items, /admin/orders) with role checks and status operations

## **UX / Stability**

- [dev] Add loading.tsx / error.tsx for major routes ? UX 最適化

---
