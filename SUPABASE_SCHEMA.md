# SUPABASE_SCHEMA

## 目的

本ドキュメントは、Supabase を用いた
**推奨データベース構成** を示すものである。

実際の DB 実装・スキーマ・RLS の有無については
**IMPLEMENTATION_SUMMARY.md を唯一の正** とする。

---

## 主なテーブル（想定）

### users / profiles

- id
- name
- avatar_url
- created_at

### items

- id
- title
- description
- price
- owner_id
- created_at

### chat_rooms

- id
- item_id
- seller_id
- buyer_id

### messages

- id
- room_id
- sender_id
- content
- created_at

---

## RLS（想定）

- users：本人のみ
- items：所有者のみ編集可
- chat_rooms / messages：当事者のみ閲覧可

※ 実装保証はしない
※ 実装有無は SUMMARY を参照すること
