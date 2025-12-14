# Implementation Summary

## 1. Project Snapshot
- Next.js App Router (app directory) with parallel legacy React Router SPA under `src/` (`src/main.tsx` renders `src/App.tsx`); mix of server components (e.g., `app/sell/page.tsx`) and client components consuming Supabase directly.
- Supabase used for auth (PKCE/OTP), database, and storage; server-side via `@supabase/ssr` (`lib/supabase/server.ts`) and browser client via `lib/supabase/client.ts`.
- Key dependencies: Next 14, React 18, react-router-dom 7, @supabase/supabase-js 2, @supabase/ssr, react-hook-form + zod, embla-carousel-react, react-easy-crop, uuid, Tailwind-like generated CSS in `src/index.css`.

## 2. Repository Map (Responsibilities)
- `app/`: Next.js App Router pages (home, login, mypage, sell, item detail, chat, admin, auth callback/error). Uses server actions under `app/actions/**` and Supabase server client.
- `app/actions/`: Server actions for items (`createItem`, `getItems`, `getItem`), chat (`startChat`, `sendMessage`), and admin item creation (`adminCreateItem`).
- `middleware.ts`: Protects `/sell`, `/mypage`, `/admin`, `/chat` via Supabase auth check.
- `lib/supabase/`: Supabase server/browser clients; typed with `supabase/types.ts` (numeric IDs).
- `supabase/types.ts`: DB schema types (profiles, items, chat_rooms, messages, admin_events with numeric IDs).
- `src/`: Legacy/parallel SPA code. `src/main.tsx` bootstraps React Router app defined in `src/App.tsx`. Shared UI/components and features live here.
  - `src/components/`: Page-level UI (Home, Login, MyPage, static ItemList/ItemDetail, EventList/Detail, SellForm, ProfileImageEditor) mostly client-side.
  - `src/features/items/**`: Item domain (API calls to Supabase, hooks, form/components).
  - `src/features/chat/**`: Chat domain (API, hooks, components using Supabase realtime).
  - `src/features/user/**`: Auth/profile utilities (AuthProvider, useAuth, profile image upload/crop, MyItem views).
  - `src/features/admin/**`: Admin dashboard stubs using client Supabase.
  - `src/config/**`: Route definitions and navigation types.
  - `src/libs/**`: Supabase client re-export and image crop utilities.
- `styles/`, `src/styles/`: Theme tokens and Tailwind-like base styles consumed by `app/layout.tsx` via `@/src/index.css`.

## 3. Runtime Entry Points / Routing
- Next.js entry: `app/layout.tsx` wraps all pages and imports `src/index.css`.
- Next.js routes:
  - `/` → `app/page.tsx` renders `components/Home` (client).
  - `/login` → `app/login/page.tsx` renders `components/Login`.
  - `/mypage` → `app/mypage/page.tsx` renders `components/MyPage` (client Supabase).
  - `/sell` → `app/sell/page.tsx` server page with server action form.
  - `/items/[id]` → `app/items/[id]/page.tsx` server detail view; can start chat.
  - `/chat` → `app/chat/page.tsx` server list of chat rooms (auth required).
  - `/chat/[roomId]` → `app/chat/[roomId]/page.tsx` server chat view with server action send.
  - `/admin`, `/admin/items`, `/admin/orders` → admin-only server pages.
  - `/auth/callback` → client handler for OTP callback; `/auth/error` simple placeholder.
- Middleware guards `/sell`, `/mypage`, `/admin`, `/chat` (all subpaths) and redirects unauthenticated users to `/login`.
- SPA entry: `src/main.tsx` renders `src/App.tsx` with React Router routes mirroring the above plus `/items/:id/edit`, `/register`, `/auth/callback`, etc., gated via `AuthGate`.

## 4. Implemented Features (Verified)
- Item listing/search/filter: `components/Home` and `features/items/components/ItemList` use `useItems` → `getItems` (Supabase select from `items` with owner profile join) to show newest items with category/price filters; routing via `NavigateHandler` to detail (`app/page.tsx`, `src/App.tsx`).
- Item detail: SPA `features/items/components/ItemDetail` uses `useItem` (Supabase join to owner), supports “like” toggling via `toggleLike`/`getLikeStatus` on `likes` table and starting chat via `createChatRoom`; Next server page `app/items/[id]/page.tsx` fetches item via server action `getItem` and can start chat with `startChat`.
- Selling items:
  - Next server page `app/sell/page.tsx` uses server action `createItem` to upload optional image to Supabase storage bucket `items` and insert into `items` table; redirects home.
  - SPA `features/items/components/SellPage` uses `createItem` API (client Supabase) to insert item with optional image URL; AuthGate-protected in `src/App.tsx`.
  - SPA `features/items/components/ItemForm` + `useItemForm` handle validated creation with multi-image upload (`uploadImage` to `items` bucket) and confirm dialog.
- MyPage & item management: `components/MyPage` uses `useMyItems` (Supabase select from `items` by owner_id/user_id) to list owned items with delete (`deleteItem`), and loads liked items via `getLikedItems`; provides navigation to edit (`ItemForm`) and detail.
- Auth (Supabase OTP PKCE): `components/Login` sends OTP via `supabase.auth.signInWithOtp` (redirect to `/auth/callback`); `app/auth/callback/AuthCallbackClient.tsx` and SPA `features/user/components/AuthCallback` exchange code for session; `useAuth` tracks session via `supabase.auth.getSession`/`onAuthStateChange`; middleware enforces server protection.
- Chat:
  - Server actions: `startChat` ensures auth, fetches item owner, prevents self-chat, finds or inserts `chat_rooms`; `sendMessage` validates room membership before inserting into `messages`.
  - Next pages: `app/chat/page.tsx` lists `chat_rooms` for logged-in user; `app/chat/[roomId]/page.tsx` authorizes participants and shows messages, uses server action to send then revalidates path.
  - SPA: `features/chat/components/ChatList` uses `getChatRooms` (Supabase select with joins/last_message) plus realtime subscriptions on `chat_rooms`; `ChatRoom` uses `useChat` (loads messages, subscribes to inserts via Supabase channel) and `sendMessage` API (client) updating `messages` and `chat_rooms.updated_at`.
- Profile editing & avatars: `features/user/components/ProfileEditPage` upserts `profiles` row and updates Supabase auth metadata (name, bio, avatar_url); `ProfileImageUploader` + `ImageCropper` crop image and `updateProfileImage` uploads to `profile-images` bucket, updates profiles and auth metadata, and cleans previous image; `useProfileImage` hook provides alternate upload path to `avatars` bucket.
- Admin flows:
  - Next admin pages enforce `(user.app_metadata.role === 'admin')`; `app/admin/items/page.tsx` creates items via `adminCreateItem`; `app/admin/orders/page.tsx` lists chat_rooms; `app/admin/page.tsx` links to these.
  - SPA `AdminDashboard` checks email/metadata for admin, lists items via `getItems`, deletes via `deleteItem`; `AdminItemsPage`/`AdminOrdersPage` are UI stubs.
- Storage: Item images uploaded to Supabase storage bucket `items` (server action and `uploadImage` API). Profile images use `profile-images` (updateProfileImage) or `avatars` (`useProfileImage`).

## 5. Partially Implemented / Incomplete (Verified)
- Dual app stacks: Both Next App Router and React Router SPA exist; no integration layer, so routing/auth state may diverge. `AuthProvider` exists but is unused in Next; SPA also uses fallback hook instead of provider.
- Item edit flow: `features/items/components/ItemForm` loads existing item but notes image handling/permission checks as TODO; updateItem API exists but not wired; server actions lack update/delete.
- Likes feature: Client uses `likes` table for toggle/status, but table not defined in `supabase/types.ts` and no server-side enforcement or integration on server-rendered pages.
- Admin UI stubs: SPA `AdminItemsPage` and `AdminOrdersPage` display placeholder text only; Next admin pages create/list but lack validation or feedback; no RLS/authorization enforcement beyond simple metadata checks.
- Static/demo components: `src/components/ItemList`, `src/components/ItemDetail`, `EventList`, `EventDetail`, `SellForm`, `ProfileImageEditor` use hardcoded data or are unused by current routers.
- Profile image handling inconsistency: `updateProfileImage` uses `profile-images` bucket while `useProfileImage` targets `avatars`; only the former is wired into `ProfileEditPage`.
- Data type mismatches: Supabase types in `supabase/types.ts` use numeric IDs and limited columns, while client code (`src/libs/supabase/types.ts`) assumes string IDs, additional fields (condition, images, updated_at), and extended status enums.

## 6. Not Implemented / No Evidence in Code
- No purchase/transaction flow beyond initiating chat; no order/payment logic or tables referenced.
- No RLS/policy handling or server-side validation around likes/favorites; no checks for item ownership on client delete/update beyond basic UI.
- No event management backend despite `admin_events` type; event components are static and not connected to Supabase.

## 7. Data Model & Persistence (As Implemented)
- Tables referenced: `items` (fields vary between server types and client expectations), `profiles` (username/avatar_url), `chat_rooms` (item_id, buyer_id, seller_id), `messages` (room_id, sender_id, content), `admin_events` (unused), `likes` (used by client code but not typed).
- CRUD paths:
  - Items: create via server action `createItem` (uploads to `items` bucket) and client APIs `createItem`/`uploadImage`; fetch via server action `getItems`/`getItem` and client APIs `getItems`/`getItem`/`getMyItems`; delete via client `deleteItem`; update via client `updateItem` (not wired).
  - Chat: create room via `startChat`/`createChatRoom`; messages via `sendMessage` server action and client `sendMessage`; chat listings via server select (Next pages) and client `getChatRooms` with realtime subscriptions.
  - Profiles: upsert/update in `ProfileEditPage`; avatar uploads via `updateProfileImage` (bucket `profile-images`) and alternative `useProfileImage` (bucket `avatars`).
  - Storage buckets: `items` for item images, `profile-images` (and optional `avatars`) for profile pictures.

## 8. Auth / Security (As Implemented)
- Supabase auth PKCE/OTP; client login via `supabase.auth.signInWithOtp`, callback via `exchangeCodeForSession`.
- Middleware enforces auth on `/sell`, `/mypage`, `/admin`, `/chat`; server pages also gate admin routes by `user.app_metadata.role === 'admin'`.
- `startChat`/`sendMessage` server actions check authenticated user and room participation; chat room server page revalidates participant before rendering.
- Client-side delete/edit actions rely on UI without additional server-side authorization; RLS settings not present in code.

## 9. External Integrations
- Supabase: auth, database CRUD, realtime channels, and storage (buckets `items`, `profile-images`, `avatars`).
- UI/UX libs: embla-carousel-react, react-easy-crop for images, react-hook-form/zod for validation (client item form), Radix/vaul etc. available but not prominently used in rendered components.

## 10. Open Questions (From Code Only)
- Which runtime is authoritative: Next App Router vs React Router SPA? Current code maintains both with overlapping pages and divergent behaviors.
- Actual Supabase schema: client code expects string IDs/extra fields and `likes` table, while server types define numeric IDs and fewer columns; unclear which matches the deployed database.
- Storage bucket choice for avatars (`profile-images` vs `avatars`) and whether cleanup paths are correct.
- Absence of RLS/policy definitions leaves authorization reliant on client/server checks only; unclear production posture.
- Event/admin features lack backend wiring despite types; unclear intended workflow for `admin_events` or orders/purchases.
