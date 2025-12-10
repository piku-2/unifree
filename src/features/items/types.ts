export type ItemStatus = 'on_sale' | 'sold_out' | 'trading';

export type Item = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition?: string;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
};

// Optional: View type including user info if joined
export type ItemWithUser = Item & {
  user?: {
    name: string;
    avatar_url?: string;
  };
};
