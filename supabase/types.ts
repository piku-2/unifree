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
          username: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          username?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          username?: string | null;
          created_at?: string | null;
        };
      };
      items: {
        Row: {
          id: number;
          owner_id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          status: 'selling' | 'reserved' | 'sold';
          image_url: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          owner_id: string;
          title: string;
          description: string;
          price: number;
          category: string;
          status?: 'selling' | 'reserved' | 'sold';
          image_url?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          owner_id?: string;
          title?: string;
          description?: string;
          price?: number;
          category?: string;
          status?: 'selling' | 'reserved' | 'sold';
          image_url?: string | null;
          created_at?: string | null;
        };
      };
      chat_rooms: {
        Row: {
          id: number;
          item_id: number;
          buyer_id: string;
          seller_id: string;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          item_id: number;
          buyer_id: string;
          seller_id: string;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          item_id?: number;
          buyer_id?: string;
          seller_id?: string;
          created_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: number;
          room_id: number;
          sender_id: string;
          content: string;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          room_id: number;
          sender_id: string;
          content: string;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          room_id?: number;
          sender_id?: string;
          content?: string;
          created_at?: string | null;
        };
      };
      admin_events: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          date: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          date?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          date?: string | null;
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
