export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          avatar_url: string | null;
          username: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          avatar_url?: string | null;
          username?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          avatar_url?: string | null;
          username?: string | null;
          created_at?: string | null;
        };
      };
      items: {
        Row: {
          id: string;
          owner_id: string;
          user_id: string | null;
          title: string;
          description: string;
          price: number;
          category: string;
          condition: string;
          status: "selling" | "reserved" | "sold";
          images: string[] | null;
          image_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          user_id?: string | null;
          title: string;
          description: string;
          price: number;
          category: string;
          status?: "selling" | "reserved" | "sold";
          images?: string[] | null;
          image_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          user_id?: string | null;
          title?: string;
          description?: string;
          price?: number;
          category?: string;
          status?: "selling" | "reserved" | "sold";
          images?: string[] | null;
          image_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      chat_rooms: {
        Row: {
          id: string;
          item_id: string;
          buyer_id: string;
          seller_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          item_id: string;
          buyer_id: string;
          seller_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          item_id?: string;
          buyer_id?: string;
          seller_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          room_id: string;
          sender_id: string;
          content: string;
          created_at: string | null;
          is_read: boolean | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          sender_id: string;
          content: string;
          created_at?: string | null;
          is_read?: boolean | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          sender_id?: string;
          content?: string;
          created_at?: string | null;
          is_read?: boolean | null;
        };
      };
      admin_events: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          date?: string | null;
          created_at?: string | null;
        };
      };
      likes: {
        Row: {
          id: string;
          item_id: string;
          user_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          item_id: string;
          user_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          item_id?: string;
          user_id?: string;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
