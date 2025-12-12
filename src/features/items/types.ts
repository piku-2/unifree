export type ItemStatus =
  | 'on_sale'
  | 'sold_out'
  | 'trading'
  | 'selling'
  | 'reserved'
  | 'sold'
  | string;

export type Item = {
  id: string;
  user_id?: string | null;
  owner_id?: string | null;
  title: string;
  description: string;
  price: number;
  images?: string[] | null;
  image_url?: string | null;
  category: string;
  condition?: string;
  status: ItemStatus;
  created_at: string;
  updated_at: string;
};

export type ItemUserProfile = {
  id?: string;
  username?: string | null;
  name?: string | null;
  avatar_url?: string | null;
  department?: string | null;
};

// Optional: View type including user info if joined
export type ItemWithUser = Item & {
  user?: ItemUserProfile;
};
