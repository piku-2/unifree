export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          avatar_url: string | null
          university_email: string | null
          created_at?: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          university_email?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          avatar_url?: string | null
          university_email?: string | null
          created_at?: string | null
        }
      },
      items: {
        Row: {
          id: string // bigint represented as string
          owner_id: string | null // spec field
          user_id: string | null // legacy field for compatibility
          title: string
          description: string
          price: number
          images: string[] | null // legacy array storage
          image_url: string | null // spec field (single image path)
          category: string
          condition: string | null
          status: 'selling' | 'reserved' | 'sold' | string // include legacy statuses
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          user_id?: string | null
          title: string
          description: string
          price: number
          images?: string[] | null
          image_url?: string | null
          category: string
          condition?: string | null
          status: 'selling' | 'reserved' | 'sold' | string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          user_id?: string | null
          title?: string
          description?: string
          price?: number
          images?: string[] | null
          image_url?: string | null
          category?: string
          condition?: string | null
          status?: 'selling' | 'reserved' | 'sold' | string
          created_at?: string
          updated_at?: string
        }
      },
      chat_rooms: {
        Row: {
          id: string
          item_id: string
          buyer_id: string
          seller_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          item_id: string
          buyer_id: string
          seller_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          item_id?: string
          buyer_id?: string
          seller_id?: string
          created_at?: string
          updated_at?: string | null
        }
      },
      messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      },
      admin_events: {
        Row: {
          id: string
          name: string
          description: string | null
          date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          date?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
